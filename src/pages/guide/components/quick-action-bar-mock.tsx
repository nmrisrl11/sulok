import { SuloMascot } from "@/components/logo/sulo-mascot";
import { useMockAnimation } from "@/hooks";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/stores";
import { CornerDownLeftIcon, MousePointer2Icon } from "lucide-react";

export function QuickActionBarMock() {
	const defaultExpression = useSettingsStore(
		(state) => state.settings.suloSettings.expressionQuickAction,
	);
	const { isActive, prefersReducedMotion } = useMockAnimation(2500);

	return (
		<div className="relative flex h-60 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-muted/20 shadow-inner select-none corner-squircle supports-[corner-shape:squircle]:rounded-3xl supports-[corner-shape:squircle]:corner-squircle sm:w-85">
			{/* Fake App Background */}
			<div
				className={cn(
					"absolute inset-0 flex transition-opacity duration-500",
					isActive ? "opacity-10 delay-500" : "opacity-20 delay-0",
					prefersReducedMotion && isActive && "delay-0",
				)}
			>
				{/* Faint Sidebar */}
				<div className="flex w-24 flex-col gap-3 border-r border-border/50 p-4">
					<div className="h-4 w-full rounded bg-foreground/20" />
					<div className="mt-2 h-2 w-3/4 rounded bg-foreground/10" />
					<div className="h-2 w-5/6 rounded bg-foreground/10" />
					<div className="h-2 w-4/6 rounded bg-foreground/10" />
				</div>
				{/* Faint Main Content */}
				<div className="flex flex-1 flex-col gap-4 p-4">
					<div className="h-6 w-1/3 rounded bg-foreground/20" />
					<div className="grid grid-cols-2 gap-3">
						<div className="h-16 rounded-lg bg-foreground/10" />
						<div className="h-16 rounded-lg bg-foreground/10" />
						<div className="h-16 rounded-lg bg-foreground/10" />
						<div className="h-16 rounded-lg bg-foreground/10" />
					</div>
				</div>
			</div>

			{/* Fake Cursor simulating the click */}
			{!prefersReducedMotion && (
				<div
					className={cn(
						"absolute z-20 h-5 w-5 drop-shadow-md transition-all ease-[cubic-bezier(0.2,0.8,0.2,1)]",
						isActive
							? "top-48.75 left-[52%] scale-95 opacity-100 delay-0 duration-500"
							: "top-10 left-[40%] scale-100 opacity-100 delay-0 duration-500",
					)}
				>
					<MousePointer2Icon
						className="h-full w-full text-foreground"
						style={{ fill: "currentColor" }}
					/>
					<div
						className={cn(
							"absolute top-0 left-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40 transition-opacity",
							isActive ? "opacity-100 delay-500 duration-100" : "opacity-0 delay-0 duration-0",
							isActive && "animate-ping",
						)}
						style={{
							animationDelay: isActive ? "500ms" : "0ms",
							animationIterationCount: 1,
							animationFillMode: "forwards",
						}}
					/>
				</div>
			)}

			{/* FAB Mock (Animated via state) */}
			<div className="absolute right-0 bottom-6 left-0 z-10 mx-auto flex items-center justify-center">
				<div
					className={cn(
						"flex h-13 items-center gap-3 overflow-hidden rounded-full border border-border bg-card/90 p-1.5 text-card-foreground shadow-lg backdrop-blur-md transition-all duration-500 ease-out corner-squircle supports-[corner-shape:squircle]:rounded-2xl",
						isActive ? "w-65 pr-2 delay-500" : "w-13 pr-1.5 delay-0",
						prefersReducedMotion && isActive && "delay-0",
					)}
				>
					{/* Mascot Icon */}
					<div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted/30 transition-colors">
						<SuloMascot
							expression={defaultExpression}
							aria-hidden={isActive}
							className={cn(
								"absolute inset-0 m-auto h-5 w-5 transition-all duration-500",
								isActive ? "scale-110 opacity-0 delay-500" : "scale-100 opacity-100 delay-0",
								prefersReducedMotion && isActive && "delay-0",
							)}
						/>
						<SuloMascot
							expression="curious"
							aria-hidden={!isActive}
							className={cn(
								"absolute inset-0 m-auto h-5 w-5 transition-all duration-500",
								isActive ? "scale-110 opacity-100 delay-500" : "scale-90 opacity-0 delay-0",
								prefersReducedMotion && isActive && "delay-0",
							)}
						/>
					</div>

					{/* Expanded Content */}
					<div
						className={cn(
							"flex min-w-47.5 flex-1 items-center gap-2 transition-opacity duration-500",
							isActive ? "opacity-100 delay-500" : "opacity-0 delay-0",
							prefersReducedMotion && isActive && "delay-0",
						)}
					>
						<span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
							Drop a link to your corner...
						</span>
						<div className="flex h-8 w-8 shrink-0 items-center justify-center text-muted-foreground transition-colors duration-300">
							<CornerDownLeftIcon className="h-4 w-4" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
