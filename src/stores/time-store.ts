import { create } from "zustand";

interface TimeStore {
	today: number;
	triggerRefresh: () => void;
}

const getStartOfDay = () => new Date().setHours(0, 0, 0, 0);

export const useTimeStore = create<TimeStore>((set) => ({
	today: getStartOfDay(),
	triggerRefresh: () => set({ today: getStartOfDay() }),
}));
