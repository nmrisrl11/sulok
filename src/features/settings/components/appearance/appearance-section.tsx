import { ResetButton } from "@/components/reset-button";
import { APP_INFO } from "@/constants/app-info";
import { useThemeDispatch } from "@/hooks";
import { defaultSettings, useSettingsStore } from "@/stores";
import { SettingsCard } from "../settings-card";
import { AccentColorSetting } from "./accent-color-setting";
import { CornerRadiusSetting } from "./corner-radius-setting";
import { FolderCustomizationSetting } from "./folder-customization-setting";
import { LayoutDensitySetting } from "./layout-density-setting";
import { WorkspaceThemeSetting } from "./workspace-theme-setting";

function RestoreAppearanceButton() {
	const updateSettings = useSettingsStore((state) => state.updateSettings);
	const setTheme = useThemeDispatch();

	const handleRestore = () => {
		updateSettings({ appearanceSettings: defaultSettings.appearanceSettings });
		setTheme("system");
	};

	return (
		<ResetButton
			onClick={handleRestore}
			label="Reset Appearance"
			className="corner-squircle supports-[corner-shape:squircle]:rounded-xl"
		/>
	);
}

export function AppearanceSection() {
	return (
		<div className="animate-in space-y-8 duration-300 fade-in slide-in-from-bottom-2">
			<div className="flex flex-col gap-1">
				<div className="flex items-center justify-between gap-4">
					<h2 className="font-heading text-xl font-semibold">Appearance</h2>

					<RestoreAppearanceButton />
				</div>

				<p className="mt-1 text-sm text-muted-foreground">
					Customize how {APP_INFO.name} looks and feels on your device.
				</p>
			</div>

			<div className="space-y-10">
				<div className="space-y-4">
					<h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
						Theme & Colors
					</h3>
					<SettingsCard className="p-0 sm:p-0">
						<div className="flex flex-col divide-y divide-border/50 px-5 py-5 sm:px-6 sm:py-6">
							<WorkspaceThemeSetting />
							<AccentColorSetting />
							<FolderCustomizationSetting />
						</div>
					</SettingsCard>
				</div>

				<div className="space-y-4">
					<h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
						Interface & Layout
					</h3>
					<SettingsCard className="p-0 sm:p-0">
						<div className="flex flex-col divide-y divide-border/50 px-5 py-5 sm:px-6 sm:py-6">
							<CornerRadiusSetting />
							<LayoutDensitySetting />
						</div>
					</SettingsCard>
				</div>
			</div>
		</div>
	);
}
