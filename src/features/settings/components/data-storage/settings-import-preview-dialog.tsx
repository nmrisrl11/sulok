import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Settings } from "@/types/settings";
import { ArrowRightIcon } from "lucide-react";
import { useMemo } from "react";

interface SettingsImportPreviewDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	currentSettings: Settings;
	importedSettings: Partial<Settings>;
	currentTheme?: string;
	importedTheme?: string;
	onConfirm: () => void;
}

interface SettingChange {
	id: string;
	label: string;
	currentValue: string;
	importedValue: string;
	hasChanged: boolean;
}

interface SettingCategory {
	name: string;
	changes: SettingChange[];
}

export function SettingsImportPreviewDialog({
	open,
	onOpenChange,
	currentSettings,
	importedSettings,
	currentTheme,
	importedTheme,
	onConfirm,
}: SettingsImportPreviewDialogProps) {
	// 1. Generate the comparison data
	const categories = useMemo(() => {
		const cats: SettingCategory[] = [];

		const addCategory = (name: string, changes: SettingChange[]) => {
			if (changes.length > 0) {
				cats.push({ name, changes });
			}
		};

		const formatBool = (val: boolean | undefined) => (val ? "Enabled" : "Disabled");

		// Appearance Settings
		const appearanceChanges: SettingChange[] = [];

		if (importedTheme !== undefined) {
			appearanceChanges.push({
				id: "workspaceTheme",
				label: "Workspace Theme",
				currentValue: currentTheme || "System",
				importedValue: importedTheme,
				hasChanged: currentTheme !== importedTheme,
			});
		}

		if (importedSettings.appearanceSettings !== undefined) {
			const curr = currentSettings.appearanceSettings;
			const imp = importedSettings.appearanceSettings;

			// Accent Color
			if (imp.accentColor !== undefined) {
				appearanceChanges.push({
					id: "accentColor",
					label: "Accent Color",
					currentValue: curr?.accentColor || "Foreground",
					importedValue: imp.accentColor,
					hasChanged: curr?.accentColor !== imp.accentColor,
				});
			}

			// Folder Customization
			if (imp.folderColorMode !== undefined) {
				appearanceChanges.push({
					id: "folderColorMode",
					label: "Folder Color Mode",
					currentValue: curr?.folderColorMode || "Preset",
					importedValue: imp.folderColorMode,
					hasChanged: curr?.folderColorMode !== imp.folderColorMode,
				});
			}
			if (imp.folderColorBack !== undefined) {
				appearanceChanges.push({
					id: "folderColorBack",
					label: "Folder Base Color",
					currentValue: curr?.folderColorBack || "Default",
					importedValue: imp.folderColorBack,
					hasChanged: curr?.folderColorBack !== imp.folderColorBack,
				});
			}

			// Corner Radius
			if (imp.cornerStyle !== undefined) {
				appearanceChanges.push({
					id: "cornerStyle",
					label: "Corner Style",
					currentValue: curr?.cornerStyle || "Squircle",
					importedValue: imp.cornerStyle,
					hasChanged: curr?.cornerStyle !== imp.cornerStyle,
				});
			}
			if (imp.customCornerRadius !== undefined) {
				appearanceChanges.push({
					id: "customCornerRadius",
					label: "Custom Corner Radius",
					currentValue: String(curr?.customCornerRadius),
					importedValue: String(imp.customCornerRadius),
					hasChanged: curr?.customCornerRadius !== imp.customCornerRadius,
				});
			}

			// Layout Density
			if (imp.layoutDensity !== undefined) {
				appearanceChanges.push({
					id: "layoutDensity",
					label: "Layout Density",
					currentValue: curr?.layoutDensity || "Compact",
					importedValue: imp.layoutDensity,
					hasChanged: curr?.layoutDensity !== imp.layoutDensity,
				});
			}
			if (imp.customLayoutDensity !== undefined) {
				appearanceChanges.push({
					id: "customLayoutDensity",
					label: "Custom Layout Density",
					currentValue: String(curr?.customLayoutDensity),
					importedValue: String(imp.customLayoutDensity),
					hasChanged: curr?.customLayoutDensity !== imp.customLayoutDensity,
				});
			}
		}

		addCategory("Appearance", appearanceChanges);

		// Sound Settings
		const soundChanges: SettingChange[] = [];
		if (importedSettings.soundSettings !== undefined) {
			const curr = currentSettings.soundSettings;
			const imp = importedSettings.soundSettings;

			if (imp.enabled !== undefined) {
				soundChanges.push({
					id: "soundEnabled",
					label: "Sound Effects",
					currentValue: formatBool(curr?.enabled),
					importedValue: formatBool(imp.enabled),
					hasChanged: curr?.enabled !== imp.enabled,
				});
			}
			if (imp.volume !== undefined) {
				soundChanges.push({
					id: "soundVolume",
					label: "Volume",
					currentValue: `${Math.round((curr?.volume ?? 0.5) * 100)}%`,
					importedValue: `${Math.round(imp.volume * 100)}%`,
					hasChanged: curr?.volume !== imp.volume,
				});
			}
			if (imp.mappings !== undefined) {
				const soundKeys = ["hover", "press", "toggle", "success", "error"] as const;
				for (const key of soundKeys) {
					if (imp.mappings[key] !== undefined) {
						soundChanges.push({
							id: `soundMappings.${key}`,
							label: `Sound: ${key.charAt(0).toUpperCase() + key.slice(1)}`,
							currentValue: curr?.mappings?.[key] || "Default",
							importedValue: imp.mappings[key],
							hasChanged: curr?.mappings?.[key] !== imp.mappings[key],
						});
					}
				}
			}
		}
		addCategory("Sound & Feedback", soundChanges);

		// Sulo Customization Settings
		const suloChanges: SettingChange[] = [];
		if (importedSettings.suloSettings !== undefined) {
			const curr = currentSettings.suloSettings;
			const imp = importedSettings.suloSettings;

			const expressions = [
				{ id: "expression404", label: "404 Page Expression" },
				{ id: "expressionEmptyState", label: "Empty State Expression" },
				{ id: "expressionNavbar", label: "Navbar Expression" },
				{ id: "expressionQuickAction", label: "Quick Action Expression" },
				{ id: "expressionPreviewUnavailable", label: "Preview Unavailable Expression" },
				{ id: "expressionError", label: "Error Expression" },
				{ id: "expressionInstallPage", label: "Install Page Expression" },
			];

			for (const { id, label } of expressions) {
				// @ts-expect-error - dynamic key access
				if (imp[id] !== undefined) {
					suloChanges.push({
						id,
						label,
						// @ts-expect-error - dynamic key access
						currentValue: curr?.[id] || "Default",
						// @ts-expect-error - dynamic key access
						importedValue: imp[id],
						// @ts-expect-error - dynamic key access
						hasChanged: curr?.[id] !== imp[id],
					});
				}
			}

			if (imp.whispers !== undefined) {
				suloChanges.push({
					id: "whispers",
					label: "Sulo Whispers (Phrases)",
					currentValue: curr?.whispers ? "Customized" : "Default",
					importedValue: "Customized",
					hasChanged: JSON.stringify(curr?.whispers) !== JSON.stringify(imp.whispers),
				});
			}
		}
		addCategory("Sulo Customization", suloChanges);

		// Privacy Settings
		const privacyChanges: SettingChange[] = [];
		if (importedSettings.privacySettings !== undefined) {
			const curr = currentSettings.privacySettings;
			const imp = importedSettings.privacySettings;

			if (imp.enableReferralTracking !== undefined) {
				privacyChanges.push({
					id: "enableReferralTracking",
					label: "Referral Tracking",
					currentValue: formatBool(curr?.enableReferralTracking),
					importedValue: formatBool(imp.enableReferralTracking),
					hasChanged: curr?.enableReferralTracking !== imp.enableReferralTracking,
				});
			}
		}
		addCategory("Privacy & System", privacyChanges);

		return cats;
	}, [currentSettings, importedSettings, currentTheme, importedTheme]);

	const allChanges = useMemo(() => categories.flatMap((c) => c.changes), [categories]);
	const changedSettings = allChanges.filter((c) => c.hasChanged);
	const unchangedSettings = allChanges.filter((c) => !c.hasChanged);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				showCloseButton={false}
				className="flex max-h-[90dvh] flex-col overflow-hidden rounded-2xl border-border/50 bg-background p-0 shadow-2xl sm:max-w-md"
			>
				<div className="shrink-0 p-6 pb-4">
					<DialogHeader>
						<DialogTitle className="font-sans text-2xl font-bold tracking-wide text-foreground">
							Import Settings
						</DialogTitle>
						<DialogDescription className="mt-1 text-muted-foreground">
							Review settings before syncing.
						</DialogDescription>
					</DialogHeader>

					<div className="mt-4 flex flex-col gap-1.5 rounded-lg bg-muted/50 p-3 text-sm">
						<div className="flex items-center justify-between">
							<span className="font-medium text-muted-foreground">Settings detected</span>
							<span className="font-semibold">{allChanges.length}</span>
						</div>
						<div className="flex items-center justify-between text-primary">
							<span className="font-medium">Will be updated</span>
							<span className="font-bold">{changedSettings.length}</span>
						</div>
						<div className="flex items-center justify-between text-muted-foreground">
							<span>Already up to date</span>
							<span>{unchangedSettings.length}</span>
						</div>
					</div>
				</div>

				<div className="relative min-h-0 flex-1 overflow-hidden">
					<div
						className="custom-scrollbar h-full overflow-y-auto px-6 pb-2"
						style={{ maxHeight: "50dvh" }}
					>
						{changedSettings.length > 0 && (
							<div className="mb-6">
								<h3 className="mb-3 border-b pb-1 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
									Changes to import
								</h3>
								<div className="flex flex-col gap-5">
									{categories.map((category) => {
										const catChanges = category.changes.filter((c) => c.hasChanged);
										if (catChanges.length === 0) return null;

										return (
											<div key={category.name} className="flex flex-col gap-2">
												<h4 className="text-xs font-semibold text-foreground">{category.name}</h4>
												<div className="flex flex-col gap-2">
													{catChanges.map((change) => (
														<div
															key={change.id}
															className="flex items-center justify-between gap-2 rounded-md border border-primary/10 bg-primary/5 p-2"
														>
															<span
																className="truncate text-sm font-medium sm:whitespace-normal"
																title={change.label}
															>
																{change.label}
															</span>
															<div className="flex shrink-0 items-center gap-1.5 text-xs">
																<span
																	className="max-w-20 truncate text-right text-muted-foreground sm:max-w-25"
																	title={change.currentValue}
																>
																	{change.currentValue}
																</span>
																<ArrowRightIcon className="h-3.5 w-3.5 shrink-0 text-primary" />
																<span
																	className="max-w-20 truncate text-right font-semibold text-primary sm:max-w-25"
																	title={change.importedValue}
																>
																	{change.importedValue}
																</span>
															</div>
														</div>
													))}
												</div>
											</div>
										);
									})}
								</div>
							</div>
						)}

						{unchangedSettings.length > 0 && (
							<div className="mb-4">
								<h3 className="mb-2 border-b pb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
									Already up to date
								</h3>
								<div className="pl-1 text-sm text-muted-foreground/80">
									{unchangedSettings.length} setting{unchangedSettings.length === 1 ? "" : "s"}{" "}
									match perfectly.
								</div>
							</div>
						)}
					</div>
				</div>

				<DialogFooter className="shrink-0 border-t border-border/50 bg-background p-6 pt-4">
					<Button variant="ghost" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button
						onClick={() => {
							onConfirm();
							onOpenChange(false);
						}}
						disabled={changedSettings.length === 0}
					>
						Import Settings
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
