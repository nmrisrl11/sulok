import {
	FolderIcon as CustomFolderIcon,
	CustomHeartFilledIcon,
	CustomHeartIcon,
} from "@/components/icons";
import { APP_INFO } from "@/constants/app-info";
import { useIsTouchDevice } from "@/hooks";
import { cn } from "@/lib/utils";
import { GlobeIcon, MousePointer2Icon } from "lucide-react";

const TOP_FOLDERS = [
	{ name: "Research", opacity: "opacity-30" },
	{ name: "Inspiration", opacity: "opacity-60" },
];

const BOTTOM_LINKS = [
	{ name: "React Patterns", url: "https://patterns.example.com", opacity: "opacity-50" },
	{ name: "Inspiration Board", url: "https://inspo.example.com", opacity: "opacity-20" },
];

export function FavoritesMock() {
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
				<div className="relative flex items-center justify-between rounded-xl border border-border/50 bg-background px-3 py-3 shadow-sm transition-all duration-300 corner-squircle group-hover:border-primary/30 group-hover:shadow-md supports-[corner-shape:squircle]:rounded-2xl">
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
							"group-hover:bg-rose-500/10 group-hover:text-rose-500",
							mobileSimulate && "bg-rose-500/10 text-rose-500",
						)}
					>
						<CustomHeartIcon
							className={cn(
								"h-4 w-4 transition-all duration-300 group-hover:scale-0 group-hover:opacity-0",
								mobileSimulate && "scale-0 opacity-0",
							)}
						/>
						<CustomHeartFilledIcon
							className={cn(
								"absolute h-4 w-4 scale-0 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100",
								mobileSimulate && "scale-100 opacity-100",
							)}
						/>
					</div>

					{/* Simulated Cursor - Moved to bottom right corner of the heart icon */}
					<div
						className={cn(
							"absolute top-1/2 right-1.5 z-20 h-5 w-5 translate-y-8 opacity-0 drop-shadow-md transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
							"group-hover:translate-y-2 group-hover:scale-95 group-hover:opacity-100",
							mobileSimulate && "translate-y-2 opacity-100",
						)}
					>
						<MousePointer2Icon className="h-full w-full fill-foreground text-foreground" />
						<div
							className={cn(
								"absolute top-0 left-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/40 opacity-0 transition-all duration-700",
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
