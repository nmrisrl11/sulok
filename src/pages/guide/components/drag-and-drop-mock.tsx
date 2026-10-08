import { FolderIcon as CustomFolderIcon } from "@/components/icons";
import { APP_INFO } from "@/constants/app-info";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "framer-motion";
import { CheckCircle2Icon, GlobeIcon, MousePointer2Icon } from "lucide-react";
import { useEffect, useState } from "react";

const TOP_FOLDERS = [
	{ name: "Development Toolkit", opacity: "opacity-20" },
	{ name: "Agent Skills", opacity: "opacity-50" },
];

const BOTTOM_LINKS = [
	{ name: "Component Library", url: "https://ui.example.com", opacity: "opacity-50" },
	{ name: "Brand Assets & Logos", url: "https://brand.example.com", opacity: "opacity-20" },
];

export function DragAndDropMock() {
	const prefersReducedMotion = useReducedMotion() === true;
	const [step, setStep] = useState(0);

	useEffect(() => {
		if (prefersReducedMotion) return;
		let isMounted = true;
		const runLoop = async () => {
			while (isMounted) {
				setStep(0); // Idle
				await new Promise((r) => setTimeout(r, 1000));
				if (!isMounted) break;

				setStep(1); // Dragging
				await new Promise((r) => setTimeout(r, 1200)); // Travel time
				if (!isMounted) break;

				setStep(2); // Dropped
				await new Promise((r) => setTimeout(r, 1800)); // Show success message
			}
		};
		runLoop();
		return () => {
			isMounted = false;
		};
	}, [prefersReducedMotion]);

	const isDragging = step === 1;
	const isDropped = step === 2;

	return (
		<div className="relative flex h-60 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-muted/20 shadow-inner select-none corner-squircle supports-[corner-shape:squircle]:rounded-3xl supports-[corner-shape:squircle]:corner-squircle sm:w-85">
			<div className="relative flex w-full flex-col gap-1 p-4">
				{TOP_FOLDERS.map((folder, i) => (
					<div
						key={i}
						className={cn(
							"flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground",
							folder.opacity,
						)}
					>
						<CustomFolderIcon className="h-5 w-5" />
						<span className="text-sm font-medium">{folder.name}</span>
					</div>
				))}

				{/* Row 2: My Apps (Drop Target) */}
				<div
					className={cn(
						"relative flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-foreground transition-all duration-500",
						!prefersReducedMotion && (isDragging || isDropped)
							? "border-primary/50 bg-primary/10"
							: "",
					)}
				>
					<CustomFolderIcon className="h-5 w-5" />
					<span className="text-sm font-medium">My Apps</span>

					{/* Glow when hovered */}
					<div
						className={cn(
							"absolute inset-0 rounded-lg ring-0 ring-primary/20 transition-all duration-500",
							!prefersReducedMotion && isDragging ? "ring-4" : "",
						)}
					/>
				</div>

				{/* Row 3 Container */}
				<div className="relative w-full">
					{/* Placeholder of dragged item */}
					{/* Disappears when dragged to make it look like it was picked up */}
					<div
						className={cn(
							"flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-all duration-500",
							prefersReducedMotion || isDragging || isDropped ? "opacity-0" : "",
						)}
					>
						<div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-white shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-xl">
							<img src="/favicon.svg" alt="" className="h-3/4 w-3/4 object-contain" />
						</div>
						<div className="flex flex-col gap-0.5 overflow-hidden">
							<span className="truncate text-sm font-medium text-foreground">
								Sulok — Your corner of the web
							</span>
							<span className="truncate font-mono text-[10px] text-muted-foreground">
								{`https://${APP_INFO.appUrl}`}
							</span>
						</div>
					</div>

					{/* The Floating Ghost */}
					<div
						className={cn(
							"pointer-events-none absolute inset-0 z-20 flex w-full items-center gap-3 rounded-xl border border-transparent bg-transparent px-3 py-2 opacity-0 shadow-none transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
							prefersReducedMotion
								? "-translate-y-1 scale-105 -rotate-2 border-border bg-background opacity-100 shadow-2xl"
								: isDragging
									? "-translate-y-11.5 scale-95 rotate-3 border-border bg-background opacity-100 shadow-2xl"
									: isDropped
										? "-translate-y-11.5 scale-90 rotate-0 opacity-0"
										: "",
						)}
					>
						<div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-white shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-xl">
							<img src="/favicon.svg" alt="" className="h-3/4 w-3/4 object-contain" />
						</div>
						<div className="flex flex-col gap-0.5 overflow-hidden">
							<span className="truncate text-sm font-medium text-foreground">
								Sulok — Your corner of the web
							</span>
							<span className="truncate font-mono text-[10px] text-muted-foreground">
								{`https://${APP_INFO.appUrl}`}
							</span>
						</div>

						{/* Simulated Cursor */}
						<div
							className={cn(
								"absolute right-0 -bottom-8 z-30 h-5 w-5 opacity-0 drop-shadow-md transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
								prefersReducedMotion
									? "right-6 -bottom-2 scale-100 opacity-100"
									: isDragging || isDropped
										? "right-8 -bottom-1 scale-95 opacity-100"
										: "",
							)}
						>
							<MousePointer2Icon className="h-full w-full fill-foreground text-foreground" />

							{/* Ripple effect on click (grab) */}
							<div
								className={cn(
									"absolute top-0 left-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40 opacity-0 transition-all duration-700",
									isDragging && !prefersReducedMotion && "animate-ping opacity-100",
								)}
							/>
						</div>
					</div>
				</div>

				<div
					className={cn(
						"relative z-10 flex w-full flex-col gap-1 transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
						!prefersReducedMotion && isDropped ? "-translate-y-11" : "translate-y-0",
					)}
				>
					{BOTTOM_LINKS.map((link, i) => (
						<div
							key={i}
							className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2", link.opacity)}
						>
							<div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted corner-squircle supports-[corner-shape:squircle]:rounded-xl">
								<GlobeIcon className="h-1/2 w-1/2 text-muted-foreground opacity-50" />
							</div>
							<div className="flex flex-col gap-0.5 overflow-hidden">
								<span className="truncate text-sm font-medium text-foreground">{link.name}</span>
								<span className="truncate font-mono text-[10px] text-muted-foreground">
									{link.url}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Bottom Centered Success Toast */}
			<div
				className={cn(
					"absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
					!prefersReducedMotion && isDropped
						? "translate-y-0 scale-100 opacity-100 delay-300"
						: "translate-y-4 scale-95 opacity-0",
				)}
			>
				<div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-green-600 shadow-lg">
					<CheckCircle2Icon className="h-3.5 w-3.5" />
					<span>Moved successfully</span>
				</div>
			</div>
		</div>
	);
}
