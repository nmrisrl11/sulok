import { create } from "zustand";
import { type Item } from "../db/db";
import { ItemRepository } from "../db/repositories/item-repository";

interface ItemState {
	isDialogOpen: boolean;
	editingItem: Item | null;

	// Actions
	setDialogOpen: (open: boolean) => void;
	openCreateDialog: () => void;
	openEditDialog: (item: Item) => void;

	// DB Actions
	addItem: (data: Omit<Item, "id" | "createdAt" | "updatedAt">) => Promise<void>;
	updateItem: (id: string, data: Partial<Item>) => Promise<void>;
	deleteItem: (id: string) => Promise<void>;
}

export const useItemStore = create<ItemState>((set) => ({
	isDialogOpen: false,
	editingItem: null,

	setDialogOpen: (open) =>
		set(() => ({
			isDialogOpen: open,
			...(open === false && { editingItem: null }),
		})),

	openCreateDialog: () => set({ isDialogOpen: true, editingItem: null }),
	openEditDialog: (item) => set({ isDialogOpen: true, editingItem: item }),

	addItem: async (data) => {
		await ItemRepository.save(data);
	},

	updateItem: async (id, data) => {
		await ItemRepository.update(id, data);
	},

	deleteItem: async (id) => {
		await ItemRepository.delete(id);
	},
}));
