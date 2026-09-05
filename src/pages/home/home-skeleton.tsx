import { Skeleton } from "@/components/ui/skeleton";
import { ItemCardSkeleton } from "@/features/items/components/item-card-skeleton";

export function HomeSkeleton() {
	return (
		<main className="flex flex-col gap-10">
			{/* Item List Section */}
			<div className="flex flex-col gap-4">
				<h2 className="text-foreground font-sans text-2xl font-bold tracking-tight">Your Corner</h2>

				<div className="flex items-center justify-between px-2 mt-1">
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
