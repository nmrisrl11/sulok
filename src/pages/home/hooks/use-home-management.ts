import { FolderRepository } from "@/db/repositories/folder-repository";
import { ItemRepository } from "@/db/repositories/item-repository";
import {
	folderIdParser,
	mixDataParser,
	searchQueryParser,
	sortOptionParser,
	typeFilterParser,
	viewModeParser,
	viewParser,
} from "@/lib/search-params";
import { useFolderStore, useItemStore } from "@/stores";
import { useLiveQuery } from "dexie-react-hooks";
import { useQueryState } from "nuqs";
import { useEffect, useMemo } from "react";

export function useHomeData() {
	const [searchQuery, setSearchQuery] = useQueryState("q", searchQueryParser);
	const [sortOption, setSortOption] = useQueryState("sort", sortOptionParser);
	const [view, setView] = useQueryState("view", viewParser);
	const [folderId, setFolderId] = useQueryState("folder", folderIdParser);
	const [viewMode, setViewMode] = useQueryState("mode", viewModeParser);
	const [mixData, setMixData] = useQueryState("mix", mixDataParser);
	const [typeFilter, setTypeFilter] = useQueryState("type", typeFilterParser);

	const clearItemSelection = useItemStore((state) => state.clearSelection);
	const clearFolderSelection = useFolderStore((state) => state.clearSelection);

	const isFiltersActive = searchQuery !== "" || sortOption !== "date-desc" || typeFilter !== "all";

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

	const availableDomains = useMemo(() => {
		if (!itemsData) return [];
		const domains = new Set<string>();
		itemsData.forEach((item) => {
			try {
				const url = new URL(item.url);
				const host = url.hostname.replace(/^www\./, "");
				if (host) domains.add(host);
			} catch {
				// Ignore invalid URLs
			}
		});
		return Array.from(domains).sort();
	}, [itemsData]);

	let items = itemsData ?? [];
	let folders = foldersData ?? [];
	const totalItems = totalItemsData ?? 0;

	if (typeFilter === "folders") {
		items = [];
	} else if (typeFilter === "links") {
		folders = [];
	} else if (typeFilter === "favorites") {
		items = items.filter((i) => i.isFavorite);
		folders = folders.filter((f) => f.isFavorite);
	} else if (typeFilter.startsWith("domain:")) {
		folders = [];
		const domain = typeFilter.slice(7);
		items = items.filter((i) => {
			try {
				const host = new URL(i.url).hostname.replace(/^www\./, "");
				return host === domain;
			} catch {
				return false;
			}
		});
	}

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
		mixData,
		setMixData,
		typeFilter,
		setTypeFilter,
		isFiltersActive,
		items,
		folders,
		totalItems,
		isLoading,
		isTotalLoading,
		availableDomains,
	};
}
