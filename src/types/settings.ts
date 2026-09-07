import type { SoundName } from "cuelume";

export interface SoundSettings {
	enabled: boolean;
	volume: number;
	mappings: {
		hover: SoundName;
		press: SoundName;
		toggle: SoundName;
		success: SoundName;
		error: SoundName;
	};
}

export interface Settings {
	soundSettings: SoundSettings;
	// Sulo Customization (placeholders for future)
	// Sync settings (placeholders for future)
}
