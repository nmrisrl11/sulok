import { FolderRepository } from "@/db/repositories/folder-repository";
import { ItemRepository } from "@/db/repositories/item-repository";
import {
	folderIdParser,
	searchQueryParser,
	sortOptionParser,
	viewModeParser,
	viewParser,
} from "@/lib/search-params";
import { useFolderStore, useItemStore } from "@/stores";
import { useLiveQuery } from "dexie-react-hooks";
import { useQueryState } from "nuqs";
import { useEffect } from "react";

export function useHomeData() {
	const [searchQuery, setSearchQuery] = useQueryState("q", searchQueryParser);
	const [sortOption, setSortOption] = useQueryState("sort", sortOptionParser);
	const [view, setView] = useQueryState("view", viewParser);
	const [folderId, setFolderId] = useQueryState("folder", folderIdParser);
	const [viewMode, setViewMode] = useQueryState("mode", viewModeParser);

	const clearItemSelection = useItemStore((state) => state.clearSelection);
	const clearFolderSelection = useFolderStore((state) => state.clearSelection);

	const isFiltersActive = searchQuery !== "" || sortOption !== "date-desc";

	// Parse sort option for DB query
	const dbSort = sortOption.startsWith("name") ? "title" : "createdAt";
	const dbDir = sortOption.endsWith("asc") ? "asc" : "desc";

	const itemsData = useLiveQuery(
		() =>
			ItemRepository.query({
				q: searchQuery,
				sort: dbSort,
				dir: dbDir,
				folderId:
					view === "all"
						? folderId || null
						: view === "favorites"
							? folderId || undefined
							: undefined,
				view,
			}),
		[searchQuery, dbSort, dbDir, folderId, view],
	);

	const foldersData = useLiveQuery(
		() =>
			FolderRepository.query({
				view,
				parentId:
					view === "all"
						? folderId || null
						: view === "favorites"
							? folderId || undefined
							: undefined,
				q: searchQuery,
				sort: dbSort,
				dir: dbDir,
			}),
		[view, folderId, searchQuery, dbSort, dbDir],
	);

	const totalItemsData = useLiveQuery(() => ItemRepository.count(), []);

	const isLoading =
		itemsData === undefined || totalItemsData === undefined || foldersData === undefined;
	const isTotalLoading = totalItemsData === undefined;

	const items = itemsData ?? [];
	const folders = foldersData ?? [];
	const totalItems = totalItemsData ?? 0;

	// Clear selection when navigating away from home page or switching views/folders
	useEffect(() => {
		clearItemSelection();
		clearFolderSelection();
	}, [view, folderId, clearItemSelection, clearFolderSelection]);

	useEffect(() => {
		return () => {
			clearItemSelection();
			clearFolderSelection();
		};
	}, [clearItemSelection, clearFolderSelection]);

	return {
		searchQuery,
		setSearchQuery,
		sortOption,
		setSortOption,
		view,
		setView,
		folderId,
		setFolderId,
		viewMode,
		setViewMode,
		isFiltersActive,
		items,
		folders,
		totalItems,
		isLoading,
		isTotalLoading,
	};
}
