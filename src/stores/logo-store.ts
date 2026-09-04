import { create } from "zustand";

export type SuloExpression =
	| "sleepy"
	| "excited"
	| "suspicious"
	| "confused"
	| "curious"
	| "shy"
	| "unimpressed";

interface LogoStore {
	temporaryExpression: SuloExpression | null;
	setTemporaryExpression: (expression: SuloExpression, durationMs?: number) => void;
	clearTemporaryExpression: () => void;
}

let timeoutId: ReturnType<typeof setTimeout>;

export const useLogoStore = create<LogoStore>((set) => ({
	temporaryExpression: null,
	setTemporaryExpression: (expression, durationMs = 2500) => {
		set({ temporaryExpression: expression });
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			set({ temporaryExpression: null });
		}, durationMs);
	},
	clearTemporaryExpression: () => {
		clearTimeout(timeoutId);
		set({ temporaryExpression: null });
	},
}));
