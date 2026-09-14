import { FolderRepository } from "@/db/repositories/folder-repository";
import { ItemRepository } from "@/db/repositories/item-repository";
import { useItemStore } from "@/stores/item-store";
import { useLiveQuery } from "dexie-react-hooks";
import { parseAsString, parseAsStringEnum, useQueryState } from "nuqs";
import { useEffect } from "react";

export const SORT_OPTIONS = ["date-desc", "date-asc", "name-asc", "name-desc"] as const;

export function useHomeData() {
	const [searchQuery, setSearchQuery] = useQueryState("q", parseAsString.withDefault(""));
	const [sortOption, setSortOption] = useQueryState(
		"sort",
		parseAsStringEnum([...SORT_OPTIONS]).withDefault("date-desc"),
	);
	const [view, setView] = useQueryState(
		"view",
		parseAsStringEnum(["all", "favorites", "trash"]).withDefault("all"),
	);
	const [folderId, setFolderId] = useQueryState("folder", parseAsString.withDefault(""));
	const [viewMode, setViewMode] = useQueryState(
		"mode",
		parseAsStringEnum(["list", "grid", "compact"]).withDefault("list"),
	);

	const clearSelection = useItemStore((state) => state.clearSelection);

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
				folderId: view === "all" ? (folderId ? folderId : null) : undefined,
				view,
			}),
		[searchQuery, dbSort, dbDir, folderId, view],
	);

	const foldersData = useLiveQuery(
		() =>
			FolderRepository.query({
				view,
				parentId: view === "all" ? (folderId ? folderId : null) : undefined,
				q: searchQuery,
			}),
		[view, folderId, searchQuery],
	);

	const totalItemsData = useLiveQuery(() => ItemRepository.count(), []);

	const isLoading =
		itemsData === undefined || totalItemsData === undefined || foldersData === undefined;
	const isTotalLoading = totalItemsData === undefined;

	const items = itemsData ?? [];
	const folders = foldersData ?? [];
	const totalItems = totalItemsData ?? 0;

	// Clear selection when navigating away from home page
	useEffect(() => {
		return () => {
			clearSelection();
		};
	}, [clearSelection]);

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
