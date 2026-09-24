import { ResetButton } from "@/components/reset-button";
import { Slider } from "@/components/ui/slider";
import { useSoundEffects } from "@/hooks";
import { defaultSettings, useSettingsStore } from "@/stores";
import { useState } from "react";

export function VolumeControl() {
	const volume = useSettingsStore((state) => state.settings.soundSettings.volume);
	const enabled = useSettingsStore((state) => state.settings.soundSettings.enabled);
	const updateSettings = useSettingsStore((state) => state.updateSettings);
	const pressMapping = useSettingsStore((state) => state.settings.soundSettings.mappings.press);
	const { playSound } = useSoundEffects();

	const [localVolume, setLocalVolume] = useState(volume);
	const [prevStoreVolume, setPrevStoreVolume] = useState(volume);

	if (volume !== prevStoreVolume) {
		setLocalVolume(volume);
		setPrevStoreVolume(volume);
	}

	const handleVolumeChange = (value: number[]) => {
		setLocalVolume(value[0]);
	};

	const handleVolumeCommit = (value: number[]) => {
		const currentSettings = useSettingsStore.getState().settings.soundSettings;
		updateSettings({ soundSettings: { ...currentSettings, volume: value[0] } });
		if (enabled) {
			playSound(pressMapping);
		}
	};

	const handleReset = () => {
		const currentSettings = useSettingsStore.getState().settings.soundSettings;
		updateSettings({
			soundSettings: { ...currentSettings, volume: defaultSettings.soundSettings.volume },
		});
		if (enabled) {
			playSound(pressMapping);
		}
	};

	return (
		<div
			className={`flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:py-6 sm:first:pt-0 sm:last:pb-0 ${
				!enabled ? "opacity-50 grayscale transition-all duration-300" : ""
			}`}
		>
			<div className="space-y-1">
				<div className="flex items-center justify-between gap-4">
					<h3 className="text-sm font-medium text-foreground">Master Volume</h3>
					<ResetButton onClick={handleReset} disabled={!enabled} />
				</div>
				<p className="w-full text-sm text-muted-foreground sm:max-w-md">
					Adjust the overall volume of sound effects across the application.
				</p>
			</div>
			<div className="flex w-full shrink-0 flex-col gap-4 pt-2">
				<div className="animate-in space-y-4 rounded-xl bg-muted/30 p-4 shadow-engraved fade-in slide-in-from-top-1 supports-[corner-shape:squircle]:rounded-2xl supports-[corner-shape:squircle]:corner-squircle">
					<div className="flex items-center justify-between">
						<h3 className="text-xs text-muted-foreground">Volume Level</h3>
						<span className="text-xs font-medium text-foreground tabular-nums">
							{Math.round(localVolume * 100)}%
						</span>
					</div>
					<Slider
						id="master-volume"
						min={0}
						max={1}
						step={0.01}
						value={[localVolume]}
						onValueChange={handleVolumeChange}
						onValueCommit={handleVolumeCommit}
						disabled={!enabled}
						aria-label="Master volume"
					/>
				</div>
			</div>
		</div>
	);
}
