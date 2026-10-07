import {
	ACCENT_PRESETS,
	CORNER_STYLES,
	WORKSPACE_THEMES,
} from "@/features/settings/components/appearance/constants";
import { useMockAnimation, useTheme } from "@/hooks";
import { cn } from "@/lib/utils";
import { CheckIcon, MousePointer2Icon, WandSparklesIcon } from "lucide-react";

export function QuickCustomizeMock() {
	const { isActive, prefersReducedMotion } = useMockAnimation(2000);
	const { theme } = useTheme();

	const isDark =
		theme === "dark" ||
		theme === "midnight" ||
		theme === "mocha" ||
		(theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

	const defaultForeground = isDark ? "#f7f5f0" : "#1e1b18";

	return (
		<div className="relative flex h-92 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-muted/20 shadow-inner select-none corner-squircle supports-[corner-shape:squircle]:rounded-3xl supports-[corner-shape:squircle]:corner-squircle sm:w-85">
			<div className="relative z-10 flex w-full max-w-72 flex-col overflow-hidden rounded-xl border border-border bg-background shadow-xl shadow-black/5 corner-squircle supports-[corner-shape:squircle]:rounded-2xl dark:shadow-black/20">
				<div className="flex flex-col gap-1 border-b border-border/50 p-4 pb-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<WandSparklesIcon className="h-4 w-4 text-foreground" />
							<div className="text-sm font-semibold text-foreground">Quick Customize</div>
						</div>
						<div className="flex items-center rounded bg-muted px-1.5 py-0.5 text-[8px] font-medium text-muted-foreground">
							SHIFT + C
						</div>
					</div>
					<div className="text-[10px] text-muted-foreground">
						Preview changes live without leaving your corner.
					</div>
				</div>

				<div className="flex flex-1 flex-col gap-5 overflow-hidden p-4">
					{/* Workspace Theme */}
					<div className="flex flex-col gap-1.5">
						<div className="text-xs font-medium text-foreground">Workspace Theme</div>
						<div className="flex gap-2">
							{WORKSPACE_THEMES.slice(0, 6).map((t, idx) => {
								const isActive = idx === 0;
								return (
									<div
										key={t.id}
										className={cn(
											"flex w-7 items-center justify-center rounded-lg transition-all supports-[corner-shape:squircle]:rounded-2xl supports-[corner-shape:squircle]:corner-squircle",
											isActive
												? "bg-background p-1 shadow-engraved"
												: "border border-border/40 bg-muted/20",
										)}
									>
										<div
											className={cn(
												"flex aspect-square w-full shrink-0 items-center justify-center rounded-md ring-1 transition-transform supports-[corner-shape:squircle]:rounded-xl supports-[corner-shape:squircle]:corner-squircle",
												isActive ? "ring-primary/50" : "ring-border/50",
											)}
											style={{ background: t.bg }}
										>
											{isActive && (
												<CheckIcon className="h-3 w-3 drop-shadow-sm" style={{ color: t.fg }} />
											)}
										</div>
									</div>
								);
							})}
						</div>
					</div>

					{/* Accent Color */}
					<div className="flex flex-col gap-1.5">
						<div className="text-xs font-medium text-foreground">Accent Color</div>
						<div className="flex gap-2">
							{ACCENT_PRESETS.slice(0, 6).map((preset, idx) => {
								const displayColor = preset.color ?? defaultForeground;
								const isItemSelected = idx === (isActive ? 1 : 0);
								return (
									<div
										key={preset.id}
										className={cn(
											"flex w-7 items-center justify-center rounded-lg transition-all duration-300 supports-[corner-shape:squircle]:rounded-2xl supports-[corner-shape:squircle]:corner-squircle",
											isItemSelected
												? "bg-background p-1 shadow-engraved"
												: "border border-border/40 bg-muted/20 p-0 shadow-none",
										)}
									>
										<div
											className={cn(
												"flex aspect-square w-full shrink-0 items-center justify-center rounded-md ring-1 transition-transform duration-300 supports-[corner-shape:squircle]:rounded-xl supports-[corner-shape:squircle]:corner-squircle",
												isItemSelected ? "ring-primary/50" : "ring-border/50",
											)}
											style={{
												backgroundColor: displayColor,
											}}
										>
											<CheckIcon
												className={cn(
													"h-3 w-3 drop-shadow-sm transition-all duration-300",
													isItemSelected ? "scale-100 opacity-100" : "scale-0 opacity-0",
												)}
												style={{
													color:
														preset.id === "foreground"
															? isDark
																? "#1e1b18"
																: "#f7f5f0"
															: "#ffffff",
												}}
											/>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					{/* Corner Radius */}
					<div className="flex flex-col gap-1.5">
						<div className="text-xs font-medium text-foreground">Corner Radius</div>
						<div className="grid grid-cols-3 gap-1 rounded-lg bg-muted/40 p-1 supports-[corner-shape:squircle]:rounded-2xl supports-[corner-shape:squircle]:corner-squircle">
							{CORNER_STYLES.map((style, idx) => {
								const Icon = style.icon;
								const isActive = idx === 0;
								return (
									<div
										key={style.id}
										className={cn(
											"flex flex-col items-center justify-center gap-1.5 rounded-md py-2.5 text-center transition-all supports-[corner-shape:squircle]:rounded-xl supports-[corner-shape:squircle]:corner-squircle",
											isActive
												? "bg-background text-foreground shadow-engraved"
												: "text-muted-foreground",
										)}
									>
										<Icon
											className={cn(
												"size-5 shrink-0 transition-colors",
												isActive ? "text-primary" : "text-muted-foreground/80",
											)}
										/>
										<span
											className={cn(
												"text-[11px] leading-tight font-medium transition-colors",
												isActive ? "text-foreground" : "text-muted-foreground",
											)}
										>
											{style.label}
										</span>
									</div>
								);
							})}
						</div>
					</div>
				</div>

				{/* Simulated Cursor */}
				<div
					className={cn(
						"absolute top-45 left-16.25 z-20 h-5 w-5 drop-shadow-md transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
						isActive
							? "translate-x-0 translate-y-0 scale-95 opacity-100"
							: "translate-x-12 translate-y-16 opacity-0",
					)}
				>
					<MousePointer2Icon className="h-full w-full fill-foreground text-foreground" />
					<div
						className={cn(
							"absolute top-0 left-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40 opacity-0 transition-all duration-700",
							isActive && !prefersReducedMotion && "animate-ping opacity-100",
						)}
					/>
				</div>
			</div>
		</div>
	);
}
