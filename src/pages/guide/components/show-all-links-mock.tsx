import { useIsTouchDevice } from "@/hooks";
import { cn } from "@/lib/utils";
import { CombineIcon, FolderTreeIcon, GlobeIcon, ListIcon, MousePointer2Icon } from "lucide-react";

const MOCK_LINKS = [
	{ name: "Design System", url: "https://design.example.com" },
	{ name: "React Patterns", url: "https://patterns.example.com" },
	{ name: "Inspiration Board", url: "https://inspo.example.com" },
];

export function ShowAllLinksMock() {
	const mobileSimulate = useIsTouchDevice();

	return (
		<div className="group relative flex h-72 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-muted/20 shadow-inner select-none corner-squircle supports-[corner-shape:squircle]:rounded-3xl supports-[corner-shape:squircle]:corner-squircle sm:w-85">
			<div className="relative z-10 flex w-full max-w-72 flex-col gap-3 rounded-xl border border-border bg-background p-3 shadow-2xl corner-squircle supports-[corner-shape:squircle]:rounded-2xl">
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
									"group-hover:bg-foreground group-hover:text-background group-hover:shadow-engraved",
									mobileSimulate && "bg-foreground text-background shadow-engraved",
								)}
							>
								<FolderTreeIcon className="h-3.5 w-3.5" />
							</div>

							{/* Simulated Cursor */}
							<div
								className={cn(
									"absolute top-1/2 left-1/2 z-20 h-5 w-5 translate-x-4 translate-y-6 opacity-0 drop-shadow-md transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
									"group-hover:translate-x-0 group-hover:translate-y-1 group-hover:scale-95 group-hover:opacity-100",
									mobileSimulate && "translate-x-0 translate-y-1 opacity-100",
								)}
							>
								<MousePointer2Icon className="h-full w-full fill-foreground text-foreground" />
								<div
									className={cn(
										"absolute top-0 left-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40 opacity-0 transition-all duration-700",
										"group-hover:animate-ping group-hover:opacity-100",
									)}
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
						128 items
					</div>

					{MOCK_LINKS.map((link, i) => (
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
