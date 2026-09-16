import { Skeleton } from "@/components/ui/skeleton";

export function FolderCardSkeleton() {
	return (
		<div className="flex items-center justify-between gap-3 rounded-md border border-transparent px-(--item-padding-x,0.75rem) py-(--item-padding-y,0.75rem) corner-squircle supports-[corner-shape:squircle]:rounded-xl">
			<div className="flex min-w-0 flex-1 items-center gap-3">
				<Skeleton className="size-4 shrink-0 rounded-sm" />
				<Skeleton className="size-6 shrink-0 rounded-md" />
				<Skeleton className="h-4 w-1/3 rounded-sm" />
			</div>
			<div className="hidden shrink-0 items-center gap-1 sm:flex sm:gap-2">
				<Skeleton className="h-9 w-24 rounded-lg corner-squircle supports-[corner-shape:squircle]:rounded-xl" />
			</div>
			<div className="flex sm:hidden">
				<Skeleton className="size-11 rounded-md" />
			</div>
		</div>
	);
}
