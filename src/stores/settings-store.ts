import { DEFAULT_SOUND_SETTINGS } from "@/constants/sounds-settings";
import type { Settings } from "@/types/settings";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const defaultSettings: Settings = {
	soundSettings: DEFAULT_SOUND_SETTINGS,
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
