import { APP_INFO } from "@/constants/app-info";
import { useMockAnimation } from "@/hooks";
import { cn } from "@/lib/utils";
import { MousePointer2Icon } from "lucide-react";

export function ContextMenuMock() {
	const { isActive, prefersReducedMotion } = useMockAnimation(2500);

	return (
		<div className="relative flex h-60 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-muted/20 shadow-inner select-none corner-squircle supports-[corner-shape:squircle]:rounded-3xl supports-[corner-shape:squircle]:corner-squircle sm:w-85 ">
			{/* Fake Webpage Background */}
			<div className="absolute inset-0 flex flex-col gap-4 p-6 opacity-30">
				<div className="h-4 w-1/3 rounded bg-foreground/20" />
				<div className="flex flex-col gap-2">
					<div className="h-2 w-full rounded bg-foreground/10" />
					<div className="h-2 w-5/6 rounded bg-foreground/10" />
					<div className="h-2 w-4/6 rounded bg-foreground/10" />
				</div>
				<div className="flex flex-col gap-2">
					<div className="h-2 w-full rounded bg-foreground/10" />
					<div className="h-2 w-full rounded bg-foreground/10" />
				</div>
			</div>

			<div className="relative">
				{/* The Context Menu */}
				<div
					className={cn(
						"relative z-10 w-50 origin-top-left rounded-lg border border-border/50 bg-background/95 py-1.5 shadow-xl backdrop-blur-md transition-all",
						isActive
							? "scale-100 opacity-100 delay-100 duration-200"
							: "scale-95 opacity-0 delay-0 duration-200",
						prefersReducedMotion && "scale-100 opacity-100 delay-0",
					)}
				>
					<div className="flex items-center justify-between px-3 py-1.5 text-sm text-foreground/70">
						<span>Back</span>
						<span className="text-xs opacity-50">Alt+Left</span>
					</div>
					<div className="flex items-center justify-between px-3 py-1.5 text-sm text-foreground/70 opacity-50">
						<span>Forward</span>
						<span className="text-xs opacity-50">Alt+Right</span>
					</div>
					<div className="flex items-center justify-between px-3 py-1.5 text-sm text-foreground/70">
						<span>Reload</span>
						<span className="text-xs opacity-50">Ctrl+R</span>
					</div>
					<div className="my-1 h-px w-full bg-border/50" />

					{/* Highlighted Extension Action */}
					<div
						className={cn(
							"flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary transition-colors",
							isActive
								? "bg-primary/20 delay-[900ms] duration-200"
								: "bg-transparent delay-0 duration-200",
							prefersReducedMotion && "bg-primary/20 delay-0",
						)}
					>
						<img src="/favicon.svg" alt="" className="h-4 w-4" />
						<span>Save Page to {APP_INFO.name}</span>
					</div>

					<div className="my-1 h-px w-full bg-border/50" />
					<div className="flex items-center justify-between px-3 py-1.5 text-sm text-foreground/70">
						<span>Inspect</span>
						<span className="text-xs opacity-50">Ctrl+Shift+I</span>
					</div>
				</div>

				{/* Right-click Ping Indicator */}
				<div
					className={cn(
						"absolute top-2 left-2 z-20 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40",
						isActive && !prefersReducedMotion ? "animate-ping" : "opacity-0",
					)}
					style={{ animationIterationCount: 1, animationFillMode: "forwards" }}
				/>

				{/* Fake Cursor pointing exactly at the Save to Sulok action */}
				<div
					className={cn(
						"absolute z-20 h-5 w-5 drop-shadow-md transition-all ease-[cubic-bezier(0.2,0.8,0.2,1)]",
						isActive
							? "top-31 left-42.5 scale-95 opacity-100 delay-[400ms] duration-500"
							: "top-2 left-2 scale-100 opacity-100 delay-0 duration-300",
						prefersReducedMotion && "top-31 left-42.5 scale-95 opacity-100 delay-0",
					)}
				>
					<MousePointer2Icon
						className="h-full w-full text-foreground"
						style={{ fill: "currentColor" }}
					/>
					<div
						className={cn(
							"absolute top-0 left-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40 transition-opacity",
							isActive ? "opacity-100 delay-[900ms] duration-300" : "opacity-0 delay-0 duration-0",
							!prefersReducedMotion && isActive && "animate-ping",
							prefersReducedMotion && "opacity-0", // No ping effect in reduced motion
						)}
					/>
				</div>
			</div>
		</div>
	);
}
