import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { APP_INFO } from "@/constants/app-info";
import { INTERACTION_TYPES, SOUND_ICONS } from "@/constants/sounds-settings";
import { useSoundEffects } from "@/hooks/use-sound-effects";
import { defaultSettings, useSettingsStore } from "@/stores/settings-store";
import { sounds, type SoundName } from "cuelume";
import { RotateCcwIcon } from "lucide-react";
import { useState } from "react";

export function SoundSettingsSection() {
	const { settings, updateSettings } = useSettingsStore();
	const soundSettings = settings.soundSettings;
	const { playSound } = useSoundEffects();

	const [localVolume, setLocalVolume] = useState(soundSettings.volume);
	const [prevStoreVolume, setPrevStoreVolume] = useState(soundSettings.volume);

	if (soundSettings.volume !== prevStoreVolume) {
		setLocalVolume(soundSettings.volume);
		setPrevStoreVolume(soundSettings.volume);
	}

	const handleRestore = () => {
		updateSettings({ soundSettings: defaultSettings.soundSettings });
	};

	const handleEnabledChange = (enabled: boolean) => {
		updateSettings({ soundSettings: { ...soundSettings, enabled } });
	};

	const handleVolumeChange = (value: number[]) => {
		setLocalVolume(value[0]);
	};

	const handleVolumeCommit = (value: number[]) => {
		updateSettings({ soundSettings: { ...soundSettings, volume: value[0] } });
		if (soundSettings.enabled) {
			playSound(soundSettings.mappings.press);
		}
	};

	const handleMappingChange = (type: keyof typeof soundSettings.mappings, sound: SoundName) => {
		updateSettings({
			soundSettings: {
				...soundSettings,
				mappings: { ...soundSettings.mappings, [type]: sound },
			},
		});
	};

	const handlePreviewSound = (sound: SoundName) => {
		if (soundSettings.enabled) {
			playSound(sound);
		}
	};

	return (
		<div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
			<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
				<div>
					<h2 className="font-heading text-xl font-semibold">Sound FX</h2>
					<p className="text-sm text-muted-foreground mt-1">
						Bring your corner to life with subtle audio cues as you interact with {APP_INFO.name}.
					</p>
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={handleRestore}
					className="shrink-0 gap-2 w-full sm:w-auto corner-squircle supports-[corner-shape:squircle]:rounded-xl"
				>
					<RotateCcwIcon className="w-3.5 h-3.5" />
					Reset Configuration
				</Button>
			</div>

			<div className="space-y-8">
				<div className="space-y-4 pb-8 border-b border-border/50">
					<div className="flex items-center justify-between gap-4">
						<Label className="text-sm font-semibold" htmlFor="enable-sound">
							Play Interaction Sounds
						</Label>
						<Switch
							id="enable-sound"
							checked={soundSettings.enabled}
							onCheckedChange={handleEnabledChange}
						/>
					</div>
					<p className="text-muted-foreground text-sm max-w-md">
						Play audio feedback for interactions like navigating or saving items.
					</p>
				</div>

				{soundSettings.enabled && (
					<>
						<div className="space-y-4 pb-8 border-b border-border/50">
							<div className="flex items-center justify-between">
								<h3 className="text-sm font-semibold">Volume</h3>
								<span className="text-muted-foreground text-sm">
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
								disabled={!soundSettings.enabled}
								aria-label="Master volume"
								className="py-2"
							/>
						</div>

						<div className="space-y-4 pb-8 border-b border-border/50">
							<div>
								<h3 className="text-sm font-semibold">Audio Signatures</h3>
								<p className="text-muted-foreground text-sm mt-1">
									Choose which sound plays for different types of interactions.
								</p>
							</div>

							<div className="grid gap-4 sm:grid-cols-2">
								{INTERACTION_TYPES.map(({ id, label }) => (
									<div key={id} className="space-y-2">
										<Label htmlFor={`sound-${id}`} className="text-sm">
											{label}
										</Label>
										<Select
											value={soundSettings.mappings[id]}
											onValueChange={(val: string) => handleMappingChange(id, val as SoundName)}
										>
											<SelectTrigger
												id={`sound-${id}`}
												className="w-full corner-squircle supports-[corner-shape:squircle]:rounded-xl"
											>
												<SelectValue placeholder="Select sound" />
											</SelectTrigger>
											<SelectContent position="popper" className="max-h-75" data-no-sound="true">
												{sounds.map((sound) => {
													const Icon = SOUND_ICONS[sound];
													return (
														<SelectItem
															key={sound}
															value={sound}
															onPointerEnter={() => handlePreviewSound(sound)}
															className="py-2.5 px-3 rounded-md"
														>
															<div className="flex items-center gap-3">
																<div className="w-5 flex justify-center items-center shrink-0">
																	<Icon className="w-4 h-4 text-muted-foreground" />
																</div>
																<span className="capitalize">{sound}</span>
															</div>
														</SelectItem>
													);
												})}
											</SelectContent>
										</Select>
									</div>
								))}
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
