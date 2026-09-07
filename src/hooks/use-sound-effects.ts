import { useSettingsStore } from "@/stores/settings-store";
import { type SoundName, play, setEnabled, setVolume } from "cuelume";
import { useCallback, useEffect } from "react";

export function useSoundEffects() {
	const { soundSettings } = useSettingsStore((state) => state.settings);

	// Sync global cuelume settings
	useEffect(() => {
		setEnabled(soundSettings.enabled);
		setVolume(soundSettings.volume);
	}, [soundSettings.enabled, soundSettings.volume]);

	const playInteraction = useCallback(
		(type: keyof typeof soundSettings.mappings, forceSound?: SoundName) => {
			if (!soundSettings.enabled) return;

			const sound = forceSound || soundSettings.mappings[type];
			play(sound, { volume: soundSettings.volume });
		},
		[soundSettings],
	);

	const playSound = useCallback(
		(sound: SoundName) => {
			if (!soundSettings.enabled) return;
			play(sound, { volume: soundSettings.volume });
		},
		[soundSettings],
	);

	return {
		playInteraction,
		playSound,
	};
}
