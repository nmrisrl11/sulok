import type { SuloExpression } from "@/stores/logo-store";
import type { SoundName } from "cuelume";

export type AccentColor = string;
export type CornerStyle = "squircle" | "standard" | "custom";
export type LayoutDensity = "compact" | "cozy" | "custom";

export interface AppearanceSettings {
	accentColor: AccentColor;
	cornerStyle: CornerStyle;
	customCornerRadius: number;
	layoutDensity: LayoutDensity;
	customLayoutDensity: number;
}

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
	appearanceSettings: AppearanceSettings;
	soundSettings: SoundSettings;
	suloSettings: SuloSettings;
	// Sync settings (placeholders for future)
}
