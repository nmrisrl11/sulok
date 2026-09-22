import {
	CopyIcon,
	CustomHeartFilledIcon,
	CustomHeartIcon,
	CustomHeartSlashIcon,
	ExternalLinkIcon,
	FileEditIcon,
	FolderIcon,
	MoveToFolderIcon,
	TrashClockIcon,
	TrashUndoIcon,
	TrashXMarkIcon,
} from "@/components/icons";
import { SiteFavicon } from "@/components/site-favicon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Folder, Item } from "@/db/db";
import { FolderRepository } from "@/db/repositories/folder-repository";
import { folderIdParser, searchQueryParser, viewParser } from "@/lib/search-params";
import { cn, getTrashRetentionText } from "@/lib/utils";
import { useItemStore, useMoveStore, useTimeStore } from "@/stores";
import { useDraggable } from "@dnd-kit/core";
import { CheckIcon, MoreVerticalIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { memo, useEffect, useState } from "react";
import { useActiveDragStore } from "../../folders/components/dnd/active-drag-store";
import { useItemActions } from "../hooks/use-item-actions";

const folderCache = new Map<string, Folder | null>();

export const ItemGridCard = memo(
	function ItemGridCard({ item, isOverlay }: { item: Item; isOverlay?: boolean }) {
		const titleToDisplay = item.title || item.url;

		const toggleSelection = useItemStore((state) => state.toggleSelection);
		const isSelected = useItemStore((state) => state.selectedIds.includes(item.id));
		const openMoveDialog = useMoveStore((state) => state.openMoveDialog);

		const [view] = useQueryState("view", viewParser);
		const [searchQuery, setSearchQuery] = useQueryState("q", searchQueryParser);
		const [, setFolderId] = useQueryState("folder", folderIdParser);
		const today = useTimeStore((state) => state.today);

		const [prevFolderId, setPrevFolderId] = useState<string | undefined>(item.folderId);
		const [parentFolder, setParentFolder] = useState<Folder | null>(() =>
			item.folderId ? folderCache.get(item.folderId) || null : null,
		);

		if (item.folderId !== prevFolderId) {
			setPrevFolderId(item.folderId);
			if (!item.folderId) {
				setParentFolder(null);
			} else if (folderCache.has(item.folderId)) {
				setParentFolder(folderCache.get(item.folderId) || null);
			}
		}

		useEffect(() => {
			if (!item.folderId || folderCache.has(item.folderId)) return;
			let isMounted = true;
			FolderRepository.getById(item.folderId).then((folder) => {
				folderCache.set(item.folderId!, folder || null);
				if (isMounted) setParentFolder(folder || null);
			});
			return () => {
				isMounted = false;
			};
		}, [item.folderId]);

		const {
			isCopied,
			handleCopy,
			handleEdit,
			handleSoftDelete,
			handleRestore,
			handleHardDelete,
			handleOpenLink,
			handleToggleFavorite,
		} = useItemActions(item);

		const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
			id: `drag-${item.id}`,
			data: { type: "item", entity: item },
			disabled: view === "trash",
		});

		const isActiveBulk = useActiveDragStore(
			(state) =>
				!!(!isOverlay && state.activeData?.isBulk && state.activeData?.itemIds?.includes(item.id)),
		);
		const isEffectivelyDragging = isDragging || isActiveBulk;

		return (
			<div
				ref={setNodeRef}
				{...attributes}
				{...listeners}
				role="button"
				tabIndex={0}
				className={cn(
					"group touch-callout-none relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border p-4 transition-colors select-none corner-squircle hover:border-border hover:bg-card/50 focus-visible:border-ring focus-visible:bg-card/50 focus-visible:outline-none supports-[corner-shape:squircle]:rounded-2xl",
					isSelected
						? "border-primary/20 bg-card/50 shadow-sm"
						: "border-transparent bg-transparent",
					isEffectivelyDragging && "opacity-50",
				)}
				onClick={(e) => {
					const target = e.target as HTMLElement;
					if (e.target !== e.currentTarget) {
						if (
							target.closest("button") ||
							target.closest('[role="checkbox"]') ||
							target.closest('[role="button"]') ||
							target.closest(".item-actions")
						) {
							return;
						}
					}

					if (view === "trash") {
						toggleSelection(item.id);
					} else {
						window.open(item.url, "_blank", "noopener,noreferrer");
					}
				}}
				onKeyDown={(e) => {
					listeners?.onKeyDown?.(e);
					if (e.target !== e.currentTarget) return;
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						if (view === "trash") {
							toggleSelection(item.id);
						} else {
							window.open(item.url, "_blank", "noopener,noreferrer");
						}
					}
				}}
			>
				{/* Checkbox (Top Left) */}
				{!isOverlay && (
					<div
						className={cn(
							"item-actions absolute top-2 left-2 z-10 transition-opacity duration-200",
							!isSelected &&
								"opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 pointer-coarse:opacity-100",
						)}
						onClick={(e) => {
							e.stopPropagation();
						}}
					>
						<Checkbox
							checked={isSelected}
							onCheckedChange={() => toggleSelection(item.id)}
							className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
						/>
					</div>
				)}

				{/* Dropdown Menu (Top Right) */}
				{!isOverlay && (
					<div
						className={cn(
							"item-actions absolute top-1 right-1 z-10 transition-opacity duration-200",
							!isSelected &&
								"opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 pointer-coarse:opacity-100",
						)}
						onClick={(e) => e.stopPropagation()}
					>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 text-muted-foreground hover:text-foreground"
								>
									<MoreVerticalIcon className="h-4 w-4" />
									<span className="sr-only">Actions</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="w-40"
								onClick={(e) => e.stopPropagation()}
							>
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
											onClick={handleCopy}
											className="cursor-pointer py-2.5 md:py-1.5"
										>
											{isCopied ? (
												<CheckIcon className="mr-2 h-3.5 w-3.5 text-green-500" />
											) : (
												<CopyIcon className="mr-2 h-3.5 w-3.5" />
											)}
											<span className="text-[13px]">{isCopied ? "Copied" : "Copy URL"}</span>
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={handleOpenLink}
											className="cursor-pointer py-2.5 md:py-1.5"
										>
											<ExternalLinkIcon className="mr-2 h-3.5 w-3.5" />
											<span className="text-[13px]">Open Link</span>
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={handleToggleFavorite}
											className="cursor-pointer py-2.5 md:py-1.5"
										>
											{item.isFavorite ? (
												<CustomHeartSlashIcon className="mr-2 h-3.5 w-3.5 text-red-500" />
											) : (
												<CustomHeartIcon className="mr-2 h-3.5 w-3.5" />
											)}
											<span className={cn(item.isFavorite && "text-red-500", "text-[13px]")}>
												{item.isFavorite ? "Unfavorite" : "Favorite"}
											</span>
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={handleEdit}
											className="cursor-pointer py-2.5 md:py-1.5"
										>
											<FileEditIcon className="mr-2 h-3.5 w-3.5" />
											<span className="text-[13px]">Edit</span>
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => openMoveDialog({ itemIds: [item.id] })}
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
				)}

				<div
					role="button"
					tabIndex={-1}
					aria-hidden="true"
					onClick={() => {
						if (view === "trash") {
							toggleSelection(item.id);
						} else {
							window.open(item.url, "_blank", "noopener,noreferrer");
						}
					}}
					className="flex size-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-muted/50 outline-none focus-visible:outline-none"
				>
					<SiteFavicon url={item.url} logo={item.logo} className="h-6 w-6" />
				</div>

				<div className="flex w-full min-w-0 flex-col items-center justify-center gap-1">
					<div
						role="button"
						tabIndex={-1}
						aria-hidden="true"
						onClick={() => {
							if (view === "trash") {
								toggleSelection(item.id);
							} else {
								window.open(item.url, "_blank", "noopener,noreferrer");
							}
						}}
						className="flex w-full min-w-0 cursor-pointer items-center justify-center gap-1 rounded-sm px-1 outline-none focus-visible:outline-none"
					>
						{item.isFavorite && (
							<CustomHeartFilledIcon className="size-3.5 shrink-0 text-red-500" />
						)}
						<span className="truncate text-center text-sm font-medium">{titleToDisplay}</span>
					</div>
					{view === "trash" && item.deletedAt && (
						<span className="mt-0.5 truncate text-center font-mono text-[10px] text-muted-foreground">
							{getTrashRetentionText(item.deletedAt, today)}
						</span>
					)}
					{searchQuery && view !== "trash" && (
						<button
							type="button"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								setSearchQuery(null);
								setFolderId(item.folderId || null);
							}}
							className="mt-1 flex max-w-[90%] items-center justify-center gap-1.5 rounded-md border border-border/50 bg-secondary/50 px-2 py-0.5 text-[11px] font-medium text-secondary-foreground transition-colors corner-squircle hover:bg-secondary hover:text-foreground supports-[corner-shape:squircle]:rounded-xl"
						>
							<FolderIcon className="h-3 w-3 shrink-0 text-muted-foreground" />
							<span className="truncate">{parentFolder?.name || "Library"}</span>
						</button>
					)}
				</div>
			</div>
		);
	},
	(prev, next) =>
		prev.item.title === next.item.title &&
		prev.item.url === next.item.url &&
		prev.item.logo === next.item.logo &&
		prev.item.isFavorite === next.item.isFavorite &&
		prev.item.folderId === next.item.folderId &&
		prev.isOverlay === next.isOverlay,
);
