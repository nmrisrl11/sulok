import { type Folder, type Item } from "@/db/db";
import { ItemCard } from "@/features/items/components/item-card";
import { ItemCardSkeleton } from "@/features/items/components/item-card-skeleton";
import { ItemGridCard } from "@/features/items/components/item-grid-card";
import { ItemGridCardSkeleton } from "@/features/items/components/item-grid-card-skeleton";
import { mixDataParser, sortOptionParser, viewModeParser } from "@/lib/search-params";
import { getHasDataHint } from "@/lib/storage";
import { useQueryState } from "nuqs";
import { memo, useMemo } from "react";
import { FolderCard } from "../folder/folder-card";
import { FolderCardSkeleton } from "../folder/folder-card-skeleton";
import { FolderEmptyState } from "../folder/folder-empty-state";
import { FolderGridCard } from "../folder/folder-grid-card";
import { FolderGridCardSkeleton } from "../folder/folder-grid-card-skeleton";

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
			<div id="explorer-main" className="flex flex-col gap-2">
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

export const ExplorerMain = memo(function ExplorerMain({
	folders,
	items,
	isLoading,
}: {
	folders: Folder[];
	items: Item[];
	isLoading: boolean;
}) {
	return <ExplorerMainContent folders={folders} items={items} isLoading={isLoading} />;
});

function ExplorerMainContent({
	folders,
	items,
	isLoading,
}: {
	folders: Folder[];
	items: Item[];
	isLoading: boolean;
}) {
	const [viewMode] = useQueryState("mode", viewModeParser);
	const [mixData] = useQueryState("mix", mixDataParser);
	const [sortOption] = useQueryState("sort", sortOptionParser);

	const mixedData = useMemo(() => {
		if (!mixData) return [];
		const mixed = [...folders, ...items] as (Folder | Item)[];

		mixed.sort((a, b) => {
			const isAFolder = !("url" in a);
			const isBFolder = !("url" in b);

			if (sortOption.startsWith("name")) {
				const nameA = (isAFolder ? (a as Folder).name : (a as Item).title || "").toLowerCase();
				const nameB = (isBFolder ? (b as Folder).name : (b as Item).title || "").toLowerCase();
				return sortOption === "name-asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
			}

			// default date
			return sortOption === "date-asc" ? a.createdAt - b.createdAt : b.createdAt - a.createdAt;
		});
		return mixed;
	}, [folders, items, mixData, sortOption]);

	if (isLoading) {
		const hasDataHint = getHasDataHint();

		// If we know there's no data (or undefined for a new user), skip the skeleton
		// and immediately show the empty state to prevent UI flicker.
		if (!hasDataHint) {
			return (
				<div id="explorer-main" className="flex h-full flex-col">
					<FolderEmptyState animate={false} />
				</div>
			);
		}
		return <ExplorerMainSkeleton />;
	}

	const isEmpty = folders.length === 0 && items.length === 0;

	if (isEmpty) {
		return (
			<div id="explorer-main" className="flex h-full flex-col">
				<FolderEmptyState animate={false} />
			</div>
		);
	}

	if (mixData) {
		if (viewMode === "grid") {
			return (
				<div id="explorer-main" className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
					{mixedData.map((entity) => {
						if (!("url" in entity)) {
							return <FolderGridCard key={entity.id} folder={entity as Folder} />;
						}
						return <ItemGridCard key={entity.id} item={entity as Item} />;
					})}
				</div>
			);
		}
		return (
			<div id="explorer-main" className="flex flex-col gap-2">
				{mixedData.map((entity) => {
					if (!("url" in entity)) {
						return <FolderCard key={entity.id} folder={entity as Folder} />;
					}
					return <ItemCard key={entity.id} item={entity as Item} />;
				})}
			</div>
		);
	}

	if (viewMode === "grid") {
		return (
			<div id="explorer-main" className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
				{folders.map((folder) => (
					<FolderGridCard key={folder.id} folder={folder} />
				))}
				{items.map((item) => (
					<ItemGridCard key={item.id} item={item} />
				))}
			</div>
		);
	}

	// Default List View (Separated)
	return (
		<div id="explorer-main" className="flex flex-col gap-2">
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
