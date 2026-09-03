import { SiteFavicon } from "@/components/site-favicon";
import { Button } from "@/components/ui/button";
import type { Bookmark } from "@/db/db";
import { useBookmarkStore } from "@/stores/bookmark-store";
import { useConfirmationStore } from "@/stores/confirmation-store";
import { CopyIcon, Edit2Icon, ExternalLinkIcon, Trash2Icon } from "lucide-react";

export function LinkCard({ bookmark }: { bookmark: Bookmark }) {
	const { deleteBookmark, openEditDialog } = useBookmarkStore();
	const confirm = useConfirmationStore((state) => state.confirm);

	const titleToDisplay = bookmark.title || bookmark.url;

	const handleDelete = () => {
		confirm({
			title: "Delete Bookmark",
			description: "Are you sure you want to delete this bookmark? This action cannot be undone.",
			confirmText: "Delete",
			onConfirm: async () => {
				await deleteBookmark(bookmark.id);
			},
		});
	};

	return (
		<div className="group hover:bg-card/50 flex items-center justify-between gap-3 rounded-md px-2 py-2 transition-colors">
			<div className="flex items-center gap-3 min-w-0">
				<SiteFavicon url={bookmark.url} className="h-6 w-6 shrink-0" />
				<div className="flex flex-col overflow-hidden">
					<span className="text-foreground truncate text-sm font-medium">{titleToDisplay}</span>
					{bookmark.title && bookmark.title !== bookmark.url && (
						<span className="text-muted-foreground truncate text-xs">{bookmark.url}</span>
					)}
				</div>
			</div>

			<div className="flex items-center opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 shrink-0">
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8"
					title="Copy URL"
					onClick={() => navigator.clipboard.writeText(bookmark.url)}
				>
					<CopyIcon className="text-muted-foreground h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8"
					title="Open Link"
					onClick={() => window.open(bookmark.url, "_blank", "noopener")}
				>
					<ExternalLinkIcon className="text-muted-foreground h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8"
					title="Edit"
					onClick={() => openEditDialog(bookmark)}
				>
					<Edit2Icon className="text-muted-foreground h-4 w-4" />
				</Button>

				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 hover:text-destructive"
					title="Delete"
					onClick={handleDelete}
				>
					<Trash2Icon className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
