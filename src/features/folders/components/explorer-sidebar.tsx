import { FolderLinkIcon, FollowFolderIcon, RecycleBinIcon } from "@/components/icons";
import { folderIdParser, searchQueryParser, viewParser } from "@/lib/search-params";
import { cn } from "@/lib/utils";
import { useQueryState } from "nuqs";

export function ExplorerSidebar() {
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

	const navItems = [
		{
			id: "all",
			label: "Library",
			icon: FolderLinkIcon,
			isActive: view === "all" && folderId === "",
			onClick: () => handleNavigate("all"),
		},
		{
			id: "favorites",
			label: "Favorites",
			icon: FollowFolderIcon,
			isActive: view === "favorites",
			onClick: () => handleNavigate("favorites"),
		},
		{
			id: "trash",
			label: "Recycle Bin",
			icon: RecycleBinIcon,
			isActive: view === "trash",
			onClick: () => handleNavigate("trash"),
		},
	];

	return (
		<nav className="flex w-full flex-row gap-1 md:flex-col md:gap-1.5">
			{navItems.map((item) => {
				const Icon = item.icon;
				return (
					<button
						key={item.id}
						type="button"
						className={cn(
							"group flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-md p-2 text-center transition-all corner-squircle focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none supports-[corner-shape:squircle]:rounded-xl md:flex-row md:justify-start md:gap-3 md:px-3 md:py-2 md:text-left",
							item.isActive
								? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
								: "text-muted-foreground hover:bg-card hover:text-foreground hover:shadow-sm",
						)}
						onClick={item.onClick}
					>
						<Icon
							className={cn(
								"size-5 shrink-0 transition-colors md:size-4",
								item.isActive
									? "text-primary"
									: "text-muted-foreground/80 group-hover:text-foreground",
							)}
						/>
						<span
							className={cn(
								"text-[10px] transition-colors md:text-sm",
								item.isActive ? "font-semibold text-primary" : "font-medium text-foreground/80",
							)}
						>
							{item.label}
						</span>
					</button>
				);
			})}
		</nav>
	);
}
