import { create } from "zustand";

interface UIState {
	isQuickCustomizeOpen: boolean;
	openQuickCustomize: () => void;
	closeQuickCustomize: () => void;
	toggleQuickCustomize: () => void;
}

export const useUIStore = create<UIState>((set) => ({
	isQuickCustomizeOpen: false,
	openQuickCustomize: () => set({ isQuickCustomizeOpen: true }),
	closeQuickCustomize: () => set({ isQuickCustomizeOpen: false }),
	toggleQuickCustomize: () =>
		set((state) => ({ isQuickCustomizeOpen: !state.isQuickCustomizeOpen })),
}));
