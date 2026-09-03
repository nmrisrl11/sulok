import { Skeleton } from "@/components/ui/skeleton";

export function ItemCardSkeleton() {
	return (
		<div className="flex items-center justify-between gap-3 rounded-md px-2 py-2">
			<div className="flex items-center gap-3 w-full max-w-50 sm:max-w-md">
				<Skeleton className="h-6 w-6 rounded-md shrink-0" />
				<div className="flex flex-col gap-1.5 overflow-hidden w-full">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-3 w-3/4" />
				</div>
			</div>
			<div className="flex items-center gap-1 shrink-0">
				<Skeleton className="h-8 w-8 rounded-md" />
				<Skeleton className="h-8 w-8 rounded-md" />
			</div>
		</div>
	);
}
