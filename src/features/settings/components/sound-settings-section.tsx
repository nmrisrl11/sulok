import { ResetButton } from "@/components/reset-button";
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
import { useState } from "react";

function VolumeControl() {
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

	return (
		<div className="space-y-4 border-b border-border/50 pb-8">
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-semibold">Volume</h3>
				<span className="text-sm text-muted-foreground">{Math.round(localVolume * 100)}%</span>
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
				className="py-2"
			/>
		</div>
	);
}

function AudioSignatureSelect({
	id,
	label,
}: {
	id: keyof typeof defaultSettings.soundSettings.mappings;
	label: string;
}) {
	const value = useSettingsStore((state) => state.settings.soundSettings.mappings[id]);
	const enabled = useSettingsStore((state) => state.settings.soundSettings.enabled);
	const updateSettings = useSettingsStore((state) => state.updateSettings);
	const { playSound } = useSoundEffects();

	const handleMappingChange = (val: SoundName) => {
		const currentSettings = useSettingsStore.getState().settings.soundSettings;
		updateSettings({
			soundSettings: {
				...currentSettings,
				mappings: { ...currentSettings.mappings, [id]: val },
			},
		});
	};

	const handlePreviewSound = (sound: SoundName) => {
		if (enabled) {
			playSound(sound);
		}
	};

	return (
		<div className="space-y-2">
			<Label htmlFor={`sound-${id}`} className="text-sm">
				{label}
			</Label>
			<Select value={value} onValueChange={(val: string) => handleMappingChange(val as SoundName)}>
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
								className="rounded-md px-3 py-2.5"
							>
								<div className="flex items-center gap-3">
									<div className="flex w-5 shrink-0 items-center justify-center">
										<Icon className="h-4 w-4 text-muted-foreground" />
									</div>
									<span className="capitalize">{sound}</span>
								</div>
							</SelectItem>
						);
					})}
				</SelectContent>
			</Select>
		</div>
	);
}

export function SoundSettingsSection() {
	const enabled = useSettingsStore((state) => state.settings.soundSettings.enabled);
	const updateSettings = useSettingsStore((state) => state.updateSettings);

	const handleRestore = () => {
		updateSettings({ soundSettings: defaultSettings.soundSettings });
	};

	const handleEnabledChange = (enabledValue: boolean) => {
		const currentSettings = useSettingsStore.getState().settings.soundSettings;
		updateSettings({ soundSettings: { ...currentSettings, enabled: enabledValue } });
	};

	return (
		<div className="animate-in space-y-8 duration-300 fade-in slide-in-from-bottom-2">
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
				<div>
					<h2 className="font-heading text-xl font-semibold">Sound FX</h2>
					<p className="mt-1 text-sm text-muted-foreground">
						Bring your corner to life with subtle audio cues as you interact with {APP_INFO.name}.
					</p>
				</div>
				<ResetButton
					onClick={handleRestore}
					label="Reset Configuration"
					className="corner-squircle supports-[corner-shape:squircle]:rounded-xl"
				/>
			</div>

			<div className="space-y-8">
				<div className="space-y-4 border-b border-border/50 pb-8">
					<div className="flex items-center justify-between gap-4">
						<Label className="text-sm font-semibold" htmlFor="enable-sound">
							Play Interaction Sounds
						</Label>
						<Switch id="enable-sound" checked={enabled} onCheckedChange={handleEnabledChange} />
					</div>
					<p className="max-w-md text-sm text-muted-foreground">
						Play audio feedback for interactions like navigating or saving items.
					</p>
				</div>

				{enabled && (
					<>
						<VolumeControl />

						<div className="space-y-4 border-b border-border/50 pb-8">
							<div>
								<h3 className="text-sm font-semibold">Audio Signatures</h3>
								<p className="mt-1 text-sm text-muted-foreground">
									Choose which sound plays for different types of interactions.
								</p>
							</div>

							<div className="grid gap-4 sm:grid-cols-2">
								{INTERACTION_TYPES.map(({ id, label }) => (
									<AudioSignatureSelect key={id} id={id} label={label} />
								))}
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
