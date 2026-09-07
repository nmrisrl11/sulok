import type { ElementType } from "react";
import {
	ArrivalIcon,
	BloomIcon,
	ChimeIcon,
	DropletIcon,
	ErrorIcon,
	LoadingIcon,
	PageIcon,
	PressIcon,
	PulseIcon,
	ReadyIcon,
	ReleaseIcon,
	ScanIcon,
	SparkleIcon,
	SuccessIcon,
	TickIcon,
	ToggleIcon,
	WhisperIcon,
} from "@/components/icons";
import type { SoundSettings } from "@/types/settings";
import type { SoundName } from "cuelume";

export const SOUND_ICONS: Record<SoundName, ElementType> = {
	chime: ChimeIcon,
	sparkle: SparkleIcon,
	droplet: DropletIcon,
	bloom: BloomIcon,
	whisper: WhisperIcon,
	tick: TickIcon,
	press: PressIcon,
	release: ReleaseIcon,
	toggle: ToggleIcon,
	success: SuccessIcon,
	error: ErrorIcon,
	page: PageIcon,
	loading: LoadingIcon,
	ready: ReadyIcon,
	pulse: PulseIcon,
	scan: ScanIcon,
	arrival: ArrivalIcon,
};

export const INTERACTION_TYPES = [
	{ id: "hover", label: "Navigation Hover" },
	{ id: "press", label: "Primary Click/Press" },
	{ id: "toggle", label: "Toggle/Switch" },
	{ id: "success", label: "Success Notification" },
	{ id: "error", label: "Error/Warning" },
] as const;

export const DEFAULT_SOUND_SETTINGS: SoundSettings = {
	enabled: true,
	volume: 0.5,
	mappings: {
		hover: "tick",
		press: "press",
		toggle: "toggle",
		success: "success",
		error: "error",
	},
};
