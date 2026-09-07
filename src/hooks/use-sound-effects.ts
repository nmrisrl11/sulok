import { useSettingsStore } from "@/stores/settings-store";
import { type SoundName, play } from "cuelume";
import { useCallback } from "react";

export function useSoundEffects() {
	const playInteraction = useCallback(
		(
			type: keyof ReturnType<
				typeof useSettingsStore.getState
			>["settings"]["soundSettings"]["mappings"],
			forceSound?: SoundName,
		) => {
			const { soundSettings } = useSettingsStore.getState().settings;
			if (!soundSettings.enabled) return;

			const sound = forceSound || soundSettings.mappings[type];
			play(sound, { volume: soundSettings.volume });
		},
		[],
	);

	const playSound = useCallback((sound: SoundName) => {
		const { soundSettings } = useSettingsStore.getState().settings;
		if (!soundSettings.enabled) return;
		play(sound, { volume: soundSettings.volume });
	}, []);

	return {
		playInteraction,
		playSound,
	};
}
