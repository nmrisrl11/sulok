import { FolderIcon } from "@/components/icons";
import { ResetButton } from "@/components/reset-button";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/stores";
import type { AppearanceSettings, FolderColorMode } from "@/types/settings";
import { PaletteIcon, PipetteIcon, WandSparklesIcon } from "lucide-react";
import { useId } from "react";
import { DebouncedColorPicker } from "./debounced-color-picker";

type CustomColorPickerConfig = {
	id: string;
	label: string;
	key: keyof Pick<AppearanceSettings, "folderColorBack" | "folderColorFront" | "folderColorPaper">;
};

const CUSTOM_PICKERS: CustomColorPickerConfig[] = [
	{ id: "fc-back", label: "Back Color", key: "folderColorBack" },
	{ id: "fc-front", label: "Front Color", key: "folderColorFront" },
	{ id: "fc-paper", label: "Paper Color", key: "folderColorPaper" },
];

const FOLDER_PRESETS = [
	{ id: "default", label: "Default", back: "#56b2e3", front: "#98cfef", paper: "#ffffff" },
	{ id: "yellow", label: "Yellow", back: "#d9a04a", front: "#fcd68a", paper: "#ffffff" },
	{ id: "green", label: "Green", back: "#5ba674", front: "#9ee6b5", paper: "#ffffff" },
	{ id: "purple", label: "Purple", back: "#8869c9", front: "#c2a9fa", paper: "#ffffff" },
	{ id: "rose", label: "Rose", back: "#c96987", front: "#faa9c5", paper: "#ffffff" },
];

const SEGMENTS = [
	{ id: "preset", label: "Presets", icon: PaletteIcon },
	{ id: "complement", label: "Complementary", icon: WandSparklesIcon },
	{ id: "custom", label: "Custom", icon: PipetteIcon },
] as const;

export function FolderColorControl({ variant = "default" }: { variant?: "default" | "compact" }) {
	const componentId = useId();
	const { folderColorMode, folderColorBack, folderColorFront, folderColorPaper } = useSettingsStore(
		(state) => state.settings.appearanceSettings,
	);
	const updateSettings = useSettingsStore((state) => state.updateSettings);

	const handleModeChange = (val: FolderColorMode) => {
		const currentSettings = useSettingsStore.getState().settings.appearanceSettings;

		if (currentSettings.folderColorMode === "complement" && val === "custom") {
			// Commit any pending DebouncedColorPicker base-color value
			let baseHex = currentSettings.folderColorBack;
			const basePicker = document.getElementById(
				`fc-base-${componentId}`,
			) as HTMLInputElement | null;
			if (basePicker && basePicker.value !== baseHex) {
				baseHex = basePicker.value;
			}

			// Calculate the 70% color-mix equivalent in hex to ensure a smooth transition
			let frontColor = baseHex;

			if (/^#[0-9A-Fa-f]{6}$/i.test(baseHex)) {
				const r = parseInt(baseHex.slice(1, 3), 16);
				const g = parseInt(baseHex.slice(3, 5), 16);
				const b = parseInt(baseHex.slice(5, 7), 16);

				// color-mix(in srgb, BASE 70%, white)
				const mix = (c: number) => Math.round(c * 0.7 + 255 * 0.3);
				const nr = mix(r).toString(16).padStart(2, "0");
				const ng = mix(g).toString(16).padStart(2, "0");
				const nb = mix(b).toString(16).padStart(2, "0");

				frontColor = `#${nr}${ng}${nb}`;
			}

			updateSettings({
				appearanceSettings: {
					...currentSettings,
					folderColorMode: val,
					folderColorBack: baseHex,
					folderColorFront: frontColor,
					folderColorPaper: "#ffffff",
				},
			});
		} else {
			updateSettings({
				appearanceSettings: { ...currentSettings, folderColorMode: val },
			});
		}
	};

	const handleColorChange = (key: keyof AppearanceSettings, val: string) => {
		const currentSettings = useSettingsStore.getState().settings.appearanceSettings;
		updateSettings({
			appearanceSettings: { ...currentSettings, [key]: val },
		});
	};

	const applyPreset = (preset: (typeof FOLDER_PRESETS)[0]) => {
		const currentSettings = useSettingsStore.getState().settings.appearanceSettings;
		updateSettings({
			appearanceSettings: {
				...currentSettings,
				folderColorMode: "preset",
				folderColorBack: preset.back,
				folderColorFront: preset.front,
				folderColorPaper: preset.paper,
			},
		});
	};

	return (
		<div className="flex w-full flex-col gap-4">
			{/* Segmented Control */}
			<div
				className={cn(
					"flex w-full flex-row gap-1 rounded-xl border border-border/40 bg-muted/30 p-1 shadow-sm backdrop-blur-md supports-[corner-shape:squircle]:rounded-2xl supports-[corner-shape:squircle]:corner-squircle",
					variant === "compact"
						? "flex-wrap sm:flex-wrap"
						: "overflow-x-auto sm:flex-nowrap sm:overflow-visible",
				)}
			>
				{SEGMENTS.map((segment) => {
					const Icon = segment.icon;
					const isActive = folderColorMode === segment.id;
					return (
						<button
							key={segment.id}
							type="button"
							onClick={() => handleModeChange(segment.id)}
							className={cn(
								"group flex flex-1 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 text-center transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none supports-[corner-shape:squircle]:rounded-xl supports-[corner-shape:squircle]:corner-squircle sm:gap-2 sm:px-3 sm:py-1.5",
								variant === "compact" ? "flex-col" : "sm:flex-row",
								isActive
									? "bg-background text-foreground shadow-engraved"
									: "text-muted-foreground hover:bg-background/50 hover:text-foreground",
							)}
						>
							<Icon
								className={cn(
									"size-4 shrink-0 transition-colors sm:size-4",
									isActive
										? "text-primary"
										: "text-muted-foreground/80 group-hover:text-foreground",
								)}
							/>
							<span
								className={cn(
									"text-xs font-medium transition-colors",
									variant === "compact" ? "text-[10px] sm:text-[10px]" : "sm:text-sm",
									isActive
										? "text-foreground"
										: "text-muted-foreground group-hover:text-foreground",
								)}
							>
								{segment.label}
							</span>
						</button>
					);
				})}
			</div>

			<div className="pt-2">
				{folderColorMode === "preset" && (
					<div
						className={cn(
							"grid animate-in fade-in",
							variant === "compact"
								? "grid-cols-1 gap-2 sm:grid-cols-5 sm:gap-1.5"
								: "grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4",
						)}
					>
						{FOLDER_PRESETS.map((preset) => {
							const isActive =
								folderColorMode === "preset" &&
								folderColorBack === preset.back &&
								folderColorFront === preset.front;
							return (
								<button
									key={preset.id}
									type="button"
									onClick={() => applyPreset(preset)}
									title={preset.label}
									className={cn(
										"group flex min-w-0 items-center transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
										variant === "compact"
											? "gap-2 rounded-xl p-2 pr-3 text-left supports-[corner-shape:squircle]:rounded-2xl supports-[corner-shape:squircle]:corner-squircle sm:aspect-square sm:justify-center sm:gap-0 sm:rounded-lg sm:pr-2 sm:supports-[corner-shape:squircle]:rounded-xl"
											: "gap-2 rounded-xl p-2 pr-3 text-left supports-[corner-shape:squircle]:rounded-2xl supports-[corner-shape:squircle]:corner-squircle sm:gap-3 sm:pr-4",
										isActive
											? "bg-background shadow-engraved"
											: "border border-border/40 bg-muted/20 hover:bg-muted/50",
									)}
								>
									<div
										className={cn(
											"flex shrink-0 items-center justify-center transition-transform",
											variant === "compact" ? "h-8 w-8" : "h-8 w-8 sm:h-9 sm:w-9",
											!isActive && "group-hover:scale-105",
										)}
									>
										<FolderIcon
											className="h-full w-full drop-shadow-sm"
											style={
												{
													"--folder-color-back": preset.back,
													"--folder-color-front": preset.front,
													"--folder-color-paper": preset.paper,
												} as React.CSSProperties
											}
										/>
									</div>
									<span
										className={cn(
											"truncate text-sm font-medium transition-colors",
											variant === "compact" && "sm:hidden",
											isActive
												? "text-foreground"
												: "text-muted-foreground group-hover:text-foreground",
										)}
									>
										{preset.label}
									</span>
								</button>
							);
						})}
					</div>
				)}

				{folderColorMode === "complement" && (
					<div
						className={cn(
							"flex w-full animate-in flex-col fade-in",
							variant === "compact" ? "gap-3" : "sm:flex-row",
						)}
					>
						<div
							className={cn(
								"group relative flex w-full items-center gap-3 rounded-xl bg-muted/30 p-2 pr-4 text-left shadow-engraved transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none supports-[corner-shape:squircle]:rounded-2xl supports-[corner-shape:squircle]:corner-squircle",
								variant !== "compact" && "sm:w-[calc(33.333%-0.5rem)]",
							)}
						>
							<div className="absolute inset-0 z-10 cursor-pointer opacity-0">
								<DebouncedColorPicker
									id={`fc-base-${componentId}`}
									aria-label="Base Color"
									value={folderColorBack}
									onChange={(val) => handleColorChange("folderColorBack", val)}
									className="absolute inset-0 h-full w-full"
								/>
							</div>
							<div
								className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg ring-1 ring-border/50 transition-transform group-hover:scale-105 group-hover:ring-border supports-[corner-shape:squircle]:rounded-xl supports-[corner-shape:squircle]:corner-squircle"
								style={{ backgroundColor: folderColorBack }}
							/>
							<span className="text-sm font-medium whitespace-nowrap text-foreground">
								Base Color
							</span>
						</div>
					</div>
				)}

				{folderColorMode === "custom" && (
					<div
						className={cn(
							"grid w-full animate-in gap-3 fade-in",
							variant === "compact" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-3",
						)}
					>
						{CUSTOM_PICKERS.map((picker) => {
							const colorValues = {
								folderColorBack,
								folderColorFront,
								folderColorPaper,
							};
							const value = colorValues[picker.key];

							return (
								<div
									key={picker.id}
									className="group relative flex items-center gap-3 rounded-xl bg-muted/30 p-2 pr-4 text-left shadow-engraved transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none supports-[corner-shape:squircle]:rounded-2xl supports-[corner-shape:squircle]:corner-squircle"
								>
									<div className="absolute inset-0 z-10 cursor-pointer opacity-0">
										<DebouncedColorPicker
											id={`${picker.id}-${componentId}`}
											aria-label={picker.label}
											value={value}
											onChange={(val) => handleColorChange(picker.key, val)}
											className="absolute inset-0 h-full w-full"
										/>
									</div>
									<div
										className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg ring-1 ring-border/50 transition-transform group-hover:scale-105 group-hover:ring-border supports-[corner-shape:squircle]:rounded-xl supports-[corner-shape:squircle]:corner-squircle sm:h-10 sm:w-10"
										style={{ backgroundColor: value }}
									/>
									<span className="truncate text-xs font-medium text-foreground sm:text-sm">
										{picker.label}
									</span>
								</div>
							);
						})}
					</div>
				)}
			</div>

			{/* Dedicated Live Preview Section */}
			{variant !== "compact" && (
				<div className="mt-2 flex flex-col items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4 supports-[corner-shape:squircle]:rounded-2xl supports-[corner-shape:squircle]:corner-squircle sm:flex-row sm:gap-6 sm:p-5">
					<div className="flex flex-col items-center gap-1.5 text-center sm:items-start sm:text-left">
						<span className="text-sm font-semibold text-primary">Live Preview</span>
						<span className="max-w-70 text-xs leading-relaxed text-muted-foreground">
							This is how your folders will look across your library. A little touch of
							personalization makes your workspace truly yours.
						</span>
					</div>
					<div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-background/50 shadow-inner ring-1 ring-border/50 supports-[corner-shape:squircle]:rounded-2xl supports-[corner-shape:squircle]:corner-squircle sm:h-24 sm:w-24">
						<FolderIcon className="size-12 drop-shadow-md transition-all sm:size-16" />
					</div>
				</div>
			)}
		</div>
	);
}

export function FolderCustomizationSetting({
	variant = "default",
}: {
	variant?: "default" | "compact";
}) {
	const updateSettings = useSettingsStore((state) => state.updateSettings);

	const handleReset = () => {
		const currentSettings = useSettingsStore.getState().settings.appearanceSettings;
		updateSettings({
			appearanceSettings: {
				...currentSettings,
				folderColorMode: "preset",
				folderColorBack: "#56b2e3",
				folderColorFront: "#98cfef",
				folderColorPaper: "#ffffff",
			},
		});
	};

	if (variant === "compact") {
		return <FolderColorControl variant="compact" />;
	}

	return (
		<div className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:py-6 sm:first:pt-0 sm:last:pb-0">
			<div className="space-y-1">
				<div className="flex items-center justify-between gap-4">
					<h3 className="text-sm font-medium text-foreground">Folder Customization</h3>
					<ResetButton onClick={handleReset} />
				</div>
				<p className="w-full text-sm text-muted-foreground sm:max-w-md">
					Personalize the colors of your folder icons.
				</p>
			</div>
			<div className="flex w-full shrink-0 flex-col gap-4 pt-2">
				<FolderColorControl variant="default" />
			</div>
		</div>
	);
}
