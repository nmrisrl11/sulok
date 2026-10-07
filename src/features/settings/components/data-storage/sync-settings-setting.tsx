import { Input } from "@/components/ui/input";
import {
	exportSettings,
	parseImportedSettings,
	type ImportedSettingsPayload,
} from "@/features/settings/utils/settings-sync-utils";
import { useTheme, useThemeDispatch, type Theme } from "@/hooks";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/stores";
import type { Settings } from "@/types/settings";
import { DownloadIcon, SettingsIcon, UploadIcon } from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";

const SettingsImportPreviewDialog = lazy(() =>
	import("./settings-import-preview-dialog").then((module) => ({
		default: module.SettingsImportPreviewDialog,
	})),
);

export function SyncSettingsSetting() {
	const settings = useSettingsStore((state) => state.settings);
	const updateSettings = useSettingsStore((state) => state.updateSettings);
	const { theme } = useTheme();
	const setTheme = useThemeDispatch();

	const fileInputSettingsRef = useRef<HTMLInputElement>(null);
	const [importPreviewOpen, setImportPreviewOpen] = useState(false);
	const [importedSettings, setImportedSettings] = useState<ImportedSettingsPayload | null>(null);

	const handleExportSettings = () => {
		exportSettings(settings, theme);
	};

	const handleImportSettingsClick = () => {
		fileInputSettingsRef.current?.click();
	};

	const handleSettingsFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			const text = await file.text();
			const parsed = parseImportedSettings(text);
			setImportedSettings(parsed);
			setImportPreviewOpen(true);
		} catch (err) {
			notify.error("Import Failed", {
				id: "import-error",
				description: err instanceof Error ? err.message : "Failed to import settings.",
			});
		} finally {
			if (fileInputSettingsRef.current) {
				fileInputSettingsRef.current.value = "";
			}
		}
	};

	const confirmImport = () => {
		if (importedSettings) {
			const safeSettingsToImport: Partial<Settings> = {};

			if (importedSettings.appearanceSettings) {
				safeSettingsToImport.appearanceSettings = {
					...settings.appearanceSettings,
					...importedSettings.appearanceSettings,
				};
			}
			if (importedSettings.soundSettings) {
				safeSettingsToImport.soundSettings = {
					...settings.soundSettings,
					...importedSettings.soundSettings,
				};
			}
			if (importedSettings.suloSettings) {
				safeSettingsToImport.suloSettings = {
					...settings.suloSettings,
					...importedSettings.suloSettings,
				};
			}
			if (importedSettings.privacySettings) {
				safeSettingsToImport.privacySettings = {
					...settings.privacySettings,
					...importedSettings.privacySettings,
				};
			}

			if (importedSettings.workspaceTheme) {
				setTheme(importedSettings.workspaceTheme as Theme);
			}

			updateSettings(safeSettingsToImport);
			notify.success("Settings synced successfully.", { id: "settings-sync-success" });
		}
	};

	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	const handleDialogClose = (open: boolean) => {
		setImportPreviewOpen(open);
		if (!open) {
			timeoutRef.current = setTimeout(() => {
				setImportedSettings(null);
			}, 300);
		} else if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
	};

	return (
		<>
			<div className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:py-6 sm:first:pt-0 sm:last:pb-0">
				<div>
					<p className="flex items-center gap-2 text-sm font-medium text-foreground">
						<SettingsIcon className="h-4 w-4" /> Settings Data (JSON)
					</p>
					<p className="mt-1 text-xs text-muted-foreground">
						Backup or restore your app configurations, appearance, and personal preferences.
					</p>
				</div>

				<div className="grid grid-cols-2 gap-3">
					<button
						type="button"
						onClick={handleExportSettings}
						className={cn(
							"flex flex-col items-center gap-2 p-3 text-center transition-all sm:items-start sm:gap-3 sm:p-4 sm:text-left",
							"rounded-xl border border-border/50 bg-background hover:border-border hover:bg-muted/50",
							"corner-squircle supports-[corner-shape:squircle]:rounded-4xl",
							"focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
						)}
					>
						<div className="rounded-lg border border-border/50 bg-card p-2 text-muted-foreground shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-2xl">
							<DownloadIcon className="h-5 w-5" />
						</div>
						<div>
							<h3 className="text-sm font-medium text-foreground">Export Settings</h3>
							<p className="mt-0.5 hidden text-xs leading-snug text-muted-foreground sm:block">
								Save as JSON file
							</p>
						</div>
					</button>

					<button
						type="button"
						onClick={handleImportSettingsClick}
						className={cn(
							"flex flex-col items-center gap-2 p-3 text-center transition-all sm:items-start sm:gap-3 sm:p-4 sm:text-left",
							"rounded-xl border border-border/50 bg-background hover:border-border hover:bg-muted/50",
							"corner-squircle supports-[corner-shape:squircle]:rounded-4xl",
							"focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
						)}
					>
						<div className="rounded-lg border border-border/50 bg-card p-2 text-muted-foreground shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-2xl">
							<UploadIcon className="h-5 w-5" />
						</div>
						<div>
							<h3 className="text-sm font-medium text-foreground">Import Settings</h3>
							<p className="mt-0.5 hidden text-xs leading-snug text-muted-foreground sm:block">
								Restore from backup
							</p>
						</div>
					</button>

					<Input
						id="import-settings-file"
						type="file"
						accept=".json,application/json"
						className="hidden"
						ref={fileInputSettingsRef}
						onChange={handleSettingsFileChange}
						aria-label="Select file to import settings"
					/>
				</div>
			</div>

			<Suspense fallback={null}>
				{importedSettings && (
					<SettingsImportPreviewDialog
						open={importPreviewOpen}
						onOpenChange={handleDialogClose}
						currentSettings={settings}
						importedSettings={importedSettings}
						currentTheme={theme}
						importedTheme={importedSettings.workspaceTheme}
						onConfirm={confirmImport}
					/>
				)}
			</Suspense>
		</>
	);
}
