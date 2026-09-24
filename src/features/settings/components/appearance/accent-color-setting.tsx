import { ResetButton } from "@/components/reset-button";
import { useTheme } from "@/hooks";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/stores";
import { CheckIcon, PlusIcon } from "lucide-react";
import { DebouncedColorPicker } from "./debounced-color-picker";

type AccentPreset = {
	id: string;
	label: string;
	color?: string;
};

const ACCENT_PRESETS: AccentPreset[] = [
	{ id: "foreground", label: "Default" },
	{ id: "#0ea5e9", label: "Cyan", color: "#0ea5e9" },
	{ id: "#f97316", label: "Orange", color: "#f97316" },
	{ id: "#22c55e", label: "Green", color: "#22c55e" },
	{ id: "#a855f7", label: "Purple", color: "#a855f7" },
	{ id: "#f43f5e", label: "Rose", color: "#f43f5e" },
];
export function AccentColorControl({
	"aria-label": ariaLabel,
}: {
	"aria-label"?: string;
} = {}) {
	const accentColor = useSettingsStore((state) => state.settings.appearanceSettings.accentColor);
	const updateSettings = useSettingsStore((state) => state.updateSettings);
	const { theme } = useTheme();

	const handleUpdate = (val: string) => {
		const currentSettings = useSettingsStore.getState().settings.appearanceSettings;
		updateSettings({ appearanceSettings: { ...currentSettings, accentColor: val } });
	};

	const isDark =
		theme === "dark" ||
		theme === "midnight" ||
		theme === "mocha" ||
		(theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

	const defaultForeground = isDark ? "#f7f5f0" : "#1e1b18";
	const resolvedColor = accentColor === "foreground" ? defaultForeground : accentColor;

	const isCustom =
		!ACCENT_PRESETS.some((p) => p.id === accentColor) && accentColor !== "foreground";

	return (
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
			{ACCENT_PRESETS.map((preset) => {
				const displayColor = preset.color ?? defaultForeground;

				return (
					<button
						key={preset.id}
						type="button"
						onClick={() => handleUpdate(preset.id)}
						className={cn(
							"group flex min-w-0 items-center gap-2 rounded-xl p-2 pr-3 text-left transition-all hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none supports-[corner-shape:squircle]:rounded-2xl supports-[corner-shape:squircle]:corner-squircle sm:gap-3 sm:pr-4",
							accentColor === preset.id
								? "bg-background text-foreground shadow-engraved"
								: "border border-border/40 bg-muted/20",
						)}
					>
						<div
							className={cn(
								"flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 transition-transform group-hover:scale-105 supports-[corner-shape:squircle]:rounded-xl supports-[corner-shape:squircle]:corner-squircle sm:h-9 sm:w-9",
								accentColor === preset.id ? "ring-primary/50" : "ring-border/50 hover:ring-border",
							)}
							style={{ backgroundColor: displayColor }}
						>
							{accentColor === preset.id && (
								<CheckIcon
									className="h-4 w-4 drop-shadow-sm sm:h-5 sm:w-5"
									style={{
										color:
											preset.id === "foreground" ? (isDark ? "#1e1b18" : "#f7f5f0") : "#ffffff",
									}}
								/>
							)}
						</div>
						<span
							className={cn(
								"truncate text-sm font-medium transition-colors",
								accentColor === preset.id
									? "text-foreground"
									: "text-muted-foreground group-hover:text-foreground",
							)}
						>
							{preset.label}
						</span>
					</button>
				);
			})}

			<div
				className={cn(
					"group relative flex min-w-0 items-center gap-2 rounded-xl p-2 pr-3 text-left transition-all hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none supports-[corner-shape:squircle]:rounded-2xl supports-[corner-shape:squircle]:corner-squircle sm:gap-3 sm:pr-4",
					isCustom
						? "bg-background text-foreground shadow-engraved"
						: "border border-border/40 bg-muted/20",
				)}
			>
				<div className="absolute inset-0 z-10 cursor-pointer opacity-0">
					<DebouncedColorPicker
						id="accent-color"
						aria-label={ariaLabel || "Custom Accent Color"}
						value={resolvedColor}
						onChange={handleUpdate}
						className="absolute inset-0 h-full w-full"
					/>
				</div>
				<div
					className={cn(
						"flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg ring-1 transition-transform group-hover:scale-105 supports-[corner-shape:squircle]:rounded-xl supports-[corner-shape:squircle]:corner-squircle sm:h-9 sm:w-9",
						isCustom ? "ring-primary/50" : "ring-border/50 hover:ring-border",
					)}
					style={{ backgroundColor: isCustom ? resolvedColor : "transparent" }}
				>
					{!isCustom && (
						<PlusIcon className="h-4 w-4 text-muted-foreground group-hover:text-foreground sm:h-5 sm:w-5" />
					)}
				</div>
				<span
					className={cn(
						"truncate text-sm font-medium transition-colors",
						isCustom ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
					)}
				>
					Custom
				</span>
			</div>
		</div>
	);
}

export function AccentColorSetting() {
	const updateSettings = useSettingsStore((state) => state.updateSettings);
	const handleReset = () => {
		const currentSettings = useSettingsStore.getState().settings.appearanceSettings;
		updateSettings({
			appearanceSettings: { ...currentSettings, accentColor: "foreground" },
		});
	};

	return (
		<div className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:py-6 sm:first:pt-0 sm:last:pb-0">
			<div className="space-y-1">
				<div className="flex items-center justify-between gap-4">
					<h3 className="text-sm font-medium text-foreground">Accent Color</h3>
					<ResetButton onClick={handleReset} />
				</div>
				<p className="w-full text-sm text-muted-foreground sm:max-w-md">
					Choose a custom primary color for buttons and highlights.
				</p>
			</div>
			<div className="pt-2">
				<AccentColorControl />
			</div>
		</div>
	);
}
