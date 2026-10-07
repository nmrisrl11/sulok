import { useIsTouchDevice } from "@/hooks";
import { cn } from "@/lib/utils";
import {
	MoreVerticalIcon,
	MousePointer2Icon,
	PuzzleIcon,
	StarIcon,
	UserCircleIcon,
} from "lucide-react";

export function QuickSavePopupMock() {
	const mobileSimulate = useIsTouchDevice();

	return (
		<div className="group relative flex h-60 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-muted/20 shadow-inner select-none corner-squircle supports-[corner-shape:squircle]:rounded-3xl supports-[corner-shape:squircle]:corner-squircle sm:w-85">
			{/* Browser Window Mock */}
			<div className="absolute inset-x-4 top-4 bottom-0 overflow-hidden rounded-t-xl border border-border/50 bg-background shadow-sm">
				{/* Browser Toolbar */}
				<div className="flex h-12 items-center justify-between border-b border-border/50 bg-muted/30 px-3">
					{/* Fake Address Bar */}
					<div className="flex h-7 w-16 items-center justify-end rounded-full bg-muted/50 px-2 sm:w-24">
						<StarIcon className="h-3.5 w-3.5 text-muted-foreground/50" />
					</div>

					{/* Extensions Area */}
					<div className="flex items-center gap-2.5">
						{/* Fake extensions */}
						<div className="h-5 w-5 rounded bg-blue-500/20" />
						<div className="h-5 w-5 rounded bg-purple-500/20" />

						{/* Sulok Extension Icon (Target) */}
						<div className="relative flex h-6 w-6 items-center justify-center rounded transition-colors group-hover:bg-muted/50 hover:bg-muted/50">
							<img src="/favicon.svg" alt="Sulok Extension" className="h-4 w-4" />
							{/* Cursor pointing at Sulok icon */}
							<div
								className={cn(
									"absolute z-20 h-5 w-5 drop-shadow-md transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
									"translate-x-8 translate-y-10 opacity-0",
									"group-hover:translate-x-3 group-hover:translate-y-3 group-hover:scale-95 group-hover:opacity-100",
									mobileSimulate && "translate-x-3 translate-y-3 opacity-100",
								)}
							>
								<MousePointer2Icon
									className="h-full w-full text-foreground"
									style={{ fill: "currentColor" }}
								/>
								<div
									className={cn(
										"absolute top-0 left-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40 opacity-0 transition-all duration-700",
										"group-hover:animate-ping group-hover:opacity-100",
										mobileSimulate && "hidden",
									)}
								/>
							</div>
						</div>

						<PuzzleIcon className="h-4 w-4 text-muted-foreground/50" />
						<div className="h-4 w-px bg-border/50" />
						<UserCircleIcon className="h-4 w-4 text-muted-foreground/50" />
						<MoreVerticalIcon className="h-4 w-4 text-muted-foreground/50" />
					</div>
				</div>

				{/* Fake Webpage Content */}
				<div className="flex flex-col gap-4 p-4 opacity-30">
					<div className="h-4 w-1/3 rounded bg-foreground/20" />
					<div className="flex flex-col gap-2">
						<div className="h-2 w-full rounded bg-foreground/10" />
						<div className="h-2 w-5/6 rounded bg-foreground/10" />
						<div className="h-2 w-4/6 rounded bg-foreground/10" />
					</div>
				</div>
			</div>
		</div>
	);
}
