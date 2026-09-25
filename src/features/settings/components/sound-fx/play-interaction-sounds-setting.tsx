import { ResetButton } from "@/components/reset-button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { defaultSettings, useSettingsStore } from "@/stores";
import { useId } from "react";

export function SoundSettingsControl() {
	const switchId = useId();
	const enabled = useSettingsStore((state) => state.settings.soundSettings.enabled);
	const updateSettings = useSettingsStore((state) => state.updateSettings);

	const handleEnabledChange = (enabledValue: boolean) => {
		const currentSettings = useSettingsStore.getState().settings.soundSettings;
		updateSettings({ soundSettings: { ...currentSettings, enabled: enabledValue } });
	};

	return (
		<div className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/20 p-4 supports-[corner-shape:squircle]:rounded-2xl supports-[corner-shape:squircle]:corner-squircle">
			<Label htmlFor={switchId} className="text-sm font-medium">
				Enable Sound FX
			</Label>
			<Switch id={switchId} checked={enabled} onCheckedChange={handleEnabledChange} />
		</div>
	);
}

export function SoundSettingsSetting() {
	const updateSettings = useSettingsStore((state) => state.updateSettings);

	const handleReset = () => {
		const currentSettings = useSettingsStore.getState().settings.soundSettings;
		updateSettings({
			soundSettings: { ...currentSettings, enabled: defaultSettings.soundSettings.enabled },
		});
	};

	return (
		<div className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:py-6 sm:first:pt-0 sm:last:pb-0">
			<div className="space-y-1">
				<div className="flex items-center justify-between gap-4">
					<h3 className="text-sm font-medium text-foreground">Play Interaction Sounds</h3>
					<ResetButton onClick={handleReset} aria-label="Reset interaction sounds" />
				</div>
				<p className="w-full text-sm text-muted-foreground sm:max-w-md">
					Play audio feedback for interactions like navigating or saving items.
				</p>
			</div>
			<div className="flex w-full shrink-0 flex-col gap-4 pt-2">
				<SoundSettingsControl />
			</div>
		</div>
	);
}
