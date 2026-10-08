import { FolderIcon as CustomFolderIcon, TrashUndoIcon, TrashXMarkIcon } from "@/components/icons";
import { APP_INFO } from "@/constants/app-info";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "framer-motion";
import { CheckCircle2Icon, GlobeIcon, MousePointer2Icon } from "lucide-react";
import { useEffect, useState } from "react";

const TOP_FOLDERS = [
	{ name: "Archived Projects", daysLeft: "12 days left", opacity: "opacity-15" },
	{ name: "Design System", daysLeft: "3 days left", opacity: "opacity-30" },
	{ name: "Bookmarks", daysLeft: "28 days left", opacity: "opacity-60" },
];

const BOTTOM_LINKS = [
	{
		name: "Developer Docs",
		url: "https://docs.example.com",
		daysLeft: "30 days left",
		opacity: "opacity-60",
	},
	{
		name: "Analytics Dashboard",
		url: "https://stats.example.com",
		daysLeft: "29 days left",
		opacity: "opacity-30",
	},
	{
		name: "Server Logs",
		url: "https://logs.example.com",
		daysLeft: "1 day left",
		opacity: "opacity-15",
	},
];

export function SafetyNetMock() {
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

				setStep(1); // Hover item
				await new Promise((r) => setTimeout(r, 600));
				if (!isMounted) break;

				setStep(2); // Hover restore button
				await new Promise((r) => setTimeout(r, 600));
				if (!isMounted) break;

				setStep(3); // Click restore (Ping ON)
				await new Promise((r) => setTimeout(r, 500));
				if (!isMounted) break;

				setStep(4); // Wait restore (Ping OFF, item disappears, list moves up)
				await new Promise((r) => setTimeout(r, 2000));
				if (!isMounted) break;
			}
		};
		runLoop();
		return () => {
			isMounted = false;
		};
	}, [prefersReducedMotion]);

	const isHoveringItem = prefersReducedMotion || (step >= 1 && step < 4);
	const isHoveringRestore = prefersReducedMotion || (step >= 2 && step < 4);
	const showPing = !prefersReducedMotion && step === 3;
	const isRestored = !prefersReducedMotion && step >= 4;

	return (
		<div className="relative flex h-72 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-muted/20 shadow-inner select-none corner-squircle supports-[corner-shape:squircle]:rounded-3xl supports-[corner-shape:squircle]:corner-squircle sm:w-85">
			<div className="relative z-10 flex w-full flex-col gap-1 p-4">
				{/* Top Faded Folders */}
				{TOP_FOLDERS.map((folder, i) => (
					<div
						key={i}
						className={cn(
							"flex w-full items-center justify-between rounded-lg px-3 py-2 text-muted-foreground",
							folder.opacity,
						)}
					>
						<div className="flex items-center gap-3">
							<CustomFolderIcon className="h-5 w-5 shrink-0" />
							<div className="flex flex-col overflow-hidden">
								<span className="truncate text-sm font-medium">{folder.name}</span>
								<span className="font-mono text-[10px] tracking-tight text-muted-foreground">
									{folder.daysLeft}
								</span>
							</div>
						</div>
					</div>
				))}

				{/* Row Container to allow sliding bottom links over */}
				<div className="relative w-full">
					{/* Active Deleted Item */}
					<div
						className={cn(
							"relative flex items-center justify-between rounded-xl border px-3 py-3 transition-all duration-500 corner-squircle supports-[corner-shape:squircle]:rounded-2xl",
							isHoveringItem
								? "border-border/50 bg-background shadow-sm"
								: "border-transparent bg-transparent",
							isRestored ? "scale-95 opacity-0" : "scale-100 opacity-100",
						)}
					>
						<div className="flex min-w-0 flex-1 items-center gap-3">
							<div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-white shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-xl">
								<img src="/favicon.svg" alt="" className="h-3/4 w-3/4 object-contain" />
							</div>
							<div
								className={cn(
									"flex min-w-0 flex-col overflow-hidden transition-all duration-500",
									isHoveringItem ? "pr-18" : "pr-0",
								)}
							>
								<span className="truncate text-sm leading-none font-medium text-foreground">
									{APP_INFO.name} — Your corner of the web
								</span>
								<div className="mt-0.5 flex flex-col items-start overflow-hidden">
									<span className="truncate font-mono text-[11px] tracking-tight text-muted-foreground">
										{`https://${APP_INFO.appUrl}`}
									</span>
									<span className="mt-1 truncate font-mono text-[11px] tracking-tight text-muted-foreground">
										29 days left
									</span>
								</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="absolute top-1/2 right-3 flex shrink-0 -translate-y-1/2 items-center gap-1 sm:gap-2">
							<div
								className={cn(
									"flex h-9 items-center rounded-lg border bg-background p-0.5 opacity-0 transition-all duration-500 corner-squircle supports-[corner-shape:squircle]:rounded-xl",
									isHoveringItem && "opacity-100 shadow-sm",
								)}
							>
								<div
									className={cn(
										"flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors corner-squircle supports-[corner-shape:squircle]:rounded-full",
										isHoveringRestore ? "bg-muted text-foreground dark:bg-muted/50" : "",
									)}
								>
									<TrashUndoIcon className="h-4 w-4" />
								</div>
								<div className="mx-0.5 h-4 w-px bg-border/50" />
								<div className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors corner-squircle supports-[corner-shape:squircle]:rounded-full">
									<TrashXMarkIcon className="h-4 w-4" />
								</div>
							</div>
						</div>

						<div
							className={cn(
								"absolute z-20 h-5 w-5 drop-shadow-md transition-all ease-[cubic-bezier(0.2,0.8,0.2,1)]",
								prefersReducedMotion
									? "top-8.75 right-11.25 scale-100 opacity-100 delay-0 duration-0"
									: "duration-700",
								!prefersReducedMotion && step === 0 ? "top-17.5 right-25 scale-100 opacity-0" : "",
								!prefersReducedMotion && step === 1
									? "top-8.75 right-11.25 scale-100 opacity-100"
									: "",
								!prefersReducedMotion && step === 2
									? "top-8.75 right-11.25 scale-100 opacity-100"
									: "",
								!prefersReducedMotion && step === 3
									? "top-8.75 right-11.25 scale-95 opacity-100"
									: "",
								!prefersReducedMotion && step >= 4
									? "top-8.75 right-11.25 scale-100 opacity-0"
									: "",
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

				{/* Bottom Faded Links (Moves up when restored) */}
				<div
					className={cn(
						"relative z-10 flex w-full flex-col gap-1 transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
						!prefersReducedMotion && isRestored ? "-translate-y-21" : "translate-y-0",
					)}
				>
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
								<div className="flex flex-col overflow-hidden">
									<span className="truncate text-sm leading-none font-medium text-foreground">
										{link.name}
									</span>
									<div className="mt-0.5 flex flex-col items-start overflow-hidden">
										<span className="truncate font-mono text-[11px] tracking-tight text-muted-foreground">
											{link.url}
										</span>
										<span className="mt-1 truncate font-mono text-[11px] tracking-tight text-muted-foreground">
											{link.daysLeft}
										</span>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Bottom Centered Success Toast */}
			<div
				className={cn(
					"absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
					!prefersReducedMotion && isRestored
						? "translate-y-0 scale-100 opacity-100 delay-300"
						: "translate-y-4 scale-95 opacity-0",
				)}
			>
				<div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-green-600 shadow-lg dark:border dark:border-border">
					<CheckCircle2Icon className="h-3.5 w-3.5" />
					<span>Link restored</span>
				</div>
			</div>
		</div>
	);
}
