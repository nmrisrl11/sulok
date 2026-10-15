import { Skeleton } from "@/components/ui/skeleton";
import { useSettingsStore } from "@/stores";

export function FolderGridCardSkeleton() {
	const showFolderItemCounts = useSettingsStore(
		(state) => state.settings.appearanceSettings.showFolderItemCounts ?? true,
	);

	return (
		<div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-transparent bg-transparent p-4 corner-squircle supports-[corner-shape:squircle]:rounded-2xl">
			<Skeleton className="size-12 rounded-lg" />
			<div className="flex w-full flex-col items-center justify-center gap-1">
				<Skeleton className="h-4 w-20 rounded-sm" />
				{showFolderItemCounts && <Skeleton className="h-3 w-12 rounded-sm" />}
			</div>
		</div>
	);
}
