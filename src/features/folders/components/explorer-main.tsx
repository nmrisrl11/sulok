import {
	CustomHeartFilledIcon,
	CustomHeartIcon,
	CustomHeartSlashIcon,
	FolderEditIcon,
	FolderIcon,
	MoveToFolderIcon,
	TrashClockIcon,
	TrashUndoIcon,
	TrashXMarkIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Folder, type Item } from "@/db/db";
import { ItemCard } from "@/features/items/components/item-card";
import { ItemGridCard } from "@/features/items/components/item-grid-card";
import { notify } from "@/lib/notify";
import { folderIdParser, viewModeParser, viewParser } from "@/lib/search-params";
import { cn } from "@/lib/utils";
import { useConfirmationStore, useFolderStore, useMoveStore } from "@/stores";
import { MoreVerticalIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { FolderEmptyState } from "./folder-empty-state";
import { FolderGridCard } from "./folder-grid-card";

function FolderCard({ folder }: { folder: Folder }) {
	const [_, setFolderId] = useQueryState("folder", folderIdParser);
	const { openEditDialog } = useFolderStore();
	const confirm = useConfirmationStore((state) => state.confirm);
	const [view] = useQueryState("view", viewParser);
	const { softDeleteFolders, restoreFolders, hardDeleteFolder, toggleSelection } = useFolderStore();
	const isSelected = useFolderStore((state) => state.selectedFolderIds.includes(folder.id));

	const handleSoftDelete = async () => {
		try {
			await softDeleteFolders([folder.id]);
			notify.success("Moved to Recycle Bin", {
				action: {
					label: "Undo",
					onClick: () => restoreFolders([folder.id]),
				},
			});
		} catch (error) {
			console.error(error);
			notify.error("Failed to delete folder");
		}
	};

	const handleRestore = async () => {
		try {
			await restoreFolders([folder.id]);
			notify.success("Folder restored");
		} catch (error) {
			console.error(error);
			notify.error("Failed to restore folder");
		}
	};

	const handleHardDelete = () => {
		confirm({
			title: "Delete Folder",
			description: `Are you sure you want to permanently delete "${folder.name}"? This action cannot be undone.`,
			confirmText: "Delete Forever",
			onConfirm: async () => {
				try {
					await hardDeleteFolder(folder.id);
					notify.success("Folder permanently deleted");
				} catch (error) {
					console.error(error);
					notify.error("Failed to delete folder");
				}
			},
		});
	};

	const handleToggleFavorite = async () => {
		try {
			const { FolderRepository } = await import("@/db/repositories/folder-repository");
			const isFav = await FolderRepository.toggleFavorite(folder.id);
			notify.success(isFav ? "Added to Favorites" : "Removed from Favorites");
		} catch (error) {
			console.error("Failed to toggle favorite", error);
			notify.error("Failed to update favorite status");
		}
	};

	return (
		<div
			role="button"
			tabIndex={0}
			className={cn(
				"group flex cursor-pointer items-center justify-between gap-3 rounded-md border border-transparent px-(--item-padding-x,0.75rem) py-(--item-padding-y,0.75rem) transition-colors corner-squircle hover:border-border hover:bg-card/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none supports-[corner-shape:squircle]:rounded-xl",
				isSelected && "border-border bg-card/50 shadow-sm",
			)}
			onClick={() => {
				if (view === "trash") {
					toggleSelection(folder.id);
				} else {
					setFolderId(folder.id);
				}
			}}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					if (view === "trash") {
						toggleSelection(folder.id);
					} else {
						setFolderId(folder.id);
					}
				}
			}}
		>
			<div className="flex min-w-0 flex-1 items-center gap-3">
				<div
					className={cn(
						"flex shrink-0 items-center gap-3 transition-opacity duration-200",
						!isSelected &&
							"group-focus-within:opacity-100 md:opacity-0 md:group-hover:opacity-100 pointer-coarse:opacity-100",
					)}
					onClick={(e) => e.stopPropagation()}
				>
					<Checkbox
						checked={isSelected}
						onCheckedChange={() => toggleSelection(folder.id)}
						className="shrink-0 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
					/>
				</div>
				<FolderIcon className="size-6 shrink-0" />
				<span className="truncate text-sm font-medium text-foreground">{folder.name}</span>
			</div>

			<div
				className="flex shrink-0 items-center gap-1 sm:gap-2"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="hidden shrink-0 items-center opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 md:block">
					<div className="flex h-9 items-center rounded-lg border bg-muted/40 p-0.5 corner-squircle supports-[corner-shape:squircle]:rounded-xl">
						{view !== "trash" ? (
							<>
								<div className="flex items-center">
									<Button
										variant="ghost"
										size="icon"
										className={cn(
											"h-8 w-8 transition-colors",
											folder.isFavorite
												? "text-red-500 hover:bg-red-500/10 hover:text-red-600"
												: "hover:text-foreground",
										)}
										onClick={handleToggleFavorite}
									>
										{folder.isFavorite ? (
											<CustomHeartFilledIcon className="h-4 w-4" />
										) : (
											<CustomHeartIcon className="h-4 w-4" />
										)}
										<span className="sr-only">{folder.isFavorite ? "Unfavorite" : "Favorite"}</span>
									</Button>
								</div>

								<div className="mx-0.5 h-4 w-px bg-border/50" />

								<div className="flex items-center">
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 hover:text-foreground"
										onClick={() => openEditDialog(folder)}
									>
										<FolderEditIcon className="h-4 w-4" />
										<span className="sr-only">Rename</span>
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 hover:text-destructive"
										onClick={handleSoftDelete}
									>
										<TrashClockIcon className="h-4 w-4" />
										<span className="sr-only">Delete</span>
									</Button>
								</div>
							</>
						) : (
							<div className="flex items-center">
								<Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRestore}>
									<TrashUndoIcon className="h-4 w-4" />
									<span className="sr-only">Restore</span>
								</Button>
								<div className="mx-0.5 h-4 w-px bg-border/50" />
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 hover:text-destructive"
									onClick={handleHardDelete}
								>
									<TrashXMarkIcon className="h-4 w-4" />
									<span className="sr-only">Delete Forever</span>
								</Button>
							</div>
						)}
					</div>
				</div>

				<div className="flex md:hidden">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="h-11 w-11 text-muted-foreground">
								<MoreVerticalIcon className="h-4 w-4" />
								<span className="sr-only">Actions</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-40">
							{view === "trash" ? (
								<>
									<DropdownMenuItem
										onClick={handleRestore}
										className="cursor-pointer py-2.5 md:py-1.5"
									>
										<TrashUndoIcon className="mr-2 h-3.5 w-3.5" />
										<span className="text-[13px]">Restore</span>
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={handleHardDelete}
										variant="destructive"
										className="cursor-pointer py-2.5 md:py-1.5"
									>
										<TrashXMarkIcon className="mr-2 h-3.5 w-3.5" />
										<span className="text-[13px] whitespace-nowrap">Delete Forever</span>
									</DropdownMenuItem>
								</>
							) : (
								<>
									<DropdownMenuItem
										onClick={handleToggleFavorite}
										className="cursor-pointer py-2.5 md:py-1.5"
									>
										{folder.isFavorite ? (
											<CustomHeartSlashIcon className="mr-2 h-3.5 w-3.5 text-red-500" />
										) : (
											<CustomHeartIcon className="mr-2 h-3.5 w-3.5" />
										)}
										<span className={cn(folder.isFavorite && "text-red-500", "text-[13px]")}>
											{folder.isFavorite ? "Unfavorite" : "Favorite"}
										</span>
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => openEditDialog(folder)}
										className="cursor-pointer py-2.5 md:py-1.5"
									>
										<FolderEditIcon className="mr-2 h-3.5 w-3.5" />
										<span className="text-[13px]">Rename</span>
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() =>
											useMoveStore.getState().openMoveDialog({ folderIds: [folder.id] })
										}
										className="cursor-pointer py-2.5 md:py-1.5"
									>
										<MoveToFolderIcon className="mr-2 h-3.5 w-3.5" />
										<span className="text-[13px]">Move to...</span>
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={handleSoftDelete}
										variant="destructive"
										className="cursor-pointer py-2.5 md:py-1.5"
									>
										<TrashClockIcon className="mr-2 h-3.5 w-3.5" />
										<span className="text-[13px]">Delete</span>
									</DropdownMenuItem>
								</>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	);
}

export function ExplorerMain({
	folders,
	items,
	isLoading,
}: {
	folders: Folder[];
	items: Item[];
	isLoading: boolean;
}) {
	const [viewMode] = useQueryState("mode", viewModeParser);

	if (isLoading) {
		return (
			<div className="animate-pulse py-8 text-center text-sm text-muted-foreground">Loading...</div>
		);
	}

	const isEmpty = folders.length === 0 && items.length === 0;

	if (isEmpty) {
		return <FolderEmptyState />;
	}

	if (viewMode === "grid") {
		return (
			<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
				{folders.map((folder) => (
					<FolderGridCard key={folder.id} folder={folder} />
				))}
				{items.map((item) => (
					<ItemGridCard key={item.id} item={item} />
				))}
			</div>
		);
	}

	// Default List View
	return (
		<div className="flex flex-col gap-2">
			{folders.map((folder) => (
				<FolderCard key={folder.id} folder={folder} />
			))}

			{folders.length > 0 && items.length > 0 && <div className="my-4 border-b border-border/50" />}

			{items.map((item) => (
				<ItemCard key={item.id} item={item} />
			))}
		</div>
	);
}
