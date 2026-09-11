import { ResetButton } from "@/components/reset-button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { APP_INFO } from "@/constants/app-info";
import { THEME_OPTIONS } from "@/constants/appearance-options";
import { SettingsCard } from "@/features/settings/components/settings-card";
import { useTheme, type Theme } from "@/hooks/use-theme";
import { defaultSettings, useSettingsStore } from "@/stores/settings-store";
import type { CornerStyle, LayoutDensity } from "@/types/settings";
import { Rows3Icon, Rows4Icon, Settings2Icon, SquareIcon, SquircleIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function DebouncedColorPicker({
	value,
	onChange,
	id,
}: {
	value: string;
	onChange: (val: string) => void;
	id?: string;
}) {
	const [localValue, setLocalValue] = useState(value);
	const [prevValueState, setPrevValueState] = useState(value);
	const onChangeRef = useRef(onChange);
	const localValueRef = useRef(localValue);
	const valueRef = useRef(value);

	useEffect(() => {
		onChangeRef.current = onChange;
		localValueRef.current = localValue;
		valueRef.current = value;
	}, [onChange, localValue, value]);

	if (value !== prevValueState) {
		setLocalValue(value);
		setPrevValueState(value);
	}

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (localValue !== value) {
				onChange(localValue);
			}
		}, 50); // 50ms debounce
		return () => clearTimeout(timeout);
	}, [localValue, onChange, value]);

	// Flush dirty value on unmount
	useEffect(() => {
		return () => {
			if (localValueRef.current !== valueRef.current) {
				onChangeRef.current(localValueRef.current);
			}
		};
	}, []);

	return (
		<input
			type="color"
			value={localValue}
			onChange={(e) => setLocalValue(e.target.value)}
			onBlur={() => {
				if (localValue !== value) {
					onChange(localValue);
				}
			}}
			className="absolute -top-2 -left-2 h-12 w-12 cursor-pointer border-0 p-0"
			id={id}
			aria-label={id ? undefined : "Color picker"}
		/>
	);
}

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
	const { theme } = useTheme();

	const handleUpdate = (val: string) => {
		const currentSettings = useSettingsStore.getState().settings.appearanceSettings;
		updateSettings({ appearanceSettings: { ...currentSettings, accentColor: val } });
	};

	const isDark =
		theme === "dark" ||
		(theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
	const resolvedColor =
		accentColor === "foreground" ? (isDark ? "#f7f5f0" : "#1e1b18") : accentColor;

	return (
		<SettingsCard>
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div className="space-y-1">
					<Label className="text-sm font-medium text-foreground" htmlFor="accent-color">
						Accent Color
					</Label>
					<p className="max-w-md text-sm text-muted-foreground">
						Choose a custom primary color for buttons and highlights.
					</p>
				</div>
				<div className="flex shrink-0 items-center gap-4">
					<div className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-border ring-offset-2 ring-offset-background transition-all hover:scale-110">
						<DebouncedColorPicker id="accent-color" value={resolvedColor} onChange={handleUpdate} />
					</div>
				</div>
			</div>
		</SettingsCard>
	);
}

function CornerRadiusCard() {
	const settings = useSettingsStore((state) => state.settings.appearanceSettings);
	const updateSettings = useSettingsStore((state) => state.updateSettings);

	const handleUpdate = (val: string) => {
		const currentSettings = useSettingsStore.getState().settings.appearanceSettings;
		updateSettings({ appearanceSettings: { ...currentSettings, cornerStyle: val as CornerStyle } });
	};

	const handleCustomRadiusCommit = (val: number[]) => {
		const currentSettings = useSettingsStore.getState().settings.appearanceSettings;
		updateSettings({ appearanceSettings: { ...currentSettings, customCornerRadius: val[0] } });
	};

	const [localRadius, setLocalRadius] = useState(settings.customCornerRadius);
	const [prevRadius, setPrevRadius] = useState(settings.customCornerRadius);

	if (settings.customCornerRadius !== prevRadius) {
		setLocalRadius(settings.customCornerRadius);
		setPrevRadius(settings.customCornerRadius);
	}

	return (
		<SettingsCard>
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
				<div className="space-y-1">
					<Label className="text-sm font-medium text-foreground" htmlFor="corner-style">
						Corner Radius
					</Label>
					<p className="max-w-md text-sm text-muted-foreground">
						Toggle between modern iOS-like squircles and standard corners.
					</p>
				</div>
				<div className="flex w-full shrink-0 flex-col gap-4 sm:w-48">
					<Select value={settings.cornerStyle} onValueChange={handleUpdate}>
						<SelectTrigger
							id="corner-style"
							className="w-full corner-squircle supports-[corner-shape:squircle]:rounded-xl"
						>
							<SelectValue placeholder="Select style" />
						</SelectTrigger>
						<SelectContent position="popper" className="max-h-75">
							<SelectItem value="squircle" className="rounded-md px-3 py-2.5">
								<div className="flex items-center gap-3">
									<SquircleIcon className="h-4 w-4 text-muted-foreground" />
									<span>Squircle</span>
								</div>
							</SelectItem>
							<SelectItem value="standard" className="rounded-md px-3 py-2.5">
								<div className="flex items-center gap-3">
									<SquareIcon className="h-4 w-4 text-muted-foreground" />
									<span>Standard</span>
								</div>
							</SelectItem>
							<SelectItem value="custom" className="rounded-md px-3 py-2.5">
								<div className="flex items-center gap-3">
									<Settings2Icon className="h-4 w-4 text-muted-foreground" />
									<span>Custom</span>
								</div>
							</SelectItem>
						</SelectContent>
					</Select>

					{settings.cornerStyle === "custom" && (
						<div className="animate-in space-y-4 rounded-md border border-border p-3 fade-in slide-in-from-top-1">
							<div className="flex items-center justify-between">
								<Label className="text-xs text-muted-foreground">Radius Value</Label>
								<span className="text-xs font-medium tabular-nums">{localRadius}px</span>
							</div>
							<Slider
								value={[localRadius]}
								onValueChange={(val) => setLocalRadius(val[0])}
								onValueCommit={handleCustomRadiusCommit}
								max={32}
								step={1}
							/>
						</div>
					)}
				</div>
			</div>
		</SettingsCard>
	);
}

function LayoutDensityCard() {
	const settings = useSettingsStore((state) => state.settings.appearanceSettings);
	const updateSettings = useSettingsStore((state) => state.updateSettings);

	const handleUpdate = (val: string) => {
		const currentSettings = useSettingsStore.getState().settings.appearanceSettings;
		updateSettings({
			appearanceSettings: { ...currentSettings, layoutDensity: val as LayoutDensity },
		});
	};

	const handleCustomDensityCommit = (val: number[]) => {
		const currentSettings = useSettingsStore.getState().settings.appearanceSettings;
		updateSettings({ appearanceSettings: { ...currentSettings, customLayoutDensity: val[0] } });
	};

	const [localDensity, setLocalDensity] = useState(settings.customLayoutDensity);
	const [prevDensity, setPrevDensity] = useState(settings.customLayoutDensity);

	if (settings.customLayoutDensity !== prevDensity) {
		setLocalDensity(settings.customLayoutDensity);
		setPrevDensity(settings.customLayoutDensity);
	}

	return (
		<SettingsCard>
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
				<div className="space-y-1">
					<Label className="text-sm font-medium text-foreground" htmlFor="layout-density">
						Layout Density
					</Label>
					<p className="max-w-md text-sm text-muted-foreground">
						Adjust the padding and spacing of list items.
					</p>
				</div>
				<div className="flex w-full shrink-0 flex-col gap-4 sm:w-48">
					<Select value={settings.layoutDensity} onValueChange={handleUpdate}>
						<SelectTrigger
							id="layout-density"
							className="w-full corner-squircle supports-[corner-shape:squircle]:rounded-xl"
						>
							<SelectValue placeholder="Select density" />
						</SelectTrigger>
						<SelectContent position="popper" className="max-h-75">
							<SelectItem value="compact" className="rounded-md px-3 py-2.5">
								<div className="flex items-center gap-3">
									<Rows4Icon className="h-4 w-4 text-muted-foreground" />
									<span>Compact</span>
								</div>
							</SelectItem>
							<SelectItem value="cozy" className="rounded-md px-3 py-2.5">
								<div className="flex items-center gap-3">
									<Rows3Icon className="h-4 w-4 text-muted-foreground" />
									<span>Cozy</span>
								</div>
							</SelectItem>
							<SelectItem value="custom" className="rounded-md px-3 py-2.5">
								<div className="flex items-center gap-3">
									<Settings2Icon className="h-4 w-4 text-muted-foreground" />
									<span>Custom</span>
								</div>
							</SelectItem>
						</SelectContent>
					</Select>

					{settings.layoutDensity === "custom" && (
						<div className="animate-in space-y-4 rounded-md border border-border p-3 fade-in slide-in-from-top-1">
							<div className="flex items-center justify-between">
								<Label className="text-xs text-muted-foreground">Padding Value</Label>
								<span className="text-xs font-medium tabular-nums">{localDensity}px</span>
							</div>
							<Slider
								value={[localDensity]}
								onValueChange={(val) => setLocalDensity(val[0])}
								onValueCommit={handleCustomDensityCommit}
								max={32}
								min={4}
								step={1}
							/>
						</div>
					)}
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
			<div className="flex flex-col gap-1">
				<div className="flex items-center justify-between gap-4">
					<h2 className="font-heading text-xl font-semibold">Appearance</h2>

					<RestoreAppearanceButton />
				</div>

				<p className="mt-1 text-sm text-muted-foreground">
					Customize how {APP_INFO.name} looks and feels on your device.
				</p>
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
