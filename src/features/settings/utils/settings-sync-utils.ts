import {
	appearanceSettingsSchema,
	privacySettingsSchema,
	soundSettingsSchema,
	suloSettingsSchema,
	workspaceThemeSchema,
} from "@/schemas";
import type { Settings } from "@/types/settings";

export function exportSettings(settings: Settings, workspaceTheme: string) {
	const content = JSON.stringify({ ...settings, workspaceTheme }, null, 2);
	const blob = new Blob([content], { type: "application/json" });
	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = `sulok-settings-${new Date().toISOString().split("T")[0]}.json`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	setTimeout(() => URL.revokeObjectURL(url), 100);
}

export interface ImportedSettingsPayload extends Partial<Settings> {
	workspaceTheme?: string;
}

export function parseImportedSettings(text: string): ImportedSettingsPayload {
	try {
		const parsed = JSON.parse(text);

		if (!parsed || typeof parsed !== "object") {
			throw new Error("Invalid settings file format.");
		}

		// Basic validation to check if it looks like a Sulok settings file
		const hasSettingsKeys =
			"workspaceTheme" in parsed ||
			"appearanceSettings" in parsed ||
			"soundSettings" in parsed ||
			"suloSettings" in parsed ||
			"privacySettings" in parsed;

		if (!hasSettingsKeys) {
			throw new Error("File does not contain valid Sulok settings.");
		}

		// We only extract the allowed configuration keys
		const sanitized: ImportedSettingsPayload = {};

		if (parsed.workspaceTheme) {
			const res = workspaceThemeSchema.safeParse(parsed.workspaceTheme);
			if (res.success) sanitized.workspaceTheme = res.data;
		}

		if (parsed.appearanceSettings) {
			const res = appearanceSettingsSchema.safeParse(parsed.appearanceSettings);
			if (res.success) sanitized.appearanceSettings = res.data as Settings["appearanceSettings"];
		}

		if (parsed.soundSettings) {
			const res = soundSettingsSchema.safeParse(parsed.soundSettings);
			if (res.success) sanitized.soundSettings = res.data as Settings["soundSettings"];
		}

		if (parsed.suloSettings) {
			const res = suloSettingsSchema.safeParse(parsed.suloSettings);
			if (res.success) sanitized.suloSettings = res.data as Settings["suloSettings"];
		}

		if (parsed.privacySettings) {
			const res = privacySettingsSchema.safeParse(parsed.privacySettings);
			if (res.success) sanitized.privacySettings = res.data as Settings["privacySettings"];
		}

		return sanitized;
	} catch (e) {
		if (e instanceof Error) {
			throw e;
		}
		throw new Error("Failed to parse settings file. It may be corrupted or invalid.");
	}
}
