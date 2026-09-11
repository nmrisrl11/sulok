import { DEFAULT_SOUND_SETTINGS } from "@/constants/sounds-settings";
import { WHISPER_PHRASES } from "@/constants/whispers";
import { EXPRESSIONS, type SuloExpression } from "@/stores/logo-store";
import type { Settings } from "@/types/settings";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const defaultSettings: Settings = {
	appearanceSettings: {
		accentColor: "foreground",
		cornerStyle: "squircle",
		customCornerRadius: 16,
		layoutDensity: "compact",
		customLayoutDensity: 12,
	},
	soundSettings: DEFAULT_SOUND_SETTINGS,
	suloSettings: {
		expression404: "confused",
		expressionEmptyState: "sleepy",
		expressionNavbar: "sleepy",
		expressionQuickAction: "sleepy",
		expressionPreviewUnavailable: "neutral",
		expressionError: "sad",
		whispers: WHISPER_PHRASES,
	},
};

interface SettingsState {
	settings: Settings;
	updateSettings: (settings: Partial<Settings>) => void;
}

function isObject(item: unknown): item is Record<string, unknown> {
	return Boolean(item && typeof item === "object" && !Array.isArray(item));
}

function deepMerge<T>(target: unknown, source: unknown): T {
	if (!isObject(target) || !isObject(source)) {
		return (source === undefined ? target : source) as T;
	}

	const output: Record<string, unknown> = { ...target };
	Object.keys(source).forEach((key) => {
		if (isObject(source[key])) {
			if (!(key in target)) {
				Object.assign(output, { [key]: source[key] });
			} else {
				output[key] = deepMerge(target[key], source[key]);
			}
		} else {
			Object.assign(output, { [key]: source[key] });
		}
	});
	return output as T;
}

const mergeState = (persistedState: unknown, currentState: SettingsState) => {
	const state = persistedState as Partial<SettingsState>;
	const safeSettings = (isObject(state?.settings) ? state.settings : {}) as Partial<Settings>;

	// Prevent invalid soundSettings from overriding the defaults with null/undefined
	if (safeSettings.soundSettings === null || typeof safeSettings.soundSettings !== "object") {
		delete safeSettings.soundSettings;
	}

	// Validate appearance settings
	if (!isObject(safeSettings.appearanceSettings)) {
		delete safeSettings.appearanceSettings;
	} else {
		const appearance = safeSettings.appearanceSettings as unknown as Record<string, unknown>;
		if (appearance.accentColor !== undefined) {
			const color = appearance.accentColor as string;
			const legacyMap: Record<string, string> = {
				amber: "#C49A6C",
				charcoal: "#1E1B18",
				rose: "#e11d48",
				blue: "#3b82f6",
				green: "#22c55e",
			};
			if (legacyMap[color]) {
				appearance.accentColor = legacyMap[color];
			} else if (color !== "foreground" && !/^#([0-9A-Fa-f]{3}){1,2}$/.test(color)) {
				delete appearance.accentColor;
			}
		}
		const validStyles = ["squircle", "standard", "custom"];
		if (
			appearance.cornerStyle !== undefined &&
			!validStyles.includes(appearance.cornerStyle as string)
		) {
			delete appearance.cornerStyle;
		}
		if (appearance.customCornerRadius !== undefined) {
			const val = appearance.customCornerRadius as number;
			if (!Number.isFinite(val) || val < 0 || val > 32) {
				delete appearance.customCornerRadius;
			}
		}
		const validDensities = ["compact", "cozy", "custom"];
		if (
			appearance.layoutDensity !== undefined &&
			!validDensities.includes(appearance.layoutDensity as string)
		) {
			delete appearance.layoutDensity;
		}
		if (appearance.customLayoutDensity !== undefined) {
			const val = appearance.customLayoutDensity as number;
			if (!Number.isFinite(val) || val < 4 || val > 32) {
				delete appearance.customLayoutDensity;
			}
		}
	}

	// Prevent invalid suloSettings from overriding the defaults with null/undefined
	if (safeSettings.suloSettings === null || typeof safeSettings.suloSettings !== "object") {
		delete safeSettings.suloSettings;
	} else {
		const sulo = safeSettings.suloSettings as unknown as Record<string, unknown>;
		const expressionFields = [
			"expression404",
			"expressionEmptyState",
			"expressionNavbar",
			"expressionQuickAction",
			"expressionPreviewUnavailable",
			"expressionError",
		];

		for (const field of expressionFields) {
			if (sulo[field] !== undefined && !EXPRESSIONS.includes(sulo[field] as SuloExpression)) {
				delete sulo[field];
			}
		}

		if (sulo.whispers !== undefined) {
			if (!isObject(sulo.whispers)) {
				delete sulo.whispers;
			} else {
				const categories = ["positive", "negative", "warning", "info"];
				for (const cat of categories) {
					const arr = sulo.whispers[cat];
					if (arr !== undefined) {
						if (!Array.isArray(arr) || !arr.every((item) => typeof item === "string")) {
							delete sulo.whispers[cat];
						}
					}
				}
			}
		}
	}

	const mergedSettings = deepMerge<Settings>(defaultSettings, safeSettings);

	return {
		...currentState,
		...state,
		settings: mergedSettings,
	} as SettingsState;
};

export const useSettingsStore = create<SettingsState>()(
	persist(
		(set) => ({
			settings: defaultSettings,

			updateSettings: (newSettings) =>
				set((state) => ({
					settings: { ...state.settings, ...newSettings },
				})),
		}),
		{
			name: "sulok-settings-store",
			partialize: (state) => ({ settings: state.settings }),
			merge: mergeState,
		},
	),
);
