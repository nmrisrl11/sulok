import { Skeleton } from "@/components/ui/skeleton";

export function ItemGridCardSkeleton() {
	return (
		<div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-transparent bg-transparent p-4 corner-squircle supports-[corner-shape:squircle]:rounded-2xl">
			<Skeleton className="size-12 rounded-full" />
			<Skeleton className="h-4 w-24 rounded-sm" />
		</div>
	);
}
