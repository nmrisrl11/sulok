import { FolderIcon as CustomFolderIcon, NoteIcon } from "@/components/icons";
import { APP_INFO } from "@/constants/app-info";
import { useIsTouchDevice } from "@/hooks";
import { cn } from "@/lib/utils";
import { GlobeIcon, MousePointer2Icon } from "lucide-react";

const TOP_FOLDERS = [
	{ name: "Archived Projects", opacity: "opacity-15" },
	{ name: "Design System", opacity: "opacity-30" },
	{ name: "Bookmarks", opacity: "opacity-60" },
];

const BOTTOM_LINKS = [
	{ name: "Developer Docs", url: "https://docs.example.com", opacity: "opacity-60" },
	{ name: "Analytics Dashboard", url: "https://stats.example.com", opacity: "opacity-30" },
	{ name: "Server Logs", url: "https://logs.example.com", opacity: "opacity-15" },
];

export function PersonalNotesMock() {
	const mobileSimulate = useIsTouchDevice();

	return (
		<div className="group relative flex h-72 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-muted/20 shadow-inner select-none corner-squircle supports-[corner-shape:squircle]:rounded-3xl supports-[corner-shape:squircle]:corner-squircle sm:w-85">
			<div className="relative z-10 flex w-full max-w-70 flex-col gap-1 p-4">
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

				{/* Active Item with Note */}
				<div className="relative flex items-center justify-between rounded-xl border border-border/50 bg-background px-3 py-3 shadow-sm transition-all duration-300 corner-squircle group-hover:border-primary/30 group-hover:shadow-md supports-[corner-shape:squircle]:rounded-2xl">
					<div className="flex items-center gap-3 overflow-hidden">
						<div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-white shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-xl">
							<img src="/favicon.svg" alt="" className="h-3/4 w-3/4 object-contain" />
						</div>
						<div className="flex flex-col gap-0.5 overflow-hidden">
							<span className="truncate text-sm leading-none font-medium text-foreground">
								{APP_INFO.name} — Your corner of the web
							</span>
							<div className="flex items-center gap-2">
								<span className="truncate font-mono text-[10px] tracking-tight text-muted-foreground">
									{`https://${APP_INFO.appUrl}`}
								</span>

								{/* The Squircle Note Indicator */}
								<div
									className={cn(
										"relative flex shrink-0 cursor-pointer items-center gap-1 rounded-sm border border-border/50 bg-secondary/80 px-1.5 py-0.5 text-secondary-foreground transition-colors duration-300 corner-squircle supports-[corner-shape:squircle]:rounded-full",
										"group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary",
										mobileSimulate && "border-primary/30 bg-primary/10 text-primary",
									)}
								>
									<NoteIcon className="size-2.5" />
									<span className="text-[9px] leading-none font-medium tracking-widest uppercase opacity-80">
										Note
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Simulated Cursor - Adjust pointer position closer to Note badge */}
					<div
						className={cn(
							"absolute top-1/2 left-1/2 z-20 h-5 w-5 translate-x-4 translate-y-10 opacity-0 drop-shadow-md transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
							"group-hover:translate-x-18 group-hover:translate-y-2.5 group-hover:scale-95 group-hover:opacity-100",
							mobileSimulate && "translate-x-18 translate-y-2.5 opacity-100",
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
		</div>
	);
}
