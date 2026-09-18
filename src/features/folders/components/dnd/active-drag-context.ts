import { createContext, useContext } from "react";
import type { DragData } from "./explorer-dnd-context";

export const ActiveDragContext = createContext<DragData | null>(null);

export function useActiveDrag() {
	return useContext(ActiveDragContext);
}
