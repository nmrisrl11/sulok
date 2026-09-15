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
		<div className="flex w-full flex-col gap-1.5">
			{navItems.map((item) => {
				const Icon = item.icon;
				return (
					<button
						key={item.id}
						type="button"
						className={cn(
							"group flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left transition-all corner-squircle focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none supports-[corner-shape:squircle]:rounded-xl",
							item.isActive
								? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
								: "text-muted-foreground hover:bg-card hover:text-foreground hover:shadow-sm",
						)}
						onClick={item.onClick}
					>
						<Icon
							className={cn(
								"size-4 shrink-0 transition-colors",
								item.isActive
									? "text-primary"
									: "text-muted-foreground/80 group-hover:text-foreground",
							)}
						/>
						<span
							className={cn(
								"text-sm transition-colors",
								item.isActive ? "font-semibold text-primary" : "font-medium text-foreground/80",
							)}
						>
							{item.label}
						</span>
					</button>
				);
			})}
		</div>
	);
}
