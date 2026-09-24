import { ResetButton } from "@/components/reset-button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/stores";
import type { LayoutDensity } from "@/types/settings";
import { Rows3Icon, Rows4Icon, Settings2Icon } from "lucide-react";
import { useState } from "react";

const LAYOUT_DENSITIES = [
	{ id: "compact", label: "Compact", icon: Rows4Icon },
	{ id: "cozy", label: "Cozy", icon: Rows3Icon },
	{ id: "custom", label: "Custom", icon: Settings2Icon },
] as const;

export function LayoutDensityControl() {
	const layoutDensity = useSettingsStore(
		(state) => state.settings.appearanceSettings.layoutDensity,
	);
	const customLayoutDensity = useSettingsStore(
		(state) => state.settings.appearanceSettings.customLayoutDensity,
	);
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

	const [localDensity, setLocalDensity] = useState(customLayoutDensity);
	const [prevDensity, setPrevDensity] = useState(customLayoutDensity);

	if (customLayoutDensity !== prevDensity) {
		setLocalDensity(customLayoutDensity);
		setPrevDensity(customLayoutDensity);
	}

	return (
		<div className="flex w-full flex-col gap-4">
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
				{LAYOUT_DENSITIES.map((density) => {
					const Icon = density.icon;
					const isActive = layoutDensity === density.id;
					return (
						<button
							key={density.id}
							type="button"
							onClick={() => handleUpdate(density.id)}
							className={cn(
								"group flex min-w-0 items-center gap-2 rounded-xl p-2 pr-3 text-left transition-all hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none supports-[corner-shape:squircle]:rounded-2xl supports-[corner-shape:squircle]:corner-squircle sm:gap-3 sm:pr-4",
								isActive
									? "bg-background text-foreground shadow-engraved"
									: "border border-border/40 bg-muted/20",
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
									"text-xs font-medium transition-colors sm:text-sm",
									isActive
										? "text-foreground"
										: "text-muted-foreground group-hover:text-foreground",
								)}
							>
								{density.label}
							</span>
						</button>
					);
				})}
			</div>
			{layoutDensity === "custom" && (
				<div className="animate-in space-y-4 rounded-xl bg-muted/30 p-4 shadow-engraved fade-in slide-in-from-top-1 supports-[corner-shape:squircle]:rounded-2xl supports-[corner-shape:squircle]:corner-squircle">
					<div className="flex items-center justify-between">
						<h3 className="text-xs text-muted-foreground">Padding Value</h3>
						<span className="text-xs font-medium text-foreground tabular-nums">
							{localDensity}px
						</span>
					</div>
					<Slider
						value={[localDensity]}
						onValueChange={(val) => setLocalDensity(val[0])}
						onValueCommit={handleCustomDensityCommit}
						min={4}
						max={32}
						step={1}
						aria-label="Padding Value"
					/>
				</div>
			)}
		</div>
	);
}

export function LayoutDensitySetting() {
	const updateSettings = useSettingsStore((state) => state.updateSettings);
	const handleReset = () => {
		const currentSettings = useSettingsStore.getState().settings.appearanceSettings;
		updateSettings({
			appearanceSettings: { ...currentSettings, layoutDensity: "compact", customLayoutDensity: 12 },
		});
	};

	return (
		<div className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:py-6 sm:first:pt-0 sm:last:pb-0">
			<div className="space-y-1">
				<div className="flex items-center justify-between gap-4">
					<h3 className="text-sm font-medium text-foreground">Layout Density</h3>
					<ResetButton onClick={handleReset} />
				</div>
				<p className="w-full text-sm text-muted-foreground sm:max-w-md">
					Adjust the padding and spacing of list items.
				</p>
			</div>
			<div className="flex w-full shrink-0 flex-col gap-4 pt-2">
				<LayoutDensityControl />
			</div>
		</div>
	);
}
