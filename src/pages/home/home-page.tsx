import { ErrorBoundary } from "@/components/error-boundary";
import { Checkbox } from "@/components/ui/checkbox";
import { type Item } from "@/db/db";
import { ItemCard } from "@/features/items/components/item-card";
import { ItemEmptyState } from "@/features/items/components/item-empty-state";
import { cn } from "@/lib/utils";
import { useItemStore } from "@/stores/item-store";
import { memo } from "react";
import { HomeFilters } from "./components/home-filters";
import { HomeFiltersSkeleton, HomeItemListSkeleton } from "./home-skeleton";
import { useHomeData } from "./hooks/use-home-management";

function SelectionHeader({ items, hasItems }: { items: Item[]; hasItems: boolean }) {
	const selectedIds = useItemStore((state) => state.selectedIds);
	const selectAll = useItemStore((state) => state.selectAll);
	const clearSelection = useItemStore((state) => state.clearSelection);

	if (!hasItems) return null;

	const isAllSelected = items.length > 0 && items.every((item) => selectedIds.includes(item.id));

	const handleSelectAllChange = (checked: boolean | string) => {
		if (checked === true) {
			selectAll(items.map((item) => item.id));
		} else {
			clearSelection();
		}
	};

	return (
		<div className="flex items-center justify-between px-2">
			<div className="flex items-center gap-3">
				<Checkbox
					id="select-all"
					checked={isAllSelected}
					onCheckedChange={handleSelectAllChange}
					className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
				/>
				<label
					htmlFor="select-all"
					className="cursor-pointer text-sm leading-none font-medium text-foreground select-none"
				>
					Select All
				</label>
			</div>
			<div className="text-sm text-muted-foreground">
				{items.length} {items.length === 1 ? "item" : "items"}
			</div>
		</div>
	);
}

function HomeHeaderArea({
	totalItems,
	isFiltersActive,
	isTotalLoading,
}: {
	totalItems: number;
	isFiltersActive: boolean;
	isTotalLoading: boolean;
}) {
	const showFilters = totalItems > 0 || isFiltersActive;

	return (
		<div className="flex flex-col justify-between gap-4 px-2 sm:flex-row sm:items-center sm:px-0">
			<h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
				Your Corner
			</h2>
			{isTotalLoading ? <HomeFiltersSkeleton /> : showFilters ? <HomeFilters /> : null}
		</div>
	);
}

const MemoizedHomeHeaderArea = memo(HomeHeaderArea);

function HomeItemArea({
	searchQuery,
	items,
	totalItems,
	isLoading,
}: {
	searchQuery: string;
	items: Item[];
	totalItems: number;
	isLoading: boolean;
}) {
	if (isLoading) {
		return <HomeItemListSkeleton />;
	}

	const hasItems = items.length > 0;
	// When clearing search, q becomes "" instantly but items might still be [] for a split second.
	const isTransitioning = !hasItems && !searchQuery && totalItems > 0;

	return (
		<>
			{hasItems && <SelectionHeader items={items} hasItems={hasItems} />}

			<div className="flex flex-col gap-2">
				<ErrorBoundary>
					{isTransitioning ? null : !hasItems ? (
						totalItems === 0 ? (
							<ItemEmptyState />
						) : (
							<div className="py-12 text-center">
								<p className="text-sm text-muted-foreground italic">
									No items found matching your criteria.
								</p>
							</div>
						)
					) : (
						items.map((item) => <ItemCard key={item.id} item={item} />)
					)}
				</ErrorBoundary>
			</div>
		</>
	);
}

export function HomePage({ className }: { className?: string }) {
	const homeData = useHomeData();

	return (
		<main className={cn("flex flex-col gap-10", className)}>
			<div className="flex flex-col gap-4">
				<MemoizedHomeHeaderArea
					totalItems={homeData.totalItems}
					isFiltersActive={homeData.isFiltersActive}
					isTotalLoading={homeData.isTotalLoading}
				/>
				<HomeItemArea
					searchQuery={homeData.searchQuery}
					items={homeData.items}
					totalItems={homeData.totalItems}
					isLoading={homeData.isLoading}
				/>
			</div>
		</main>
	);
}
