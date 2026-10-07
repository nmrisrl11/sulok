import { db } from "@/db/db";
import { parseImportedSettings } from "@/features/settings/utils/settings-sync-utils";
import { setHasDataHint } from "@/lib/storage";
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
		lastBackupDate: _lastBackupDate,
		isBackupReminderSnoozed: _isBackupReminderSnoozed,
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

	const { processImportPayload } = await import("@/features/settings/utils/import-utils");
	const parsedData = await processImportPayload({
		folders: Array.isArray(folders) ? folders : [],
		items: Array.isArray(items) ? items : [],
	});

	const { normalizeUrl } = await import("@/lib/utils");

	const foldersToImport = parsedData.validFolders.filter((f) => !f.isDuplicate);

	let hasDataToPut = foldersToImport.length > 0;

	await db.transaction("rw", db.folders, db.items, async () => {
		const existingItems = await db.items.toArray();
		const existingItemsByUrl = new Map(existingItems.map((item) => [normalizeUrl(item.url), item]));

		const itemsToPut: import("@/db/db").Item[] = [];

		for (const { isDuplicate, ...item } of parsedData.validItems) {
			if (isDuplicate) {
				const existingItem = existingItemsByUrl.get(normalizeUrl(item.url));
				if (existingItem) {
					const incomingUpdatedAt = item.updatedAt || Date.now();
					const existingUpdatedAt = existingItem.updatedAt || 0;
					if (incomingUpdatedAt > existingUpdatedAt) {
						itemsToPut.push({
							...existingItem,
							...item,
							id: existingItem.id, // retain original ID
							createdAt: item.createdAt ?? existingItem.createdAt,
							updatedAt: incomingUpdatedAt,
						});
					}
				}
			} else {
				itemsToPut.push({
					...item,
					id: item.id as string,
					folderId: item.folderId ?? undefined,
					createdAt: item.createdAt ?? Date.now(),
					updatedAt: item.updatedAt ?? Date.now(),
					isFavorite: item.isFavorite ?? undefined,
					note: item.note ?? undefined,
				});
			}
		}

		if (foldersToImport.length > 0) {
			await db.folders.bulkPut(
				foldersToImport.map((f) => ({
					...f,
					id: f.id as string,
					parentId: f.parentId ?? null,
					order: f.order ?? 0,
					createdAt: f.createdAt ?? Date.now(),
					updatedAt: f.updatedAt ?? Date.now(),
					isFavorite: f.isFavorite ?? undefined,
				})),
			);
		}

		if (itemsToPut.length > 0) {
			await db.items.bulkPut(itemsToPut);
			hasDataToPut = true;
		}
	});

	if (hasDataToPut) {
		setHasDataHint(true);
	}

	if (settings && typeof settings === "object") {
		try {
			const parsedSettings = parseImportedSettings(JSON.stringify(settings));
			const currentSettings = useSettingsStore.getState().settings;

			const newSettings = { ...currentSettings };
			if (parsedSettings.appearanceSettings) {
				newSettings.appearanceSettings = {
					...newSettings.appearanceSettings,
					...parsedSettings.appearanceSettings,
				};
			}
			if (parsedSettings.soundSettings) {
				newSettings.soundSettings = {
					...newSettings.soundSettings,
					...parsedSettings.soundSettings,
				};
			}
			if (parsedSettings.suloSettings) {
				newSettings.suloSettings = { ...newSettings.suloSettings, ...parsedSettings.suloSettings };
			}
			if (parsedSettings.privacySettings) {
				newSettings.privacySettings = {
					...newSettings.privacySettings,
					...parsedSettings.privacySettings,
				};
			}
			if (parsedSettings.backupReminderFrequency !== undefined) {
				newSettings.backupReminderFrequency = parsedSettings.backupReminderFrequency;
			}

			useSettingsStore.getState().updateSettings(newSettings);
		} catch (e) {
			console.warn("Invalid settings payload during sync:", e);
		}
	}

	if (theme && typeof theme === "string") {
		const parsed = workspaceThemeSchema.safeParse(theme);
		if (parsed.success) {
			localStorage.setItem("sulok-ui-theme", parsed.data);
			window.dispatchEvent(new Event("local-theme-change"));
		}
	}
}
