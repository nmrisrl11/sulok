import {
	FolderIcon as CustomFolderIcon,
	CustomHeartFilledIcon,
	CustomHeartIcon,
} from "@/components/icons";
import { APP_INFO } from "@/constants/app-info";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "framer-motion";
import { CheckCircle2Icon, GlobeIcon, MousePointer2Icon } from "lucide-react";
import { useEffect, useState } from "react";

const TOP_FOLDERS = [
	{ name: "Research", opacity: "opacity-30" },
	{ name: "Inspiration", opacity: "opacity-60" },
];

const BOTTOM_LINKS = [
	{ name: "React Patterns", url: "https://patterns.example.com", opacity: "opacity-50" },
	{ name: "Inspiration Board", url: "https://inspo.example.com", opacity: "opacity-20" },
];

export function FavoritesMock() {
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

				setStep(1); // Moving to heart
				await new Promise((r) => setTimeout(r, 800));
				if (!isMounted) break;

				setStep(2); // Click (ping and heart turns red)
				await new Promise((r) => setTimeout(r, 400));
				if (!isMounted) break;

				setStep(3); // Success message
				await new Promise((r) => setTimeout(r, 1800));
			}
		};
		runLoop();
		return () => {
			isMounted = false;
		};
	}, [prefersReducedMotion]);

	const isHovering = prefersReducedMotion || step >= 1;
	const isFavorited = !prefersReducedMotion && (step === 2 || step === 3);
	const showPing = !prefersReducedMotion && step === 2;
	const showSuccess = !prefersReducedMotion && step === 3;

	return (
		<div className="relative flex h-72 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-muted/20 shadow-inner select-none corner-squircle supports-[corner-shape:squircle]:rounded-3xl supports-[corner-shape:squircle]:corner-squircle sm:w-85">
			<div className="relative z-10 flex w-full flex-col gap-1 p-4">
				{TOP_FOLDERS.map((folder, i) => (
					<div
						key={i}
						className={cn(
							"flex w-full items-center justify-between rounded-lg px-3 py-2 text-muted-foreground",
							folder.opacity,
						)}
					>
						<div className="flex items-center gap-3">
							<CustomFolderIcon className="h-5 w-5" />
							<span className="text-sm font-medium">{folder.name}</span>
						</div>
					</div>
				))}

				<div className="flex items-center justify-between rounded-xl border border-transparent bg-background/40 px-3 py-3 transition-colors corner-squircle hover:bg-muted/50 supports-[corner-shape:squircle]:rounded-2xl">
					<div className="flex items-center gap-3">
						<CustomFolderIcon className="h-5 w-5" />
						<span className="text-sm font-medium text-foreground">Design System</span>
					</div>
					<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500">
						<CustomHeartFilledIcon className="h-4 w-4" />
					</div>
				</div>

				{/* To-be-favorited Link */}
				<div
					className={cn(
						"relative flex items-center justify-between rounded-xl border bg-background px-3 py-3 shadow-sm transition-all duration-300 corner-squircle supports-[corner-shape:squircle]:rounded-2xl",
						isFavorited ? "border-primary/30 shadow-md" : "border-border/50",
					)}
				>
					<div className="flex items-center gap-3 overflow-hidden">
						<div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-white shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-xl">
							<img src="/favicon.svg" alt="" className="h-3/4 w-3/4 object-contain" />
						</div>
						<div className="flex flex-col gap-0.5 overflow-hidden">
							<span className="truncate text-sm leading-none font-medium text-foreground">
								{APP_INFO.name} — Your corner of the web
							</span>
							<span className="truncate font-mono text-[10px] tracking-tight text-muted-foreground">{`https://${APP_INFO.appUrl}`}</span>
						</div>
					</div>

					{/* Heart Button */}
					<div
						className={cn(
							"relative ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-300",
							isFavorited
								? "bg-rose-500/10 text-rose-500"
								: isHovering
									? "bg-muted text-foreground"
									: "",
						)}
					>
						<CustomHeartIcon
							className={cn(
								"h-4 w-4 transition-all duration-300",
								isFavorited ? "scale-0 opacity-0" : "scale-100 opacity-100",
							)}
						/>
						<CustomHeartFilledIcon
							className={cn(
								"absolute h-4 w-4 transition-all duration-300",
								isFavorited ? "scale-100 opacity-100" : "scale-0 opacity-0",
							)}
						/>
					</div>

					{/* Simulated Cursor - Moved to bottom right corner of the heart icon */}
					<div
						className={cn(
							"absolute top-1/2 right-1.5 z-20 h-5 w-5 drop-shadow-md transition-all ease-[cubic-bezier(0.2,0.8,0.2,1)]",
							isHovering
								? "translate-x-1.5 translate-y-1.5 scale-95 opacity-100"
								: "translate-y-8 opacity-0",
							prefersReducedMotion ? "delay-0 duration-0" : "duration-700",
						)}
					>
						<MousePointer2Icon className="h-full w-full fill-foreground text-foreground" />
						<div
							key={step} // Force re-mount of ping
							className={cn(
								"absolute top-0 left-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/40",
								showPing && !prefersReducedMotion ? "animate-ping opacity-100" : "opacity-0",
							)}
							style={
								showPing && !prefersReducedMotion
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

				{BOTTOM_LINKS.map((link, i) => (
					<div
						key={i}
						className={cn(
							"flex w-full items-center justify-between rounded-lg px-3 py-2 text-muted-foreground",
							link.opacity,
						)}
					>
						<div className="flex items-center gap-3 overflow-hidden">
							<div className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border/50 bg-muted shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-lg">
								<GlobeIcon className="h-3 w-3" />
							</div>
							<div className="flex flex-col gap-0.5 overflow-hidden">
								<span className="truncate text-sm leading-none font-medium">{link.name}</span>
								<span className="truncate font-mono text-[10px] tracking-tight">{link.url}</span>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Bottom Centered Success Toast */}
			<div
				className={cn(
					"absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
					showSuccess && !prefersReducedMotion
						? "translate-y-0 scale-100 opacity-100 delay-300"
						: "translate-y-4 scale-95 opacity-0",
				)}
			>
				<div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-green-600 shadow-lg">
					<CheckCircle2Icon className="h-3.5 w-3.5" />
					<span>Added to Favorites</span>
				</div>
			</div>
		</div>
	);
}
