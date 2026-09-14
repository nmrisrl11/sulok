import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Folder } from "@/db/db";
import { FolderRepository } from "@/db/repositories/folder-repository";
import { ItemRepository } from "@/db/repositories/item-repository";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";
import { useFolderStore } from "@/stores/folder-store";
import { useItemStore } from "@/stores/item-store";
import { useMoveStore } from "@/stores/move-store";
import { useLiveQuery } from "dexie-react-hooks";
import { FolderIcon, HomeIcon } from "lucide-react";
import { useState } from "react";

// Helper to build a flat list with depth for rendering a tree
function buildFolderTreeList(
	allFolders: Folder[],
	parentId: string | null = null,
	depth = 0,
): { folder: Folder; depth: number }[] {
	const children = allFolders
		.filter((f) => f.parentId === parentId)
		.sort((a, b) => a.order - b.order);
	let result: { folder: Folder; depth: number }[] = [];

	for (const child of children) {
		result.push({ folder: child, depth });
		result = result.concat(buildFolderTreeList(allFolders, child.id, depth + 1));
	}

	return result;
}

export function MoveDialog() {
	const { isOpen, movingItemIds, movingFolderIds, closeMoveDialog } = useMoveStore();
	const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
	const [isMoving, setIsMoving] = useState(false);

	const allFolders = useLiveQuery(() => FolderRepository.getAll()) || [];

	// Filter out moving folders and their descendants to prevent circular moves
	const filteredFolders = allFolders.filter((f) => {
		// If it's one of the folders being moved, hide it
		if (movingFolderIds.includes(f.id)) return false;

		// If any ancestor is being moved, hide it
		let current = allFolders.find((p) => p.id === f.parentId);
		while (current) {
			if (movingFolderIds.includes(current.id)) return false;
			current = allFolders.find((p) => p.id === current?.parentId);
		}

		return true;
	});

	const treeList = buildFolderTreeList(filteredFolders);

	const handleMove = async () => {
		setIsMoving(true);
		try {
			if (movingItemIds.length > 0) {
				await ItemRepository.moveMany(movingItemIds, selectedFolderId);
			}
			if (movingFolderIds.length > 0) {
				await FolderRepository.moveMany(movingFolderIds, selectedFolderId);
			}

			// Clear selections if they were moved
			useItemStore.getState().clearSelection();
			useFolderStore.getState().clearSelection();

			notify.success(`Moved ${movingItemIds.length + movingFolderIds.length} items`);
			closeMoveDialog();
		} catch (error) {
			console.error("Failed to move items", error);
			notify.error("Failed to move items");
		} finally {
			setIsMoving(false);
		}
	};

	const totalItems = movingItemIds.length + movingFolderIds.length;

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && closeMoveDialog()}>
			<DialogContent className="flex max-h-[85vh] flex-col sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Move Items</DialogTitle>
					<DialogDescription>
						Select a destination for the {totalItems} selected {totalItems === 1 ? "item" : "items"}
						.
					</DialogDescription>
				</DialogHeader>

				<div className="custom-scrollbar mt-2 min-h-75 flex-1 overflow-y-auto rounded-md border p-1">
					<div
						className={cn(
							"flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2 transition-colors",
							selectedFolderId === null
								? "bg-primary/10 font-medium text-primary"
								: "hover:bg-muted",
						)}
						onClick={() => setSelectedFolderId(null)}
					>
						<HomeIcon
							className={cn(
								"size-4",
								selectedFolderId === null ? "text-primary" : "text-muted-foreground",
							)}
						/>
						<span>My Corner (Root)</span>
					</div>

					{treeList.map(({ folder, depth }) => (
						<div
							key={folder.id}
							className={cn(
								"flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2 transition-colors",
								selectedFolderId === folder.id
									? "bg-primary/10 font-medium text-primary"
									: "hover:bg-muted",
							)}
							style={{ paddingLeft: `${depth * 16 + 12}px` }}
							onClick={() => setSelectedFolderId(folder.id)}
						>
							<FolderIcon
								className={cn(
									"size-4 shrink-0",
									selectedFolderId === folder.id
										? "fill-primary/20 text-primary"
										: "text-muted-foreground",
								)}
							/>
							<span className="truncate">{folder.name}</span>
						</div>
					))}
				</div>

				<DialogFooter className="mt-4 gap-2 sm:justify-end">
					<Button variant="ghost" onClick={closeMoveDialog} disabled={isMoving}>
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
