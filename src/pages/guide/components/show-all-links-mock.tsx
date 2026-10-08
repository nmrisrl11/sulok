import { FolderIcon as CustomFolderIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "framer-motion";
import { CombineIcon, FolderTreeIcon, GlobeIcon, ListIcon, MousePointer2Icon } from "lucide-react";
import { useEffect, useState } from "react";

const MOCK_FOLDERS = [{ name: "Development" }];

const MOCK_LINKS = [
	{ name: "Design System", url: "https://design.example.com" },
	{ name: "React Patterns", url: "https://patterns.example.com" },
	{ name: "Inspiration Board", url: "https://inspo.example.com" },
];

export function ShowAllLinksMock() {
	const prefersReducedMotion = useReducedMotion() === true;
	const [step, setStep] = useState(0);

	useEffect(() => {
		if (prefersReducedMotion) return;
		let isMounted = true;
		const runLoop = async () => {
			while (isMounted) {
				setStep(0); // Idle
				await new Promise((r) => setTimeout(r, 1500));
				if (!isMounted) break;

				setStep(1); // Moving to button
				await new Promise((r) => setTimeout(r, 800));
				if (!isMounted) break;

				setStep(2); // Click
				await new Promise((r) => setTimeout(r, 400));
				if (!isMounted) break;

				setStep(3); // Flattened view
				await new Promise((r) => setTimeout(r, 2000));
			}
		};
		runLoop();
		return () => {
			isMounted = false;
		};
	}, [prefersReducedMotion]);

	const isHovering = prefersReducedMotion || step >= 1;
	const isFlattened = step === 3 || prefersReducedMotion;
	const showPing = !prefersReducedMotion && step === 2;

	const itemCountText = isFlattened ? "3 items" : "2 items";
	const displayedLinks = isFlattened ? MOCK_LINKS : MOCK_LINKS.slice(0, 1);

	return (
		<div className="relative flex h-72 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-muted/20 shadow-inner select-none corner-squircle supports-[corner-shape:squircle]:rounded-3xl supports-[corner-shape:squircle]:corner-squircle sm:w-85">
			<div className="relative z-10 flex w-full max-w-72 flex-col gap-3 rounded-xl border border-border bg-background p-3 shadow-xl shadow-black/5 corner-squircle supports-[corner-shape:squircle]:rounded-2xl dark:shadow-black/20">
				{/* Mock Toolbar */}
				<div className="flex items-center justify-between border-b border-border/50 pb-2">
					<div className="h-6 w-24 rounded-md bg-muted/50" />
					<div className="flex items-center gap-1 text-muted-foreground">
						<div className="flex h-6 w-6 items-center justify-center rounded-md">
							<CombineIcon className="h-3.5 w-3.5 opacity-50" />
						</div>

						{/* Target Toggle Button */}
						<div className="relative">
							<div
								className={cn(
									"flex h-6 w-6 items-center justify-center rounded-md transition-colors duration-300",
									isFlattened ? "bg-foreground text-background shadow-engraved" : "",
								)}
							>
								<FolderTreeIcon className="h-3.5 w-3.5" />
							</div>

							{/* Simulated Cursor */}
							<div
								className={cn(
									"absolute top-1/2 left-1/2 z-20 h-5 w-5 drop-shadow-md transition-all ease-[cubic-bezier(0.2,0.8,0.2,1)]",
									isHovering
										? "translate-x-0 translate-y-1 scale-95 opacity-100"
										: "translate-x-4 translate-y-6 opacity-0",
									prefersReducedMotion ? "delay-0 duration-0" : "duration-700",
								)}
							>
								<MousePointer2Icon className="h-full w-full fill-foreground text-foreground" />
								<div
									key={step}
									className={cn(
										"absolute top-0 left-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40",
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

						<div className="ml-1 h-3 w-px bg-border/50" />
						<div className="flex h-6 w-6 items-center justify-center rounded-md">
							<ListIcon className="h-3.5 w-3.5 opacity-50" />
						</div>
					</div>
				</div>

				{/* Mock Flat Links List */}
				<div className="flex flex-col gap-1.5">
					<div className="px-1 text-[10px] font-medium text-muted-foreground opacity-70">
						{itemCountText}
					</div>

					{!isFlattened &&
						MOCK_FOLDERS.map((folder, i) => (
							<div key={`folder-${i}`} className="flex items-center gap-3 px-2.5 py-1.5">
								<div className="flex h-5 w-5 shrink-0 items-center justify-center">
									<CustomFolderIcon className="h-4 w-4 text-muted-foreground" />
								</div>
								<div className="flex flex-col overflow-hidden">
									<span className="truncate text-[13px] font-medium text-foreground">
										{folder.name}
									</span>
								</div>
							</div>
						))}

					{displayedLinks.map((link, i) => (
						<div
							key={i}
							className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/50 px-2.5 py-2 shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-xl"
						>
							<div className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border/50 bg-muted shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-lg">
								<GlobeIcon className="h-3 w-3 text-muted-foreground" />
							</div>
							<div className="flex flex-col overflow-hidden">
								<span className="truncate text-xs font-medium text-foreground">{link.name}</span>
								<span className="truncate font-mono text-[9px] text-muted-foreground">
									{link.url}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
