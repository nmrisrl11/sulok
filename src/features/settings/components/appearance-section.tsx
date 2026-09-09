import { ResetButton } from "@/components/reset-button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { APP_INFO } from "@/constants/app-info";
import { ACCENT_COLORS, THEME_OPTIONS } from "@/constants/appearance-options";
import { SettingsCard } from "@/features/settings/components/settings-card";
import { useTheme, type Theme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { defaultSettings, useSettingsStore } from "@/stores/settings-store";
import type { AccentColor, CornerStyle, LayoutDensity } from "@/types/settings";

function ThemeModeCard() {
	const { theme, setTheme } = useTheme();

	return (
		<SettingsCard>
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div className="space-y-1">
					<Label className="text-sm font-medium text-foreground" htmlFor="theme-mode">
						Theme Mode
					</Label>
					<p className="max-w-md text-sm text-muted-foreground">
						Select your preferred lighting environment.
					</p>
				</div>
				<div className="w-full shrink-0 sm:w-48">
					<Select value={theme} onValueChange={(val) => setTheme(val as Theme)}>
						<SelectTrigger
							id="theme-mode"
							className="w-full corner-squircle supports-[corner-shape:squircle]:rounded-xl"
						>
							<SelectValue placeholder="Select theme" />
						</SelectTrigger>
						<SelectContent position="popper" className="max-h-75">
							{THEME_OPTIONS.map(({ id, label, icon: Icon }) => (
								<SelectItem key={id} value={id} className="rounded-md px-3 py-2.5">
									<div className="flex items-center gap-3">
										<div className="flex w-5 shrink-0 items-center justify-center">
											<Icon className="h-4 w-4 text-muted-foreground" />
										</div>
										<span>{label}</span>
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
		</SettingsCard>
	);
}

function AccentColorCard() {
	const accentColor = useSettingsStore((state) => state.settings.appearanceSettings.accentColor);
	const updateSettings = useSettingsStore((state) => state.updateSettings);

	const handleUpdate = (val: string) => {
		const currentSettings = useSettingsStore.getState().settings.appearanceSettings;
		updateSettings({ appearanceSettings: { ...currentSettings, accentColor: val as AccentColor } });
	};

	return (
		<SettingsCard>
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div className="space-y-1">
					<Label className="text-sm font-medium text-foreground">Accent Color</Label>
					<p className="max-w-md text-sm text-muted-foreground">
						Choose a custom primary color for buttons and highlights.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-4">
					{ACCENT_COLORS.map(({ id, label, class: bgClass, ringClass }) => {
						const isActive = accentColor === id;
						return (
							<button
								key={id}
								onClick={() => handleUpdate(id)}
								aria-label={`Select ${label} accent color`}
								aria-pressed={isActive}
								className={cn(
									"h-6 w-6 shrink-0 rounded-full transition-all hover:scale-110",
									bgClass,
									isActive
										? `ring-2 ring-offset-2 ring-offset-background ${ringClass}`
										: "ring-0 ring-transparent",
								)}
							/>
						);
					})}
				</div>
			</div>
		</SettingsCard>
	);
}

function CornerRadiusCard() {
	const cornerStyle = useSettingsStore((state) => state.settings.appearanceSettings.cornerStyle);
	const updateSettings = useSettingsStore((state) => state.updateSettings);

	const handleUpdate = (val: string) => {
		const currentSettings = useSettingsStore.getState().settings.appearanceSettings;
		updateSettings({ appearanceSettings: { ...currentSettings, cornerStyle: val as CornerStyle } });
	};

	return (
		<SettingsCard>
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div className="space-y-1">
					<Label className="text-sm font-medium text-foreground" htmlFor="corner-style">
						Corner Radius
					</Label>
					<p className="max-w-md text-sm text-muted-foreground">
						Toggle between modern iOS-like squircles and standard corners.
					</p>
				</div>
				<div className="w-full shrink-0 sm:w-48">
					<Select value={cornerStyle} onValueChange={handleUpdate}>
						<SelectTrigger
							id="corner-style"
							className="w-full corner-squircle supports-[corner-shape:squircle]:rounded-xl"
						>
							<SelectValue placeholder="Select style" />
						</SelectTrigger>
						<SelectContent position="popper" className="max-h-75">
							<SelectItem value="squircle" className="rounded-md px-3 py-2.5">
								Squircle (Modern)
							</SelectItem>
							<SelectItem value="standard" className="rounded-md px-3 py-2.5">
								Standard
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		</SettingsCard>
	);
}

function LayoutDensityCard() {
	const layoutDensity = useSettingsStore(
		(state) => state.settings.appearanceSettings.layoutDensity,
	);
	const updateSettings = useSettingsStore((state) => state.updateSettings);

	const handleUpdate = (val: string) => {
		const currentSettings = useSettingsStore.getState().settings.appearanceSettings;
		updateSettings({
			appearanceSettings: { ...currentSettings, layoutDensity: val as LayoutDensity },
		});
	};

	return (
		<SettingsCard>
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div className="space-y-1">
					<Label className="text-sm font-medium text-foreground" htmlFor="layout-density">
						Layout Density
					</Label>
					<p className="max-w-md text-sm text-muted-foreground">
						Adjust the padding and spacing of list items.
					</p>
				</div>
				<div className="w-full shrink-0 sm:w-48">
					<Select value={layoutDensity} onValueChange={handleUpdate}>
						<SelectTrigger
							id="layout-density"
							className="w-full corner-squircle supports-[corner-shape:squircle]:rounded-xl"
						>
							<SelectValue placeholder="Select density" />
						</SelectTrigger>
						<SelectContent position="popper" className="max-h-75">
							<SelectItem value="compact" className="rounded-md px-3 py-2.5">
								Compact (Default)
							</SelectItem>
							<SelectItem value="cozy" className="rounded-md px-3 py-2.5">
								Cozy
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		</SettingsCard>
	);
}

function RestoreAppearanceButton() {
	const updateSettings = useSettingsStore((state) => state.updateSettings);
	const { setTheme } = useTheme();

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
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
				<div>
					<h2 className="font-heading text-xl font-semibold">Appearance</h2>
					<p className="mt-1 text-sm text-muted-foreground">
						Customize how {APP_INFO.name} looks and feels on your device.
					</p>
				</div>
				<RestoreAppearanceButton />
			</div>

			<div className="space-y-6">
				<ThemeModeCard />
				<AccentColorCard />
				<CornerRadiusCard />
				<LayoutDensityCard />
			</div>
		</div>
	);
}
