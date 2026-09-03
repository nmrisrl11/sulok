import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookmarkRepository } from "@/db/repositories/bookmark-repository";
import { LinkCard } from "@/features/links/components/link-card";
import { cn } from "@/lib/utils";
import { useBookmarkStore } from "@/stores/bookmark-store";
import { useLiveQuery } from "dexie-react-hooks";
import { AlertCircle, PlusIcon } from "lucide-react";
import React from "react";

class ErrorBoundary extends React.Component<
	{ children: React.ReactNode },
	{ hasError: boolean; error: Error | null }
> {
	constructor(props: { children: React.ReactNode }) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error) {
		return { hasError: true, error };
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="py-8 text-center text-destructive border-dashed border-2 border-destructive/50 rounded-md flex flex-col items-center gap-2">
					<AlertCircle className="h-8 w-8 mb-2 opacity-80" />
					<p className="font-medium">Failed to load bookmarks</p>
					<p className="text-sm opacity-80">{this.state.error?.message}</p>
				</div>
			);
		}
		return this.props.children;
	}
}

function MainContentInner() {
	const bookmarks = useLiveQuery(() => BookmarkRepository.queryAllSorted());

	if (bookmarks === undefined) {
		return (
			<div className="flex flex-col gap-2">
				<Skeleton className="h-12 w-full rounded-md" />
				<Skeleton className="h-12 w-full rounded-md" />
				<Skeleton className="h-12 w-full rounded-md" />
			</div>
		);
	}

	if (bookmarks.length === 0) {
		return (
			<div className="py-8 text-center text-muted-foreground border-dashed border-2 border-border rounded-md">
				No saved links yet. Add a bookmark to get started.
			</div>
		);
	}

	return (
		<>
			{bookmarks.map((bookmark) => (
				<LinkCard key={bookmark.id} bookmark={bookmark} />
			))}
		</>
	);
}

export function MainContent({ className }: { className?: string }) {
	const { openCreateDialog } = useBookmarkStore();

	return (
		<main className={cn("flex flex-col gap-10", className)}>
			{/* Action Buttons */}
			<div className="flex items-center gap-3">
				<Button onClick={openCreateDialog} className="gap-2">
					<PlusIcon className="h-4 w-4" />
					Add Bookmark
				</Button>
				<Button variant="outline" disabled title="Coming soon">
					Import (Coming soon)
				</Button>
				<Button variant="outline" disabled title="Coming soon">
					Export (Coming soon)
				</Button>
			</div>

			{/* Link List Section */}
			<div className="flex flex-col gap-4">
				<h2 className="text-foreground font-sans text-2xl font-bold tracking-tight">Saved Links</h2>

				<div className="flex flex-col gap-2">
					<ErrorBoundary>
						<MainContentInner />
					</ErrorBoundary>
				</div>
			</div>
		</main>
	);
}
