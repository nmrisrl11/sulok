import { create } from "zustand";

interface MoveState {
	isOpen: boolean;
	movingItemIds: string[];
	movingFolderIds: string[];

	openMoveDialog: (params: { itemIds?: string[]; folderIds?: string[] }) => void;
	closeMoveDialog: () => void;
}

export const useMoveStore = create<MoveState>((set) => ({
	isOpen: false,
	movingItemIds: [],
	movingFolderIds: [],

	openMoveDialog: ({ itemIds = [], folderIds = [] }) =>
		set({ isOpen: true, movingItemIds: itemIds, movingFolderIds: folderIds }),

	closeMoveDialog: () => set({ isOpen: false, movingItemIds: [], movingFolderIds: [] }),
}));
