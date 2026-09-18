import { create } from "zustand";
import type { DragData } from "./explorer-dnd-context";

interface ActiveDragState {
	activeData: DragData | null;
	setActiveData: (data: DragData | null) => void;
}

export const useActiveDragStore = create<ActiveDragState>((set) => ({
	activeData: null,
	setActiveData: (data) => set({ activeData: data }),
}));
