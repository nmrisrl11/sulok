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

		if (parsed.workspaceTheme && typeof parsed.workspaceTheme === "string") {
			sanitized.workspaceTheme = parsed.workspaceTheme;
		}

		if (parsed.appearanceSettings && typeof parsed.appearanceSettings === "object") {
			sanitized.appearanceSettings = { ...parsed.appearanceSettings };
		}

		if (parsed.soundSettings && typeof parsed.soundSettings === "object") {
			sanitized.soundSettings = { ...parsed.soundSettings };
		}

		if (parsed.suloSettings && typeof parsed.suloSettings === "object") {
			sanitized.suloSettings = { ...parsed.suloSettings };
		}

		if (parsed.privacySettings && typeof parsed.privacySettings === "object") {
			sanitized.privacySettings = { ...parsed.privacySettings };
		}

		return sanitized;
	} catch (e) {
		if (e instanceof Error) {
			throw e;
		}
		throw new Error("Failed to parse settings file. It may be corrupted or invalid.");
	}
}
