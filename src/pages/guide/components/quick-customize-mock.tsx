import {
	ACCENT_PRESETS,
	CORNER_STYLES,
	WORKSPACE_THEMES,
} from "@/features/settings/components/appearance/constants";
import { useTheme } from "@/hooks";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "framer-motion";
import { CheckIcon, MousePointer2Icon, WandSparklesIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function QuickCustomizeMock() {
	const prefersReducedMotion = useReducedMotion() === true;
	const { theme } = useTheme();
	const [step, setStep] = useState(0);

	useEffect(() => {
		if (prefersReducedMotion) return;
		let isMounted = true;
		const runLoop = async () => {
			while (isMounted) {
				setStep(0); // Idle
				await new Promise((r) => setTimeout(r, 1000));
				if (!isMounted) break;

				setStep(1); // Move to Theme
				await new Promise((r) => setTimeout(r, 600));
				if (!isMounted) break;

				setStep(2); // Hover Theme
				await new Promise((r) => setTimeout(r, 800));
				if (!isMounted) break;

				setStep(3); // Move to Accent
				await new Promise((r) => setTimeout(r, 600));
				if (!isMounted) break;

				setStep(4); // Hover Accent
				await new Promise((r) => setTimeout(r, 800));
				if (!isMounted) break;

				setStep(5); // Move to Corner Standard
				await new Promise((r) => setTimeout(r, 600));
				if (!isMounted) break;

				setStep(6); // Click Corner Standard (Ping ON)
				await new Promise((r) => setTimeout(r, 500));
				if (!isMounted) break;

				setStep(7); // Wait Corner Standard (Ping OFF)
				await new Promise((r) => setTimeout(r, 800));
				if (!isMounted) break;

				setStep(8); // Move to Corner Squircle
				await new Promise((r) => setTimeout(r, 600));
				if (!isMounted) break;

				setStep(9); // Click Corner Squircle (Ping ON)
				await new Promise((r) => setTimeout(r, 500));
				if (!isMounted) break;

				setStep(10); // Wait Corner Squircle (Ping OFF)
				await new Promise((r) => setTimeout(r, 800));
				if (!isMounted) break;

				setStep(11); // Move away
				await new Promise((r) => setTimeout(r, 600));
			}
		};
		runLoop();
		return () => {
			isMounted = false;
		};
	}, [prefersReducedMotion]);

	const isDark =
		theme === "dark" ||
		theme === "midnight" ||
		theme === "mocha" ||
		(theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

	const defaultForeground = isDark ? "#f7f5f0" : "#1e1b18";

	const hoveredThemeIndex = step === 2 ? 1 : null;
	const hoveredAccentIndex = step === 4 ? 3 : null;
	const activeCornerIndex = step >= 6 && step < 9 ? 1 : 0;
	const showPing = !prefersReducedMotion && (step === 6 || step === 9);

	const getMouseClasses = (s: number) => {
		if (prefersReducedMotion) return "top-[295px] left-[90px] opacity-100 scale-95";
		if (s === 0 || s === 11) return "top-[320px] left-[200px] opacity-0 scale-100";
		if (s === 1 || s === 2) return "top-[116px] left-[66px] opacity-100 scale-100";
		if (s === 3 || s === 4) return "top-[186px] left-[138px] opacity-100 scale-100";
		if (s === 5) return "top-[281px] left-[148px] opacity-100 scale-100";
		if (s === 6 || s === 7) return "top-[281px] left-[148px] opacity-100 scale-95";
		if (s === 8) return "top-[281px] left-[61px] opacity-100 scale-100";
		if (s === 9 || s === 10) return "top-[281px] left-[61px] opacity-100 scale-95";
		return "top-[320px] left-[200px] opacity-0";
	};

	const sqOuter =
		activeCornerIndex === 0
			? "corner-squircle supports-[corner-shape:squircle]:rounded-3xl supports-[corner-shape:squircle]:corner-squircle"
			: "";
	const sqInner =
		activeCornerIndex === 0 ? "corner-squircle supports-[corner-shape:squircle]:rounded-2xl" : "";
	const sqBtn =
		activeCornerIndex === 0
			? "supports-[corner-shape:squircle]:rounded-2xl supports-[corner-shape:squircle]:corner-squircle"
			: "";
	const sqBtnInner =
		activeCornerIndex === 0
			? "supports-[corner-shape:squircle]:rounded-xl supports-[corner-shape:squircle]:corner-squircle"
			: "";

	return (
		<div
			className={cn(
				"relative flex h-92 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-muted/20 shadow-inner select-none sm:w-85",
				sqOuter,
			)}
		>
			<div
				className={cn(
					"relative z-10 flex w-full max-w-72 flex-col overflow-hidden rounded-xl border border-border bg-background shadow-xl shadow-black/5 dark:shadow-black/20",
					sqInner,
				)}
			>
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
								const isHovered = hoveredThemeIndex === idx;
								return (
									<div
										key={t.id}
										className={cn(
											"flex h-7 w-7 items-center justify-center rounded-lg border transition-colors",
											sqBtn,
											isActive
												? "border-transparent bg-background shadow-engraved"
												: isHovered
													? "scale-110 border-border/60 bg-muted/40"
													: "border-border/40 bg-muted/20",
										)}
									>
										<div
											className={cn(
												"flex aspect-square w-full shrink-0 items-center justify-center rounded-md ring-1 transition-transform",
												sqBtnInner,
												isActive ? "scale-75 ring-primary/50" : "scale-100 ring-border/50",
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
								const isItemSelected = idx === 0; // Default
								const isHovered = hoveredAccentIndex === idx;
								return (
									<div
										key={preset.id}
										className={cn(
											"flex h-7 w-7 items-center justify-center rounded-lg border transition-all duration-300",
											sqBtn,
											isItemSelected
												? "border-transparent bg-background shadow-engraved"
												: isHovered
													? "scale-110 border-border/80 bg-muted/40 shadow-none"
													: "border-border/40 bg-muted/20 shadow-none",
										)}
									>
										<div
											className={cn(
												"flex aspect-square w-full shrink-0 items-center justify-center rounded-md ring-1 transition-transform duration-300",
												sqBtnInner,
												isItemSelected ? "scale-75 ring-primary/50" : "scale-100 ring-border/50",
											)}
											style={{
												backgroundColor: displayColor,
											}}
										>
											<CheckIcon
												className={cn(
													"h-3 w-3 drop-shadow-sm transition-transform duration-300",
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
						<div className={cn("grid grid-cols-3 gap-1 rounded-lg bg-muted/40 p-1", sqBtn)}>
							{CORNER_STYLES.map((style, idx) => {
								const Icon = style.icon;
								const isActive = activeCornerIndex === idx;
								return (
									<div
										key={style.id}
										className={cn(
											"flex flex-col items-center justify-center gap-1.5 rounded-md py-2.5 text-center transition-colors",
											sqBtnInner,
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
						"absolute z-20 h-5 w-5 drop-shadow-md transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
						getMouseClasses(step),
					)}
				>
					<MousePointer2Icon className="h-full w-full fill-foreground text-foreground" />
					<div
						key={step}
						className={cn(
							"absolute top-0 left-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40 opacity-0 transition-all duration-700",
							showPing && "animate-ping opacity-100",
						)}
						style={
							showPing
								? {
										animationIterationCount: 1,
										animationFillMode: "forwards",
										animationDuration: "500ms",
									}
								: {}
						}
					/>
				</div>
			</div>
		</div>
	);
}
