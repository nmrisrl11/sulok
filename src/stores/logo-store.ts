import { create } from "zustand";

export type SuloExpression =
	| "sleepy"
	| "excited"
	| "suspicious"
	| "confused"
	| "curious"
	| "shy"
	| "unimpressed"
	| "angry"
	| "attentive"
	| "happy"
	| "laughing"
	| "neutral"
	| "proud"
	| "sad"
	| "scared"
	| "surprised";

interface LogoStore {
	temporaryExpression: SuloExpression | null;
	whisperText: string | null;
	setTemporaryExpression: (expression: SuloExpression, durationMs?: number) => void;
	setReaction: (expression: SuloExpression, text: string, durationMs?: number) => void;
	clearTemporaryExpression: () => void;
}

let timeoutId: ReturnType<typeof setTimeout>;

export const useLogoStore = create<LogoStore>((set) => ({
	temporaryExpression: null,
	whisperText: null,
	setTemporaryExpression: (expression, durationMs = 2500) => {
		set({ temporaryExpression: expression });
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			set({ temporaryExpression: null, whisperText: null });
		}, durationMs);
	},
	setReaction: (expression, text, durationMs = 3000) => {
		set({ temporaryExpression: expression, whisperText: text });
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			set({ temporaryExpression: null, whisperText: null });
		}, durationMs);
	},
	clearTemporaryExpression: () => {
		clearTimeout(timeoutId);
		set({ temporaryExpression: null, whisperText: null });
	},
}));
