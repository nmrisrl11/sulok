import { create } from "zustand";
import { type Bookmark } from "../db/db";
import { BookmarkRepository } from "../db/repositories/bookmark-repository";

interface BookmarkState {
	isDialogOpen: boolean;
	editingBookmark: Bookmark | null;

	// Actions
	setDialogOpen: (open: boolean) => void;
	openCreateDialog: () => void;
	openEditDialog: (bookmark: Bookmark) => void;

	// DB Actions
	addBookmark: (data: Omit<Bookmark, "id" | "createdAt" | "updatedAt">) => Promise<void>;
	updateBookmark: (id: string, data: Partial<Bookmark>) => Promise<void>;
	deleteBookmark: (id: string) => Promise<void>;
}

export const useBookmarkStore = create<BookmarkState>((set) => ({
	isDialogOpen: false,
	editingBookmark: null,

	setDialogOpen: (open) =>
		set(() => ({
			isDialogOpen: open,
			...(open === false && { editingBookmark: null }),
		})),

	openCreateDialog: () => set({ isDialogOpen: true, editingBookmark: null }),
	openEditDialog: (bookmark) => set({ isDialogOpen: true, editingBookmark: bookmark }),

	addBookmark: async (data) => {
		await BookmarkRepository.save(data);
	},

	updateBookmark: async (id, data) => {
		await BookmarkRepository.update(id, data);
	},

	deleteBookmark: async (id) => {
		await BookmarkRepository.delete(id);
	},
}));
