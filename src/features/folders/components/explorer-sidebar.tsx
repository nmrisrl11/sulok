import { cn } from "@/lib/utils";
import { FolderIcon, StarIcon, TrashIcon } from "lucide-react";
import { parseAsString, parseAsStringEnum, useQueryState } from "nuqs";

export function ExplorerSidebar() {
	const [view, setView] = useQueryState(
		"view",
		parseAsStringEnum(["all", "favorites", "trash"]).withDefault("all"),
	);
	const [folderId, setFolderId] = useQueryState("folder", parseAsString.withDefault(""));
	const [searchQuery, setSearchQuery] = useQueryState("q", parseAsString.withDefault(""));

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
			label: "My Corner",
			icon: FolderIcon,
			isActive: view === "all" && folderId === "",
			onClick: () => handleNavigate("all"),
		},
		{
			id: "favorites",
			label: "Favorites",
			icon: StarIcon,
			isActive: view === "favorites",
			onClick: () => handleNavigate("favorites"),
		},
		{
			id: "trash",
			label: "Recycle Bin",
			icon: TrashIcon,
			isActive: view === "trash",
			onClick: () => handleNavigate("trash"),
		},
	];

	return (
		<div className="flex w-full flex-col gap-1">
			{navItems.map((item) => {
				const Icon = item.icon;
				return (
					<button
						key={item.id}
						type="button"
						className={cn(
							"flex w-full cursor-pointer items-center gap-3 rounded-md border border-transparent px-3 py-2 text-left transition-colors hover:bg-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
							item.isActive && "border-primary/20 bg-card",
						)}
						onClick={item.onClick}
					>
						<Icon
							className={cn(
								"size-4 shrink-0 text-muted-foreground",
								item.isActive && "text-primary",
							)}
						/>
						<span
							className={cn(
								"text-sm font-medium text-foreground/90",
								item.isActive && "font-semibold text-foreground",
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
