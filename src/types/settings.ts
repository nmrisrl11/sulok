import type { SuloExpression } from "@/stores/logo-store";
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

export interface SuloSettings {
	expression404: SuloExpression;
	expressionEmptyState: SuloExpression;
	expressionNavbar: SuloExpression;
	expressionQuickAction: SuloExpression;
	expressionPreviewUnavailable: SuloExpression;
	expressionError: SuloExpression;
	whispers: {
		positive: string[];
		negative: string[];
		warning: string[];
		info: string[];
	};
}

export interface Settings {
	soundSettings: SoundSettings;
	suloSettings: SuloSettings;
	// Sync settings (placeholders for future)
}
