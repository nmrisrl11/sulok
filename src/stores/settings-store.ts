import { DEFAULT_SOUND_SETTINGS } from "@/constants/sounds-settings";
import { WHISPER_PHRASES } from "@/constants/whispers";
import { EXPRESSIONS, type SuloExpression } from "@/stores/logo-store";
import type { Settings } from "@/types/settings";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const defaultSettings: Settings = {
	appearanceSettings: {
		accentColor: "charcoal",
		cornerStyle: "squircle",
		layoutDensity: "compact",
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
	if (
		safeSettings.appearanceSettings === null ||
		typeof safeSettings.appearanceSettings !== "object"
	) {
		delete safeSettings.appearanceSettings;
	} else {
		const appearance = safeSettings.appearanceSettings as unknown as Record<string, unknown>;
		const validColors = ["charcoal", "amber", "rose", "blue", "green"];
		if (
			appearance.accentColor !== undefined &&
			!validColors.includes(appearance.accentColor as string)
		) {
			delete appearance.accentColor;
		}
		const validStyles = ["squircle", "standard"];
		if (
			appearance.cornerStyle !== undefined &&
			!validStyles.includes(appearance.cornerStyle as string)
		) {
			delete appearance.cornerStyle;
		}
		const validDensities = ["compact", "cozy"];
		if (
			appearance.layoutDensity !== undefined &&
			!validDensities.includes(appearance.layoutDensity as string)
		) {
			delete appearance.layoutDensity;
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
