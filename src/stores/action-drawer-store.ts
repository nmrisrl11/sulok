import type { Folder, Item } from "@/db/db";
import { create } from "zustand";

interface ActionDrawerState {
	isItemDrawerOpen: boolean;
	isFolderDrawerOpen: boolean;
	activeItem: Item | null;
	activeFolder: Folder | null;
	openItemDrawer: (item: Item) => void;
	openFolderDrawer: (folder: Folder) => void;
	closeItemDrawer: () => void;
	closeFolderDrawer: () => void;
}

export const useActionDrawerStore = create<ActionDrawerState>((set) => ({
	isItemDrawerOpen: false,
	isFolderDrawerOpen: false,
	activeItem: null,
	activeFolder: null,
	openItemDrawer: (item) =>
		set({ isItemDrawerOpen: true, activeItem: item, isFolderDrawerOpen: false }),
	openFolderDrawer: (folder) =>
		set({ isFolderDrawerOpen: true, activeFolder: folder, isItemDrawerOpen: false }),
	closeItemDrawer: () => set({ isItemDrawerOpen: false }),
	closeFolderDrawer: () => set({ isFolderDrawerOpen: false }),
}));
