import {
	CustomHeartIcon,
	CustomHeartSlashIcon,
	MoveToFolderIcon,
	TrashClockIcon,
	TrashUndoIcon,
	TrashXMarkIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { viewParser } from "@/lib/search-params";
import { useMoveStore } from "@/stores";
import { useQueryState } from "nuqs";
import { useBulkActions } from "../hooks/use-bulk-actions";

export function BulkActionBar() {
	const {
		allFavorited,
		totalSelected,
		selectedIds,
		selectedFolderIds,
		clearSelection,
		clearFolderSelection,
		handleSoftDeleteSelected,
		handleBulkFavorite,
		handleRestoreSelected,
		handleHardDeleteSelected,
	} = useBulkActions();
	const [view] = useQueryState("view", viewParser);

	if (totalSelected === 0) return null;

	return (
		<div className="mx-auto flex w-fit animate-in items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-2 text-card-foreground shadow-lg backdrop-blur-md duration-300 slide-in-from-bottom-10 corner-squircle fade-in supports-[corner-shape:squircle]:rounded-2xl sm:gap-4 sm:px-4">
			<span className="px-1 text-xs font-medium whitespace-nowrap sm:px-2 sm:text-sm">
				{totalSelected} selected
			</span>
			<div className="h-6 w-px shrink-0 bg-border" />
			<div className="flex items-center gap-1">
				{view === "trash" ? (
					<>
						<Button
							variant="ghost"
							size="sm"
							onClick={handleRestoreSelected}
							className="h-8 gap-2 rounded-full! hover:bg-muted"
						>
							<TrashUndoIcon className="h-4 w-4" />
							<span className="hidden sm:inline">Restore Selected</span>
							<span className="sr-only sm:hidden">Restore Selected</span>
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={handleHardDeleteSelected}
							className="h-8 gap-2 rounded-full! hover:bg-destructive/10 hover:text-destructive"
						>
							<TrashXMarkIcon className="h-4 w-4" />
							<span className="hidden sm:inline">Delete Forever</span>
							<span className="sr-only sm:hidden">Delete Forever</span>
						</Button>
					</>
				) : (
					<>
						{!allFavorited && view !== "favorites" && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => handleBulkFavorite(true)}
								className="h-8 gap-2 rounded-full! hover:bg-muted"
							>
								<CustomHeartIcon className="h-4 w-4" />
								<span className="hidden sm:inline">Favorite</span>
								<span className="sr-only sm:hidden">Favorite Selected</span>
							</Button>
						)}
						{(allFavorited || view === "favorites") && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => handleBulkFavorite(false)}
								className="h-8 gap-2 rounded-full! text-red-500 hover:bg-muted hover:text-red-600"
							>
								<CustomHeartSlashIcon className="h-4 w-4" />
								<span className="hidden sm:inline">Unfavorite</span>
								<span className="sr-only sm:hidden">Unfavorite Selected</span>
							</Button>
						)}
						<Button
							variant="ghost"
							size="sm"
							onClick={handleSoftDeleteSelected}
							className="h-8 gap-2 rounded-full! hover:bg-destructive/10 hover:text-destructive"
						>
							<TrashClockIcon className="h-4 w-4" />
							<span className="hidden sm:inline">Delete</span>
							<span className="sr-only sm:hidden">Delete Selected</span>
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() =>
								useMoveStore
									.getState()
									.openMoveDialog({ itemIds: selectedIds, folderIds: selectedFolderIds })
							}
							className="h-8 gap-2 rounded-full! hover:bg-muted"
						>
							<MoveToFolderIcon className="h-4 w-4" />
							<span className="hidden sm:inline">Move</span>
							<span className="sr-only sm:hidden">Move Selected</span>
						</Button>
					</>
				)}
				<Button
					variant="ghost"
					size="sm"
					onClick={() => {
						clearSelection();
						clearFolderSelection();
					}}
					className="h-8 rounded-full! text-muted-foreground"
				>
					Clear
				</Button>
			</div>
		</div>
	);
}
