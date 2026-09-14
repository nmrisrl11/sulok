import { create } from "zustand";
import { type Item } from "../db/db";
import { ItemRepository } from "../db/repositories/item-repository";

interface ItemState {
	isDialogOpen: boolean;
	editingItem: Item | null;
	initialUrl: string | null;
	selectedIds: string[];

	// Actions
	setDialogOpen: (open: boolean) => void;
	openCreateDialog: (url?: string) => void;
	openEditDialog: (item: Item) => void;

	// DB Actions
	addItem: (data: Omit<Item, "id" | "createdAt" | "updatedAt">) => Promise<void>;
	updateItem: (id: string, data: Partial<Item>) => Promise<void>;

	// Soft delete / restore
	softDeleteItems: (ids: string[]) => Promise<void>;
	restoreItems: (ids: string[]) => Promise<void>;

	// Hard delete
	hardDeleteItem: (id: string) => Promise<void>;
	hardDeleteSelectedItems: () => Promise<void>;
	emptyTrash: () => Promise<void>;

	// Selection Actions
	toggleSelection: (id: string) => void;
	selectAll: (ids: string[]) => void;
	clearSelection: () => void;
}

export const useItemStore = create<ItemState>((set, get) => ({
	isDialogOpen: false,
	editingItem: null,
	initialUrl: null,
	selectedIds: [],

	setDialogOpen: (open) =>
		set(() => ({
			isDialogOpen: open,
			...(open === false && { editingItem: null, initialUrl: null }),
		})),

	openCreateDialog: (url) =>
		set({ isDialogOpen: true, editingItem: null, initialUrl: url || null }),
	openEditDialog: (item) => set({ isDialogOpen: true, editingItem: item, initialUrl: null }),

	addItem: async (data) => {
		await ItemRepository.save(data);
	},

	updateItem: async (id, data) => {
		await ItemRepository.update(id, data);
	},

	softDeleteItems: async (ids) => {
		await ItemRepository.softDeleteMany(ids);
		set((state) => ({ selectedIds: state.selectedIds.filter((id) => !ids.includes(id)) }));
	},

	restoreItems: async (ids) => {
		await ItemRepository.restoreMany(ids);
		set((state) => ({ selectedIds: state.selectedIds.filter((id) => !ids.includes(id)) }));
	},

	hardDeleteItem: async (id) => {
		await ItemRepository.delete(id);
		set((state) => ({ selectedIds: state.selectedIds.filter((selectedId) => selectedId !== id) }));
	},

	hardDeleteSelectedItems: async () => {
		const { selectedIds } = get();
		if (selectedIds.length === 0) return;
		await ItemRepository.deleteMany(selectedIds);
		set({ selectedIds: [] });
	},

	emptyTrash: async () => {
		await ItemRepository.emptyTrash();
	},

	toggleSelection: (id) =>
		set((state) => ({
			selectedIds: state.selectedIds.includes(id)
				? state.selectedIds.filter((selectedId) => selectedId !== id)
				: [...state.selectedIds, id],
		})),

	selectAll: (ids) => set({ selectedIds: ids }),

	clearSelection: () => set({ selectedIds: [] }),
}));
