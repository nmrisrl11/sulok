import { ErrorBoundary } from "@/components/error-boundary";
import { Checkbox } from "@/components/ui/checkbox";
import { ItemRepository } from "@/db/repositories/item-repository";
import { ItemCard } from "@/features/items/components/item-card";
import { ItemControls } from "@/features/items/components/item-controls";
import { ItemEmptyState } from "@/features/items/components/item-empty-state";
import { cn } from "@/lib/utils";
import { useItemStore } from "@/stores/item-store";
import { useLiveQuery } from "dexie-react-hooks";
import { parseAsString, parseAsStringEnum, useQueryState } from "nuqs";
import { useEffect } from "react";
import { HomeRouteFallback } from "./home-route-fallback";

export function HomePage({ className }: { className?: string }) {
	const [q] = useQueryState("q", parseAsString.withDefault(""));
	const [sort] = useQueryState(
		"sort",
		parseAsStringEnum(["createdAt", "title"]).withDefault("createdAt"),
	);
	const [dir] = useQueryState("dir", parseAsStringEnum(["asc", "desc"]).withDefault("desc"));

	const items = useLiveQuery(() => ItemRepository.query({ q, sort, dir }), [q, sort, dir]);
	const { selectedIds, selectAll, clearSelection } = useItemStore();

	// Clear selection when navigating away from home page
	useEffect(() => {
		return () => {
			clearSelection();
		};
	}, [clearSelection]);

	if (items === undefined) {
		return <HomeRouteFallback />;
	}

	const hasItems = items.length > 0;
	const isAllSelected = hasItems && items.every((item) => selectedIds.includes(item.id));

	const handleSelectAllChange = (checked: boolean | string) => {
		if (checked === true) {
			selectAll(items.map((item) => item.id));
		} else {
			clearSelection();
		}
	};

	return (
		<main className={cn("flex flex-col gap-10", className)}>
			{/* Item List Section */}
			<div className="flex flex-col gap-4">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2 sm:px-0">
					<h2 className="text-foreground font-sans text-2xl font-bold tracking-tight">
						Your Corner
					</h2>
					<ItemControls />
				</div>

				{hasItems && (
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
								className="text-sm font-medium leading-none cursor-pointer select-none text-foreground"
							>
								Select All
							</label>
						</div>
						<div className="text-sm text-muted-foreground">
							{items.length} {items.length === 1 ? "item" : "items"}
						</div>
					</div>
				)}

				<div className="flex flex-col gap-2">
					<ErrorBoundary>
						{!hasItems ? (
							<ItemEmptyState />
						) : (
							items.map((item) => <ItemCard key={item.id} item={item} />)
						)}
					</ErrorBoundary>
				</div>
			</div>
		</main>
	);
}
