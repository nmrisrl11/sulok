import { FolderIcon as CustomFolderIcon } from "@/components/icons";
import { useIsTouchDevice } from "@/hooks";
import { cn } from "@/lib/utils";
import { MousePointer2Icon, SearchIcon } from "lucide-react";

const MOCK_FOLDERS = [
	{ name: "Development", active: true },
	{ name: "Design Inspiration", active: false },
	{ name: "Personal Projects", active: false },
	{ name: "Travel Plans", active: false },
];

export function CommandPaletteMock() {
	const mobileSimulate = useIsTouchDevice();

	return (
		<div className="group relative flex h-72 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-muted/20 shadow-inner select-none corner-squircle supports-[corner-shape:squircle]:rounded-3xl supports-[corner-shape:squircle]:corner-squircle sm:w-85">
			{/* Mock Command Palette Container */}
			<div className="group-hover:shadow-3xl relative z-10 flex w-full max-w-65 flex-col overflow-hidden rounded-2xl border border-border bg-popover p-3 text-popover-foreground shadow-2xl transition-all duration-300 corner-squircle group-hover:border-primary/30 supports-[corner-shape:squircle]:rounded-3xl">
				{/* Search Input Area */}
				<div className="flex h-8 items-center gap-2 px-2 pb-1">
					<SearchIcon className="h-4 w-4 shrink-0 opacity-50" />
					<div className="relative flex-1">
						{/* Simulated typing cursor (before placeholder text) */}
						<div className="absolute top-1/2 left-0 h-3.5 w-px -translate-y-1/2 bg-foreground opacity-0 transition-opacity duration-300 group-hover:animate-pulse group-hover:opacity-100" />
						<div className="pl-1.5 text-[13px] text-muted-foreground md:text-[13px]">
							Search your corner...
						</div>
					</div>
				</div>

				{/* Results Area */}
				<div className="mb-0 flex flex-col rounded-xl bg-background pb-1 ring-1 ring-border corner-squircle supports-[corner-shape:squircle]:rounded-2xl">
					<div className="mt-0.5 px-3 py-1.5 text-[10px] font-medium text-muted-foreground">
						Folders
					</div>

					<div className="flex flex-col gap-0.5 px-1.5">
						{MOCK_FOLDERS.map((folder, i) => (
							<div
								key={i}
								className={cn(
									"flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors duration-300",
									folder.active ? "bg-muted text-foreground" : "text-popover-foreground",
									!folder.active && "group-hover:opacity-60",
								)}
							>
								<CustomFolderIcon className="h-3.5 w-3.5 shrink-0" />
								<span className="truncate text-[13px]">{folder.name}</span>
							</div>
						))}
					</div>

					<div className="mt-0.5 px-3 py-1.5 text-[10px] font-medium text-muted-foreground opacity-50">
						Links
					</div>
				</div>

				{/* Simulated Cursor */}
				<div
					className={cn(
						"absolute top-22.5 left-45 z-20 h-5 w-5 opacity-0 drop-shadow-md transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
						"group-hover:-translate-x-12 group-hover:scale-95 group-hover:opacity-100",
						mobileSimulate && "-translate-x-12 opacity-100",
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
		</div>
	);
}
