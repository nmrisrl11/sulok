import { type Folder, type Item } from "@/db/db";
import { ItemCard } from "@/features/items/components/item-card";
import { ItemGridCard } from "@/features/items/components/item-grid-card";
import { viewModeParser } from "@/lib/search-params";
import { useQueryState } from "nuqs";
import { FolderEmptyState } from "./folder-empty-state";
import { FolderGridCard } from "./folder-grid-card";

import { FolderCard } from "./folder-card";

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
		return (
			<div className="animate-pulse py-8 text-center text-sm text-muted-foreground">Loading...</div>
		);
	}

	const isEmpty = folders.length === 0 && items.length === 0;

	if (isEmpty) {
		return <FolderEmptyState />;
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
