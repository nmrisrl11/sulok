import { Skeleton } from "@/components/ui/skeleton";

export function ItemCardSkeleton() {
	return (
		<div className="flex items-center justify-between gap-3 rounded-md px-(--item-padding-x,0.75rem) py-(--item-padding-y,0.75rem)">
			<div className="flex w-full max-w-50 items-center gap-3 sm:max-w-md">
				<Skeleton className="h-6 w-6 shrink-0 rounded-md" />
				<div className="flex w-full flex-col gap-1.5 overflow-hidden">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-3 w-3/4" />
				</div>
			</div>
			<div className="flex shrink-0 items-center gap-1">
				<Skeleton className="h-8 w-8 rounded-md" />
				<Skeleton className="h-8 w-8 rounded-md" />
			</div>
		</div>
	);
}
