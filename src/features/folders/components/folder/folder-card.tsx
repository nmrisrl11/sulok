import {
	CustomHeartFilledIcon,
	CustomHeartIcon,
	FolderEditIcon,
	FolderIcon,
	TrashClockIcon,
	TrashUndoIcon,
	TrashXMarkIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Folder } from "@/db/db";
import { useActiveDragStore } from "@/features/folders/components/dnd/active-drag-store";
import { useFolderActions } from "@/features/folders/hooks/use-folder-actions";
import { folderIdParser, viewParser } from "@/lib/search-params";
import { cn, getTrashRetentionText } from "@/lib/utils";
import { useActionDrawerStore, useFolderStore, useTimeStore } from "@/stores";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { MoreHorizontalIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { memo } from "react";

export const FolderCard = memo(
	function FolderCard({
		folder,
		isOverlay,
		onNavigate,
	}: {
		folder: Folder;
		isOverlay?: boolean;
		onNavigate?: (id: string) => void;
	}) {
		const toggleSelection = useFolderStore((state) => state.toggleSelection);
		const isSelected = useFolderStore((state) => state.selectedFolderIds.includes(folder.id));
		const [, setFolderId] = useQueryState("folder", folderIdParser);
		const [view] = useQueryState("view", viewParser);
		const today = useTimeStore((state) => state.today);

		const { handleEdit, handleSoftDelete, handleRestore, handleHardDelete, handleToggleFavorite } =
			useFolderActions(folder);

		const {
			attributes,
			listeners,
			setNodeRef: setDragNodeRef,
			isDragging,
		} = useDraggable({
			id: `drag-${folder.id}`,
			data: { type: "folder", entity: folder },
			disabled: view === "trash",
		});

		const { setNodeRef: setDropNodeRef, isOver } = useDroppable({
			id: `drop-${folder.id}`,
			data: { type: "folder", folderId: folder.id },
			disabled: view === "trash",
		});

		const setNodeRef = (node: HTMLElement | null) => {
			setDragNodeRef(node);
			setDropNodeRef(node);
		};

		const isActiveBulk = useActiveDragStore(
			(state) =>
				!!(
					!isOverlay &&
					state.activeData?.isBulk &&
					state.activeData?.folderIds?.includes(folder.id)
				),
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
					"group touch-callout-none flex cursor-pointer items-center justify-between gap-3 rounded-md border border-transparent px-(--item-padding-x,0.75rem) py-(--item-padding-y,0.75rem) transition-colors select-none corner-squircle hover:border-border hover:bg-card/50 focus-visible:border-ring focus-visible:bg-card/50 focus-visible:outline-none supports-[corner-shape:squircle]:rounded-2xl",
					isSelected ? "border-border bg-card/50 shadow-sm" : "border-transparent bg-transparent",
					isEffectivelyDragging && "opacity-50",
					isOver && "border-primary bg-primary/10 shadow-sm",
				)}
				onClick={() => {
					if (view === "trash") {
						toggleSelection(folder.id);
					} else {
						if (onNavigate) onNavigate(folder.id);
						else setFolderId(folder.id);
					}
				}}
				onKeyDown={(e) => {
					listeners?.onKeyDown?.(e);
					if (e.target !== e.currentTarget) return;
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						if (view === "trash") {
							toggleSelection(folder.id);
						} else {
							if (onNavigate) onNavigate(folder.id);
							else setFolderId(folder.id);
						}
					}
				}}
			>
				<div className="flex min-w-0 flex-1 items-center gap-3">
					{!isOverlay && (
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
					)}
					<FolderIcon className="size-6 shrink-0" />
					<div className="flex flex-col items-start overflow-hidden">
						<span className="truncate text-sm font-medium text-foreground">{folder.name}</span>
						{view === "trash" && folder.deletedAt && (
							<span className="mt-1 truncate font-mono text-[11px] tracking-tight text-muted-foreground">
								{getTrashRetentionText(folder.deletedAt, today)}
							</span>
						)}
					</div>
				</div>

				{!isOverlay && (
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
												<span className="sr-only">
													{folder.isFavorite ? "Unfavorite" : "Favorite"}
												</span>
											</Button>
										</div>

										<div className="mx-0.5 h-4 w-px bg-border/50" />

										<div className="flex items-center">
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 hover:text-foreground"
												onClick={handleEdit}
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
							<Button
								variant="ghost"
								size="icon"
								className="h-11 w-11 text-muted-foreground"
								onClick={() => useActionDrawerStore.getState().openFolderDrawer(folder)}
							>
								<MoreHorizontalIcon className="h-4 w-4" />
								<span className="sr-only">Actions</span>
							</Button>
						</div>
					</div>
				)}
			</div>
		);
	},
	(prev, next) =>
		prev.folder.name === next.folder.name &&
		prev.folder.isFavorite === next.folder.isFavorite &&
		prev.isOverlay === next.isOverlay &&
		prev.onNavigate === next.onNavigate,
);
