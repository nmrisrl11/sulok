import { ResetButton } from "@/components/reset-button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { INTERACTION_TYPES, SOUND_ICONS } from "@/constants/sounds-settings";
import { useSoundEffects } from "@/hooks";
import { defaultSettings, useSettingsStore } from "@/stores";
import { type SoundName, sounds } from "cuelume";

function AudioSignatureDropdown({
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

	const handleMappingChange = (val: string) => {
		const currentSettings = useSettingsStore.getState().settings.soundSettings;
		updateSettings({
			soundSettings: {
				...currentSettings,
				mappings: { ...currentSettings.mappings, [id]: val as SoundName },
			},
		});
	};

	const handlePreviewSound = (sound: SoundName) => {
		if (enabled) {
			playSound(sound);
		}
	};

	const ActiveIcon = SOUND_ICONS[value] || SOUND_ICONS.tick;

	return (
		<div className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/20 p-3 supports-[corner-shape:squircle]:rounded-2xl supports-[corner-shape:squircle]:corner-squircle">
			<span className="text-sm font-medium text-foreground">{label}</span>
			<DropdownMenu>
				<DropdownMenuTrigger
					disabled={!enabled}
					aria-label={`${label} sound: ${value}`}
					className="flex items-center gap-2 rounded-lg bg-background px-3 py-1.5 text-xs font-medium text-foreground shadow-sm ring-1 ring-border/50 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
				>
					<ActiveIcon className="h-3.5 w-3.5 text-muted-foreground" />
					<span className="capitalize">{value}</span>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="end"
					className="custom-scrollbar max-h-64 w-48 overflow-y-auto"
					data-no-sound="true"
				>
					<DropdownMenuRadioGroup value={value} onValueChange={handleMappingChange}>
						{sounds.map((sound) => {
							const Icon = SOUND_ICONS[sound];
							return (
								<DropdownMenuRadioItem
									key={sound}
									value={sound}
									onPointerEnter={() => handlePreviewSound(sound)}
									className="gap-3 rounded-md px-3 py-2.5"
								>
									<Icon className="h-4 w-4 text-muted-foreground" />
									<span className="capitalize">{sound}</span>
								</DropdownMenuRadioItem>
							);
						})}
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

export function AudioSignaturesControl() {
	const enabled = useSettingsStore((state) => state.settings.soundSettings.enabled);
	const updateSettings = useSettingsStore((state) => state.updateSettings);

	const handleReset = () => {
		const currentSettings = useSettingsStore.getState().settings.soundSettings;
		updateSettings({
			soundSettings: {
				...currentSettings,
				mappings: defaultSettings.soundSettings.mappings,
			},
		});
	};

	return (
		<div
			className={`flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:py-6 sm:first:pt-0 sm:last:pb-0 ${
				!enabled ? "opacity-50 grayscale transition-all duration-300" : ""
			}`}
		>
			<div className="space-y-1">
				<div className="flex items-center justify-between gap-4">
					<h3 className="text-sm font-medium text-foreground">Audio Signatures</h3>
					<ResetButton
						onClick={handleReset}
						disabled={!enabled}
						aria-label="Reset audio signatures"
					/>
				</div>
				<p className="w-full text-sm text-muted-foreground sm:max-w-md">
					Choose which sound plays for different types of interactions.
				</p>
			</div>
			<div className="grid gap-3 pt-2 sm:grid-cols-2">
				{INTERACTION_TYPES.map(({ id, label }) => (
					<AudioSignatureDropdown key={id} id={id} label={label} />
				))}
			</div>
		</div>
	);
}
