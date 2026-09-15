import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Folder, type Item } from "@/db/db";
import { ItemCard } from "@/features/items/components/item-card";
import { notify } from "@/lib/notify";
import { folderIdParser, viewModeParser, viewParser } from "@/lib/search-params";
import { cn } from "@/lib/utils";
import { useConfirmationStore, useFolderStore, useMoveStore } from "@/stores";
import {
	Edit2Icon,
	FolderIcon,
	FolderInputIcon,
	MoreVerticalIcon,
	RotateCcwIcon,
	StarIcon,
	Trash2Icon,
} from "lucide-react";
import { useQueryState } from "nuqs";
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
				isSelected && "bg-card/50 shadow-sm ring-1 ring-border",
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
				<FolderIcon className="size-6 shrink-0 fill-primary/20 text-primary" />
				<span className="truncate text-sm font-medium text-foreground">{folder.name}</span>
			</div>

			<div
				className="flex shrink-0 items-center gap-1 sm:gap-2"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="hidden shrink-0 items-center opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 md:flex">
					{view !== "trash" && (
						<>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8"
								onClick={handleToggleFavorite}
							>
								<StarIcon
									className={cn(
										"h-4 w-4 transition-colors",
										folder.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
									)}
								/>
								<span className="sr-only">
									{folder.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
								</span>
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8"
								onClick={() => openEditDialog(folder)}
							>
								<Edit2Icon className="h-4 w-4 text-muted-foreground" />
								<span className="sr-only">Rename</span>
							</Button>
						</>
					)}

					{view === "trash" ? (
						<>
							<Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRestore}>
								<RotateCcwIcon className="h-4 w-4 text-muted-foreground" />
								<span className="sr-only">Restore</span>
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 hover:text-destructive"
								onClick={handleHardDelete}
							>
								<Trash2Icon className="h-4 w-4" />
								<span className="sr-only">Delete Forever</span>
							</Button>
						</>
					) : (
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 hover:text-destructive"
							onClick={handleSoftDelete}
						>
							<Trash2Icon className="h-4 w-4" />
							<span className="sr-only">Delete</span>
						</Button>
					)}
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
										<RotateCcwIcon className="mr-2 h-3.5 w-3.5 opacity-70" />
										<span className="text-[13px]">Restore</span>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={handleHardDelete}
										variant="destructive"
										className="cursor-pointer py-2.5 md:py-1.5"
									>
										<Trash2Icon className="mr-2 h-3.5 w-3.5 opacity-70" />
										<span className="text-[13px] whitespace-nowrap">Delete Forever</span>
									</DropdownMenuItem>
								</>
							) : (
								<>
									<DropdownMenuItem
										onClick={handleToggleFavorite}
										className="cursor-pointer py-2.5 md:py-1.5"
									>
										<StarIcon
											className={cn(
												"mr-2 h-3.5 w-3.5",
												folder.isFavorite
													? "fill-yellow-400 text-yellow-400"
													: "text-muted-foreground/80",
											)}
										/>
										<span className="text-[13px]">
											{folder.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
										</span>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => openEditDialog(folder)}
										className="cursor-pointer py-2.5 md:py-1.5"
									>
										<Edit2Icon className="mr-2 h-3.5 w-3.5 text-muted-foreground/80" />
										<span className="text-[13px]">Rename</span>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() =>
											useMoveStore.getState().openMoveDialog({ folderIds: [folder.id] })
										}
										className="cursor-pointer py-2.5 md:py-1.5"
									>
										<FolderInputIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/80" />
										<span className="text-[13px]">Move to...</span>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={handleSoftDelete}
										variant="destructive"
										className="cursor-pointer py-2.5 md:py-1.5"
									>
										<Trash2Icon className="mr-2 h-3.5 w-3.5 opacity-70" />
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
	const [_, setFolderId] = useQueryState("folder", folderIdParser);
	const [view] = useQueryState("view", viewParser);
	const { toggleSelection } = useFolderStore();

	if (isLoading) {
		return (
			<div className="animate-pulse py-8 text-center text-sm text-muted-foreground">Loading...</div>
		);
	}

	const isEmpty = folders.length === 0 && items.length === 0;

	if (isEmpty) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-center">
				<div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted/50">
					<FolderIcon className="size-8 text-muted-foreground" />
				</div>
				<h3 className="mb-1 text-lg font-medium text-foreground">This folder is empty</h3>
				<p className="text-sm text-muted-foreground">
					Add links or create new folders to get started.
				</p>
			</div>
		);
	}

	if (viewMode === "grid") {
		return (
			<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
				{folders.map((folder) => (
					<div
						key={folder.id}
						role="button"
						tabIndex={0}
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
						className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border p-4 transition-colors corner-squircle hover:bg-card/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
					>
						<FolderIcon className="size-12 fill-primary/20 text-primary" />
						<div className="flex w-full items-center justify-center gap-1">
							{folder.isFavorite && (
								<StarIcon className="size-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
							)}
							<span className="truncate text-center text-sm font-medium">{folder.name}</span>
						</div>
					</div>
				))}
				{items.map((item) => (
					<div
						key={item.id}
						role="button"
						tabIndex={0}
						onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								window.open(item.url, "_blank", "noopener,noreferrer");
							}
						}}
						className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border p-4 transition-colors corner-squircle hover:bg-card/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
					>
						<div className="flex size-12 items-center justify-center rounded-full bg-muted/50">
							<span className="text-xs text-muted-foreground">Link</span>
						</div>
						<div className="flex w-full items-center justify-center gap-1">
							{item.isFavorite && (
								<StarIcon className="size-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
							)}
							<span className="truncate text-center text-sm font-medium">
								{item.title || item.url}
							</span>
						</div>
					</div>
				))}
			</div>
		);
	}

	// Default List View
	return (
		<div className="flex flex-col gap-1">
			{folders.map((folder) => (
				<FolderCard key={folder.id} folder={folder} />
			))}

			{folders.length > 0 && items.length > 0 && <div className="my-2 border-b border-border/50" />}

			{items.map((item) => (
				<ItemCard key={item.id} item={item} />
			))}
		</div>
	);
}
