import type { Folder, Item } from "@/db/db";
import { create } from "zustand";

export type DragData = {
	type: "folder" | "item";
	entity: Folder | Item;
	isBulk?: boolean;
	itemIds?: string[];
	folderIds?: string[];
	totalCount?: number;
};

interface ActiveDragState {
	activeData: DragData | null;
	setActiveData: (data: DragData | null) => void;
}

export const useActiveDragStore = create<ActiveDragState>((set) => ({
	activeData: null,
	setActiveData: (data) => set({ activeData: data }),
}));
