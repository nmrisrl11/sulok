import { FolderIcon, FolderLinkIcon, FollowFolderIcon, RecycleBinIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { folderIdParser, viewParser } from "@/lib/search-params";
import { PlusIcon } from "lucide-react";
import { useQueryState } from "nuqs";

export function FolderEmptyState() {
	const [view] = useQueryState("view", viewParser);
	const [folderId] = useQueryState("folder", folderIdParser);

	const isTrash = view === "trash";
	const isFavorites = view === "favorites";
	const isRoot = view === "all" && !folderId;

	let icon = <FolderIcon className="size-6" />;
	let title = "This folder is empty";
	let description = "Fill this folder with interesting links, articles, and ideas.";
	let ctaText = "Add to folder";

	if (isTrash) {
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
			"Your corner is waiting to be filled with interesting links, articles, and ideas from across the web.";
		ctaText = "Add to your corner";
	}

	return (
		<div className="flex w-full animate-in flex-col items-center justify-center rounded-xl border bg-card p-8 py-12 text-center shadow-sm duration-300 zoom-in-95 corner-squircle fade-in supports-[corner-shape:squircle]:rounded-2xl">
			<div className="mb-5 flex size-12 items-center justify-center rounded-full bg-muted/50">
				{icon}
			</div>

			<h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground">{title}</h3>
			<p className="mx-auto max-w-sm text-sm text-muted-foreground">{description}</p>

			<Button
				onClick={() => document.dispatchEvent(new CustomEvent("open-quick-link"))}
				className="mt-6 gap-2"
			>
				<PlusIcon className="size-4" />
				{ctaText}
			</Button>
		</div>
	);
}
