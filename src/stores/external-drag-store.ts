import { create } from "zustand";

export type ExternalDropTarget =
	| { type: "folder"; id: string; name: string }
	| { type: "breadcrumb"; id: string | null; name?: string }
	| { type: "quick-link" }
	| { type: "explorer" }
	| null;

interface ExternalDragState {
	isDraggingExternal: boolean;
	activeTarget: ExternalDropTarget;
	setIsDraggingExternal: (dragging: boolean) => void;
	setActiveTarget: (target: ExternalDropTarget) => void;
	clearExternalDrag: () => void;
}

export const useExternalDragStore = create<ExternalDragState>((set) => ({
	isDraggingExternal: false,
	activeTarget: null,
	setIsDraggingExternal: (dragging) =>
		set((state) =>
			state.isDraggingExternal === dragging ? state : { isDraggingExternal: dragging },
		),
	setActiveTarget: (target) => set({ activeTarget: target }),
	clearExternalDrag: () => set({ isDraggingExternal: false, activeTarget: null }),
}));
