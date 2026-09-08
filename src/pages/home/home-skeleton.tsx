import { Skeleton } from "@/components/ui/skeleton";
import { ItemCardSkeleton } from "@/features/items/components/item-card-skeleton";

export function HomeSkeleton() {
	return (
		<main className="flex flex-col gap-10">
			{/* Item List Section */}
			<div className="flex flex-col gap-4">
				<div className="flex flex-col justify-between gap-4 px-2 sm:flex-row sm:items-center sm:px-0">
					<h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
						Your Corner
					</h2>
					<div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row">
						<Skeleton className="h-9 w-full rounded-full sm:w-64" />
						<div className="flex w-full items-center justify-end gap-2 sm:w-auto">
							<Skeleton className="h-9 w-20 rounded-full" />
							<Skeleton className="h-9 w-20 rounded-full" />
						</div>
					</div>
				</div>

				<div className="mt-1 flex items-center justify-between px-2">
					<div className="flex items-center gap-3">
						<Skeleton className="h-4 w-4 rounded-sm" />
						<Skeleton className="h-4 w-16" />
					</div>
					<Skeleton className="h-4 w-12" />
				</div>

				<div className="flex flex-col gap-2">
					<ItemCardSkeleton />
					<ItemCardSkeleton />
					<ItemCardSkeleton />
				</div>
			</div>
		</main>
	);
}
