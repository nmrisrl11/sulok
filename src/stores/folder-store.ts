import { create } from "zustand";
import { type Folder } from "../db/db";
import { FolderRepository } from "../db/repositories/folder-repository";

interface FolderState {
	isDialogOpen: boolean;
	editingFolder: Folder | null;
	initialParentId: string | null;
	selectedFolderIds: string[];

	// Actions
	setDialogOpen: (open: boolean) => void;
	openCreateDialog: (parentId?: string | null) => void;
	openEditDialog: (folder: Folder) => void;

	// DB Actions
	addFolder: (data: Omit<Folder, "id" | "createdAt" | "updatedAt" | "order">) => Promise<void>;
	updateFolder: (id: string, data: Partial<Folder>) => Promise<void>;

	// Soft delete / restore
	softDeleteFolders: (ids: string[]) => Promise<void>;
	restoreFolders: (ids: string[]) => Promise<void>;

	// Hard delete
	hardDeleteFolder: (id: string) => Promise<void>;
	hardDeleteSelectedFolders: () => Promise<void>;
	emptyTrash: () => Promise<void>;

	// Selection Actions
	toggleSelection: (id: string) => void;
	selectAll: (ids: string[]) => void;
	clearSelection: () => void;
}

export const useFolderStore = create<FolderState>((set, get) => ({
	isDialogOpen: false,
	editingFolder: null,
	initialParentId: null,
	selectedFolderIds: [],

	setDialogOpen: (open) =>
		set(() => ({
			isDialogOpen: open,
			...(open === false && { editingFolder: null, initialParentId: null }),
		})),

	openCreateDialog: (parentId) =>
		set({ isDialogOpen: true, editingFolder: null, initialParentId: parentId || null }),

	openEditDialog: (folder) =>
		set({ isDialogOpen: true, editingFolder: folder, initialParentId: null }),

	addFolder: async (data) => {
		await FolderRepository.save(data);
	},

	updateFolder: async (id, data) => {
		await FolderRepository.update(id, data);
	},

	softDeleteFolders: async (ids) => {
		await FolderRepository.softDelete(ids);
		set((state) => ({
			selectedFolderIds: state.selectedFolderIds.filter((id) => !ids.includes(id)),
		}));
	},

	restoreFolders: async (ids) => {
		await FolderRepository.restore(ids);
		set((state) => ({
			selectedFolderIds: state.selectedFolderIds.filter((id) => !ids.includes(id)),
		}));
	},

	hardDeleteFolder: async (id) => {
		await FolderRepository.delete(id);
		set((state) => ({
			selectedFolderIds: state.selectedFolderIds.filter((selectedId) => selectedId !== id),
		}));
	},

	hardDeleteSelectedFolders: async () => {
		const { selectedFolderIds } = get();
		if (selectedFolderIds.length === 0) return;
		await FolderRepository.deleteMany(selectedFolderIds);
		set({ selectedFolderIds: [] });
	},

	emptyTrash: async () => {
		await FolderRepository.emptyTrash();
	},

	toggleSelection: (id) =>
		set((state) => ({
			selectedFolderIds: state.selectedFolderIds.includes(id)
				? state.selectedFolderIds.filter((selectedId) => selectedId !== id)
				: [...state.selectedFolderIds, id],
		})),

	selectAll: (ids) => set({ selectedFolderIds: ids }),

	clearSelection: () => set({ selectedFolderIds: [] }),
}));
