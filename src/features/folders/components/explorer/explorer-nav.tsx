import { FolderLinkIcon, FollowFolderIcon, RecycleBinIcon } from "@/components/icons";
import { folderIdParser, searchQueryParser, viewParser } from "@/lib/search-params";
import { cn } from "@/lib/utils";
import { useQueryState } from "nuqs";
import { memo } from "react";

const NAV_ITEMS = [
	{
		id: "all" as const,
		label: "Library",
		icon: FolderLinkIcon,
	},
	{
		id: "favorites" as const,
		label: "Favorites",
		icon: FollowFolderIcon,
	},
	{
		id: "trash" as const,
		label: "Recycle Bin",
		icon: RecycleBinIcon,
	},
];

export const ExplorerNav = memo(function ExplorerNav() {
	const [view, setView] = useQueryState("view", viewParser);
	const [folderId, setFolderId] = useQueryState("folder", folderIdParser);
	const [searchQuery, setSearchQuery] = useQueryState("q", searchQueryParser);

	const handleNavigate = (newView: "all" | "favorites" | "trash") => {
		setView(newView);
		setFolderId(""); // Reset folder navigation when changing root views
		if (newView === "trash" && searchQuery) {
			setSearchQuery(""); // Clear search filter when entering Recycle Bin
		}
	};

	return (
		<nav
			id="explorer-nav"
			className="flex w-full flex-row gap-1 overflow-x-auto rounded-lg border border-border/40 bg-muted/30 p-1 shadow-sm backdrop-blur-md supports-[corner-shape:squircle]:rounded-2xl supports-[corner-shape:squircle]:corner-squircle sm:w-auto sm:flex-wrap sm:overflow-visible"
		>
			{NAV_ITEMS.map((item) => {
				const Icon = item.icon;
				const isActive = item.id === "all" ? view === "all" && folderId === "" : view === item.id;

				return (
					<button
						key={item.id}
						type="button"
						className={cn(
							"group flex flex-1 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-1.5 text-center transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none supports-[corner-shape:squircle]:rounded-xl supports-[corner-shape:squircle]:corner-squircle sm:flex-none",
							isActive
								? "bg-background text-foreground shadow-engraved"
								: "text-muted-foreground hover:bg-background/50 hover:text-foreground",
						)}
						onClick={() => handleNavigate(item.id)}
					>
						<Icon
							className={cn(
								"size-4 shrink-0 transition-colors",
								isActive ? "text-primary" : "text-muted-foreground/80 group-hover:text-foreground",
							)}
						/>
						<span
							className={cn(
								"text-xs font-medium transition-colors sm:text-sm",
								isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
							)}
						>
							{item.label}
						</span>
					</button>
				);
			})}
		</nav>
	);
});
