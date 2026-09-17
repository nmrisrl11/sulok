import { Skeleton } from "@/components/ui/skeleton";

export function FolderGridCardSkeleton() {
	return (
		<div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-transparent bg-transparent p-4 corner-squircle supports-[corner-shape:squircle]:rounded-2xl">
			<Skeleton className="size-12 rounded-lg" />
			<Skeleton className="h-4 w-20 rounded-sm" />
		</div>
	);
}
