import { ItemRepository } from "@/db/repositories/item-repository";
import { useItemStore } from "@/stores/item-store";
import { useLiveQuery } from "dexie-react-hooks";
import { parseAsString, parseAsStringEnum, useQueryState } from "nuqs";
import { useEffect } from "react";

export const SORT_OPTIONS = ["date-desc", "date-asc", "name-asc", "name-desc"] as const;

export function useHomeData() {
	const [searchQuery] = useQueryState("q", parseAsString.withDefault(""));
	const [sortOption] = useQueryState(
		"sort",
		parseAsStringEnum([...SORT_OPTIONS]).withDefault("date-desc"),
	);

	const clearSelection = useItemStore((state) => state.clearSelection);

	const isFiltersActive = searchQuery !== "" || sortOption !== "date-desc";

	// Parse sort option for DB query
	const dbSort = sortOption.startsWith("name") ? "title" : "createdAt";
	const dbDir = sortOption.endsWith("asc") ? "asc" : "desc";

	const itemsData = useLiveQuery(
		() => ItemRepository.query({ q: searchQuery, sort: dbSort, dir: dbDir }),
		[searchQuery, dbSort, dbDir],
	);

	const totalItemsData = useLiveQuery(() => ItemRepository.count(), []);

	const isLoading = itemsData === undefined || totalItemsData === undefined;
	const isTotalLoading = totalItemsData === undefined;

	const items = itemsData ?? [];
	const totalItems = totalItemsData ?? 0;

	// Clear selection when navigating away from home page
	useEffect(() => {
		return () => {
			clearSelection();
		};
	}, [clearSelection]);

	return {
		searchQuery,
		isFiltersActive,
		items,
		totalItems,
		isLoading,
		isTotalLoading,
	};
}
