import { create } from "zustand";

export const EXPRESSIONS = [
	"sleepy",
	"excited",
	"suspicious",
	"confused",
	"curious",
	"shy",
	"unimpressed",
	"angry",
	"attentive",
	"happy",
	"laughing",
	"neutral",
	"proud",
	"sad",
	"scared",
	"surprised",
] as const;

export type SuloExpression = (typeof EXPRESSIONS)[number];

interface LogoStore {
	temporaryExpression: SuloExpression | null;
	whisperText: string | null;
	isWhisperVisible: boolean;
	isSuloVisible: boolean;
	setTemporaryExpression: (expression: SuloExpression, durationMs?: number) => void;
	setReaction: (expression: SuloExpression, text: string, durationMs?: number) => void;
	clearTemporaryExpression: () => void;
	setIsWhisperVisible: (visible: boolean) => void;
	setIsSuloVisible: (visible: boolean) => void;
}

let timeoutId: ReturnType<typeof setTimeout>;

export const useLogoStore = create<LogoStore>((set) => ({
	temporaryExpression: null,
	whisperText: null,
	isWhisperVisible: false,
	isSuloVisible: false,
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
	setIsWhisperVisible: (visible) => set({ isWhisperVisible: visible }),
	setIsSuloVisible: (visible) => set({ isSuloVisible: visible }),
}));
