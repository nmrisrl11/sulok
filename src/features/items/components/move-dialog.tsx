import { FolderIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderRepository } from "@/db/repositories/folder-repository";
import { FolderBreadcrumbs } from "@/features/folders/components/folder-breadcrumbs";
import { notify } from "@/lib/notify";
import { useFolderStore, useItemStore, useMoveStore } from "@/stores";
import { useLiveQuery } from "dexie-react-hooks";
import { ChevronRightIcon } from "lucide-react";
import { useState } from "react";

export function MoveDialog() {
	const isOpen = useMoveStore((state) => state.isOpen);
	const movingItemIds = useMoveStore((state) => state.movingItemIds);
	const movingFolderIds = useMoveStore((state) => state.movingFolderIds);
	const closeMoveDialog = useMoveStore((state) => state.closeMoveDialog);
	const [currentParentId, setCurrentParentId] = useState<string | null>(null);
	const [isMoving, setIsMoving] = useState(false);

	const allFolders = useLiveQuery(() => FolderRepository.getAll());
	const isLoaded = allFolders !== undefined;
	const resolvedFolders = allFolders || [];

	// Filter out moving folders and their descendants to prevent circular moves
	const filteredFolders = resolvedFolders.filter((f) => {
		// If it's one of the folders being moved, hide it
		if (movingFolderIds.includes(f.id)) return false;

		// If any ancestor is being moved, hide it
		let current = resolvedFolders.find((p) => p.id === f.parentId);
		while (current) {
			if (movingFolderIds.includes(current.id)) return false;
			current = resolvedFolders.find((p) => p.id === current?.parentId);
		}

		return true;
	});

	// Get immediate children of the currently viewed folder
	const currentChildren = filteredFolders
		.filter((f) => f.parentId === currentParentId)
		.sort((a, b) => a.order - b.order);

	const handleClose = () => {
		setCurrentParentId(null);
		closeMoveDialog();
	};

	const handleMove = async () => {
		setIsMoving(true);
		try {
			const { BulkRepository } = await import("@/db/repositories/bulk-repository");
			await BulkRepository.move(movingItemIds, movingFolderIds, currentParentId);

			// Clear selections if they were moved
			useItemStore.getState().clearSelection();
			useFolderStore.getState().clearSelection();

			notify.success(`Moved ${movingItemIds.length + movingFolderIds.length} items`);
			handleClose();
		} catch (error) {
			console.error("Failed to move items", error);
			notify.error("Failed to move items");
		} finally {
			setIsMoving(false);
		}
	};

	const totalItems = movingItemIds.length + movingFolderIds.length;

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<DialogContent className="flex max-h-[85vh] flex-col gap-0 p-0 sm:max-w-md">
				<DialogHeader className="p-4 pb-3">
					<DialogTitle>Move Items</DialogTitle>
					<DialogDescription>
						Select a destination for the {totalItems} selected {totalItems === 1 ? "item" : "items"}
						.
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col border-y border-border">
					{/* Breadcrumb Header */}
					<div className="bg-muted/30 px-3 py-2.5">
						<FolderBreadcrumbs
							currentFolderId={currentParentId}
							allFolders={resolvedFolders}
							onNavigate={setCurrentParentId}
							rootClassName="text-sm font-medium"
							leafClassName="max-w-30 truncate text-sm sm:max-w-40 md:max-w-none"
							linkClassName="max-w-25 cursor-pointer truncate text-sm hover:text-foreground sm:max-w-none"
						/>
					</div>

					{/* Folder List */}
					<div className="custom-scrollbar flex max-h-[45vh] min-h-64 flex-1 flex-col overflow-y-auto p-1">
						{!isLoaded ? (
							<div className="flex flex-col gap-1 p-1">
								{Array.from({ length: 4 }).map((_, i) => (
									<div key={i} className="flex items-center gap-3 px-3 py-2.5">
										<Skeleton className="size-5 rounded-md" />
										<Skeleton className="h-4 flex-1" />
										<Skeleton className="size-4 rounded-sm" />
									</div>
								))}
							</div>
						) : currentChildren.length === 0 ? (
							<div className="flex h-full flex-col items-center justify-center py-12 text-center">
								<FolderIcon className="mb-3 size-12 opacity-50 grayscale" />
								<p className="text-sm font-medium text-foreground">No folders here</p>
								<p className="mt-1 text-xs text-muted-foreground">
									Click "Move Here" to move items to this location.
								</p>
							</div>
						) : (
							currentChildren.map((folder) => (
								<button
									key={folder.id}
									type="button"
									className="group flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
									onClick={() => setCurrentParentId(folder.id)}
								>
									<FolderIcon className="size-5 shrink-0 opacity-80 transition-opacity group-hover:opacity-100" />
									<span className="flex-1 truncate">{folder.name}</span>
									<ChevronRightIcon className="size-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
								</button>
							))
						)}
					</div>
				</div>

				<DialogFooter className="m-0 sm:justify-end">
					<Button variant="ghost" onClick={handleClose} disabled={isMoving}>
						Cancel
					</Button>
					<Button onClick={handleMove} disabled={isMoving}>
						Move Here
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
