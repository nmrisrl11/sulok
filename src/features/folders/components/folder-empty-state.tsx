import {
	FolderIcon,
	FolderLinkIcon,
	FolderPlusCircleIcon,
	FollowFolderIcon,
	RecycleBinIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
	folderIdParser,
	searchQueryParser,
	typeFilterParser,
	viewParser,
} from "@/lib/search-params";
import { cn } from "@/lib/utils";
import { useFolderStore } from "@/stores";
import { PlusIcon, SearchIcon, XIcon } from "lucide-react";
import { useQueryState } from "nuqs";

export function FolderEmptyState({ animate = true }: { animate?: boolean }) {
	const [view] = useQueryState("view", viewParser);
	const [folderId] = useQueryState("folder", folderIdParser);
	const [searchQuery, setSearchQuery] = useQueryState("q", searchQueryParser);
	const [typeFilter, setTypeFilter] = useQueryState("type", typeFilterParser);
	const openCreateDialog = useFolderStore((state) => state.openCreateDialog);

	const isTrash = view === "trash";
	const isFavorites = view === "favorites";
	const isRoot = view === "all" && !folderId;
	const isFiltering = !!searchQuery || typeFilter !== "all";

	let icon = <FolderIcon className="size-6" />;
	let title = "This folder is empty";
	let description =
		"Fill this space with interesting links or create subfolders to stay organized.";
	let ctaText = "Add to corner";

	if (isFiltering) {
		icon = <SearchIcon className="size-6 text-muted-foreground" />;
		title = "Lost in your corner?";
		description = "We couldn't find anything matching your current search or filters.";
	} else if (isTrash) {
		icon = <RecycleBinIcon className="size-6 text-muted-foreground" />;
		title = "Recycle Bin is empty";
		description = "Items you delete will safely rest here.";
		ctaText = "Add to your corner";
	} else if (isFavorites) {
		icon = <FollowFolderIcon className="size-6 text-muted-foreground" />;
		title = "No favorites yet";
		description = "Mark your most used folders and links as favorites to quickly access them here.";
		ctaText = "Add to your corner";
	} else if (isRoot) {
		icon = <FolderLinkIcon className="size-6 text-muted-foreground" />;
		title = "It's quiet in here...";
		description =
			"Your corner is waiting to be filled with links, articles, and folders to organize your ideas.";
		ctaText = "Add to your corner";
	}

	return (
		<div
			className={cn(
				"flex w-full flex-col items-center justify-center rounded-xl border bg-card p-8 py-12 text-center shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-2xl",
				animate && "animate-in duration-300 zoom-in-95 fade-in",
			)}
		>
			<div className="mb-5 flex size-12 items-center justify-center rounded-full bg-muted/50">
				{icon}
			</div>

			<h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground">{title}</h3>
			<p className="mx-auto max-w-sm text-sm text-muted-foreground">{description}</p>

			{!isTrash && !isFavorites && !isFiltering && (
				<div className="mt-6 flex flex-wrap items-center justify-center gap-3">
					<Button variant="outline" onClick={() => openCreateDialog(folderId)} className="gap-2">
						<FolderPlusCircleIcon className="size-4" />
						New Folder
					</Button>
					<Button
						onClick={() =>
							document.dispatchEvent(new CustomEvent("open-quick-link", { detail: { folderId } }))
						}
						className="gap-2"
					>
						<PlusIcon className="size-4" />
						{ctaText}
					</Button>
				</div>
			)}

			{isFiltering && (
				<div className="mt-6 flex justify-center">
					<Button
						variant="outline"
						onClick={() => {
							setSearchQuery(null);
							setTypeFilter("all");
						}}
						className="gap-2"
					>
						<XIcon className="size-4 text-muted-foreground" />
						Clear filters
					</Button>
				</div>
			)}
		</div>
	);
}
