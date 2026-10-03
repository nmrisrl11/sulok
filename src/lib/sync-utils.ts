import { db } from "@/db/db";
import { setHasDataHint } from "@/lib/storage";
import {
	importFolderSchema,
	importItemSchema,
	type ImportFolder,
	type ImportItem,
} from "@/schemas/import.schema";
import { workspaceThemeSchema } from "@/schemas/settings.schema";
import { useSettingsStore } from "@/stores/settings-store";

export async function exportDataForSync(): Promise<Blob> {
	const folders = await db.folders.filter((f) => !f.deletedAt).toArray();
	const items = await db.items.filter((i) => !i.deletedAt).toArray();
	const settings = useSettingsStore.getState().settings;

	// Strip device-specific settings
	const {
		onboardingStatus: _onboardingStatus,
		onboardingStep: _onboardingStep,
		hasDismissedInstallNudge: _hasDismissedInstallNudge,
		...settingsToExport
	} = settings;

	const payload = {
		folders,
		items,
		settings: settingsToExport,
		theme: localStorage.getItem("sulok-ui-theme") || "system",
	};

	return new Blob([JSON.stringify(payload)], { type: "application/json" });
}

export async function importDataFromSync(payloadJson: string): Promise<void> {
	const payload = JSON.parse(payloadJson);

	if (!payload || typeof payload !== "object") {
		throw new Error("Invalid sync payload");
	}

	const { folders, items, settings, theme } = payload;

	const validatedFolders: ImportFolder[] = [];
	if (Array.isArray(folders)) {
		for (const folder of folders) {
			const result = importFolderSchema.safeParse(folder);
			if (result.success) {
				validatedFolders.push(result.data);
			} else {
				console.warn("Skipping invalid folder during sync:", result.error);
			}
		}
	}

	const validatedItems: ImportItem[] = [];
	if (Array.isArray(items)) {
		for (const item of items) {
			const result = importItemSchema.safeParse(item);
			if (result.success) {
				validatedItems.push(result.data);
			} else {
				console.warn("Skipping invalid item during sync:", result.error);
			}
		}
	}

	await db.transaction("rw", db.folders, db.items, async () => {
		if (validatedFolders.length > 0) {
			await db.folders.bulkPut(
				validatedFolders.map((f) => ({
					...f,
					id: f.id as string,
					parentId: f.parentId ?? null,
					order: 0,
					createdAt: f.createdAt ?? Date.now(),
					updatedAt: f.updatedAt ?? Date.now(),
				})),
			);
		}

		if (validatedItems.length > 0) {
			await db.items.bulkPut(
				validatedItems.map((i) => ({
					...i,
					id: i.id as string,
					folderId: i.folderId ?? undefined,
					createdAt: i.createdAt ?? Date.now(),
					updatedAt: i.updatedAt ?? Date.now(),
				})),
			);
		}
	});

	if (validatedItems.length > 0) {
		setHasDataHint(true);
	}

	if (settings && typeof settings === "object") {
		const {
			onboardingStatus: _onboardingStatus,
			onboardingStep: _onboardingStep,
			hasDismissedInstallNudge: _hasDismissedInstallNudge,
			...safeSettingsToImport
		} = settings;

		useSettingsStore.getState().updateSettings(safeSettingsToImport);
	}

	if (theme && typeof theme === "string") {
		const parsed = workspaceThemeSchema.safeParse(theme);
		if (parsed.success) {
			localStorage.setItem("sulok-ui-theme", parsed.data);
			window.dispatchEvent(new Event("local-theme-change"));
		}
	}
}
