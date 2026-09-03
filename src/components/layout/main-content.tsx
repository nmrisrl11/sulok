import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookmarkRepository } from "@/db/repositories/bookmark-repository";
import { LinkCard } from "@/features/links/components/link-card";
import { cn } from "@/lib/utils";
import { useBookmarkStore } from "@/stores/bookmark-store";
import { useLiveQuery } from "dexie-react-hooks";
import { PlusIcon } from "lucide-react";

export function MainContent({ className }: { className?: string }) {
	const bookmarks = useLiveQuery(() => BookmarkRepository.queryAllSorted());
	const { openCreateDialog } = useBookmarkStore();

	return (
		<main className={cn("flex flex-col gap-10", className)}>
			{/* Action Buttons */}
			<div className="flex items-center gap-3">
				<Button onClick={openCreateDialog} className="gap-2">
					<PlusIcon className="h-4 w-4" />
					Add Bookmark
				</Button>
				<Button variant="outline">Import</Button>
				<Button variant="outline">Export</Button>
			</div>

			{/* Link List Section */}
			<div className="flex flex-col gap-4">
				<h2 className="text-foreground font-sans text-2xl font-bold tracking-tight">Saved Links</h2>

				<div className="flex flex-col gap-2">
					{bookmarks === undefined ? (
						// Loading state
						<div className="flex flex-col gap-2">
							<Skeleton className="h-12 w-full rounded-md" />
							<Skeleton className="h-12 w-full rounded-md" />
							<Skeleton className="h-12 w-full rounded-md" />
						</div>
					) : bookmarks.length === 0 ? (
						// Empty state
						<div className="py-8 text-center text-muted-foreground border-dashed border-2 border-border rounded-md">
							No saved links yet. Add a bookmark to get started.
						</div>
					) : (
						// Render bookmarks
						bookmarks.map((bookmark) => <LinkCard key={bookmark.id} bookmark={bookmark} />)
					)}
				</div>
			</div>
		</main>
	);
}
