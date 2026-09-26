import { Skeleton } from "@/components/ui/skeleton";

export function ItemCardSkeleton() {
	return (
		<div className="flex items-center justify-between gap-3 rounded-md border border-transparent px-(--item-padding-x,0.75rem) py-(--item-padding-y,0.75rem) corner-squircle supports-[corner-shape:squircle]:rounded-2xl">
			<div className="flex min-w-0 flex-1 items-center gap-3">
				<Skeleton className="size-4 shrink-0 rounded-sm" />
				<div className="flex min-w-0 flex-1 items-center gap-3">
					<Skeleton className="h-6 w-6 shrink-0 rounded-md" />
					<div className="flex w-full max-w-sm flex-col items-start gap-1.5 overflow-hidden">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-3 w-3/4" />
					</div>
				</div>
			</div>
			<div className="hidden shrink-0 items-center gap-1 sm:flex sm:gap-2">
				<Skeleton className="h-9 w-32 rounded-lg corner-squircle supports-[corner-shape:squircle]:rounded-xl" />
			</div>
			<div className="flex sm:hidden">
				<Skeleton className="size-11 rounded-md" />
			</div>
		</div>
	);
}
