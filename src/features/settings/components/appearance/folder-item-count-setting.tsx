import { ResetButton } from "@/components/reset-button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { defaultSettings, useSettingsStore } from "@/stores";
import { useId } from "react";

export function FolderItemCountControl({
	variant = "default",
}: {
	variant?: "default" | "compact";
}) {
	const switchId = useId();
	const showFolderItemCounts = useSettingsStore(
		(state) => state.settings.appearanceSettings.showFolderItemCounts ?? true,
	);
	const updateSettings = useSettingsStore((state) => state.updateSettings);

	const handleChange = (val: boolean) => {
		const currentSettings = useSettingsStore.getState().settings.appearanceSettings;
		updateSettings({ appearanceSettings: { ...currentSettings, showFolderItemCounts: val } });
	};

	return (
		<div
			className={cn(
				"flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 supports-[corner-shape:squircle]:rounded-2xl supports-[corner-shape:squircle]:corner-squircle",
				variant === "compact" ? "p-3" : "p-4",
			)}
		>
			<Label htmlFor={switchId} className="cursor-pointer text-sm font-medium">
				Show Item Counts
			</Label>
			<Switch id={switchId} checked={showFolderItemCounts} onCheckedChange={handleChange} />
		</div>
	);
}

export function FolderItemCountSetting() {
	const updateSettings = useSettingsStore((state) => state.updateSettings);

	const handleReset = () => {
		const currentSettings = useSettingsStore.getState().settings.appearanceSettings;
		updateSettings({
			appearanceSettings: {
				...currentSettings,
				showFolderItemCounts: defaultSettings.appearanceSettings.showFolderItemCounts,
			},
		});
	};

	return (
		<div className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:py-6 sm:first:pt-0 sm:last:pb-0">
			<div className="space-y-1">
				<div className="flex items-center justify-between gap-4">
					<h3 className="text-sm font-medium text-foreground">Folder Item Counts</h3>
					<ResetButton onClick={handleReset} aria-label="Reset folder item counts" />
				</div>
				<p className="w-full text-sm text-muted-foreground sm:max-w-md">
					Display the total count of items and links inside each folder across list and grid views.
				</p>
			</div>
			<div className="flex w-full shrink-0 flex-col gap-4 pt-2">
				<FolderItemCountControl />
			</div>
		</div>
	);
}
