import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useItemStore } from "@/stores/item-store";
import { FilterXIcon, SearchIcon, XIcon } from "lucide-react";
import { parseAsString, parseAsStringEnum, useQueryState } from "nuqs";
import React, { useEffect, useState } from "react";
import { SORT_OPTIONS } from "../hooks/use-home-management";

function HomeSearchInput() {
	const [searchQuery, setSearchQuery] = useQueryState("q", parseAsString.withDefault(""));
	const [localSearch, setLocalSearch] = useState(searchQuery);
	const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);
	const clearSelection = useItemStore((state) => state.clearSelection);

	if (searchQuery !== prevSearchQuery) {
		setPrevSearchQuery(searchQuery);
		setLocalSearch(searchQuery);
	}

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (localSearch !== searchQuery) {
				setSearchQuery(localSearch || null);
				clearSelection();
			}
		}, 300);
		return () => clearTimeout(timeout);
	}, [localSearch, setSearchQuery, searchQuery, clearSelection]);

	return (
		<div className="relative w-full flex-1 sm:w-64">
			<SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
			<Input
				id="search-item"
				type="search"
				placeholder="Search..."
				className="h-9 rounded-full bg-card pr-9 pl-9 corner-squircle"
				value={localSearch}
				onChange={(e) => setLocalSearch(e.target.value)}
				autoComplete="off"
			/>
			{localSearch && (
				<button
					type="button"
					onClick={() => setLocalSearch("")}
					className="absolute top-1/2 right-1 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
					aria-label="Clear search"
				>
					<XIcon className="h-4 w-4" />
				</button>
			)}
		</div>
	);
}

function HomeSortSelect() {
	const [sortOption, setSortOption] = useQueryState(
		"sort",
		parseAsStringEnum([...SORT_OPTIONS]).withDefault("date-desc"),
	);

	return (
		<Select
			value={sortOption}
			onValueChange={(val) => setSortOption(val as (typeof SORT_OPTIONS)[number])}
		>
			<SelectTrigger
				className="h-9 w-44 rounded-full bg-card corner-squircle"
				aria-label="Sort items"
			>
				<SelectValue placeholder="Sort by" />
			</SelectTrigger>
			<SelectContent position="popper" align="end">
				<SelectItem value="date-desc">Date Added (Newest)</SelectItem>
				<SelectItem value="date-asc">Date Added (Oldest)</SelectItem>
				<SelectItem value="name-asc">Name (A-Z)</SelectItem>
				<SelectItem value="name-desc">Name (Z-A)</SelectItem>
			</SelectContent>
		</Select>
	);
}

function ClearFiltersButton() {
	const [searchQuery, setSearchQuery] = useQueryState("q", parseAsString.withDefault(""));
	const [sortOption, setSortOption] = useQueryState(
		"sort",
		parseAsStringEnum([...SORT_OPTIONS]).withDefault("date-desc"),
	);

	const isFiltersActive = searchQuery !== "" || sortOption !== "date-desc";

	if (!isFiltersActive) return null;

	const handleClearFilters = () => {
		setSearchQuery(null);
		setSortOption(null);
	};

	return (
		<Button
			variant="ghost"
			size="sm"
			className="h-9 shrink-0 gap-1 rounded-full text-muted-foreground corner-squircle hover:bg-destructive/10 hover:text-destructive"
			onClick={handleClearFilters}
			aria-label="Clear all filters"
			title="Clear all filters"
		>
			<FilterXIcon className="h-4 w-4" aria-hidden="true" />
			<span className="hidden sm:inline">Clear</span>
		</Button>
	);
}

export const HomeFilters = React.memo(function HomeFilters() {
	return (
		<div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row">
			<HomeSearchInput />

			<div className="flex w-full items-center justify-end gap-2 sm:w-auto">
				<HomeSortSelect />
				<ClearFiltersButton />
			</div>
		</div>
	);
});
