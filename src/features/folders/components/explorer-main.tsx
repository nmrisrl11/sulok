import { type Folder, type Item } from "@/db/db";
import { ItemCard } from "@/features/items/components/item-card";
import { ItemCardSkeleton } from "@/features/items/components/item-card-skeleton";
import { ItemGridCard } from "@/features/items/components/item-grid-card";
import { ItemGridCardSkeleton } from "@/features/items/components/item-grid-card-skeleton";
import { viewModeParser } from "@/lib/search-params";
import { getHasDataHint } from "@/lib/storage";
import { useQueryState } from "nuqs";
import { FolderCard } from "./folder-card";
import { FolderCardSkeleton } from "./folder-card-skeleton";
import { FolderEmptyState } from "./folder-empty-state";
import { FolderGridCard } from "./folder-grid-card";
import { FolderGridCardSkeleton } from "./folder-grid-card-skeleton";

export function ExplorerMainSkeleton() {
	const [viewMode] = useQueryState("mode", viewModeParser);

	if (viewMode === "grid") {
		return (
			<div role="alert" aria-label="Loading items" className="contents">
				<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
					<FolderGridCardSkeleton />
					<FolderGridCardSkeleton />
					<ItemGridCardSkeleton />
					<ItemGridCardSkeleton />
					<ItemGridCardSkeleton />
					<ItemGridCardSkeleton />
				</div>
			</div>
		);
	}

	return (
		<div role="alert" aria-label="Loading items" className="contents">
			<div className="flex flex-col gap-2">
				<FolderCardSkeleton />
				<FolderCardSkeleton />
				<div className="my-4 border-b border-border/50" />
				<ItemCardSkeleton />
				<ItemCardSkeleton />
				<ItemCardSkeleton />
			</div>
		</div>
	);
}

export function ExplorerMain({
	folders,
	items,
	isLoading,
}: {
	folders: Folder[];
	items: Item[];
	isLoading: boolean;
}) {
	const [viewMode] = useQueryState("mode", viewModeParser);

	if (isLoading) {
		const hasDataHint = getHasDataHint();

		// If we know there's no data (or undefined for a new user), skip the skeleton
		// and immediately show the empty state to prevent UI flicker.
		if (!hasDataHint) {
			return <FolderEmptyState animate={false} />;
		}
		return <ExplorerMainSkeleton />;
	}

	const isEmpty = folders.length === 0 && items.length === 0;

	if (isEmpty) {
		return <FolderEmptyState animate={false} />;
	}

	if (viewMode === "grid") {
		return (
			<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
				{folders.map((folder) => (
					<FolderGridCard key={folder.id} folder={folder} />
				))}
				{items.map((item) => (
					<ItemGridCard key={item.id} item={item} />
				))}
			</div>
		);
	}

	// Default List View
	return (
		<div className="flex flex-col gap-2">
			{folders.map((folder) => (
				<FolderCard key={folder.id} folder={folder} />
			))}

			{folders.length > 0 && items.length > 0 && <div className="my-4 border-b border-border/50" />}

			{items.map((item) => (
				<ItemCard key={item.id} item={item} />
			))}
		</div>
	);
}
