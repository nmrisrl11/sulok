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
import type { Item } from "@/db/db";
import { FolderRepository } from "@/db/repositories/folder-repository";
import { folderIdParser, searchQueryParser, viewParser } from "@/lib/search-params";
import { cn } from "@/lib/utils";
import { useItemStore, useMoveStore } from "@/stores";
import { useDraggable } from "@dnd-kit/core";
import { useLiveQuery } from "dexie-react-hooks";
import { CheckIcon, MoreVerticalIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { memo } from "react";
import { useActiveDragStore } from "../../folders/components/dnd/active-drag-store";
import { useItemActions } from "../hooks/use-item-actions";

export const ItemCard = memo(
	function ItemCard({ item, isOverlay }: { item: Item; isOverlay?: boolean }) {
		const titleToDisplay = item.title || item.url;

		const toggleSelection = useItemStore((state) => state.toggleSelection);
		const isSelected = useItemStore((state) => state.selectedIds.includes(item.id));

		const [view] = useQueryState("view", viewParser);
		const [searchQuery, setSearchQuery] = useQueryState("q", searchQueryParser);
		const [, setFolderId] = useQueryState("folder", folderIdParser);

		const parentFolder = useLiveQuery(
			() => (item.folderId ? FolderRepository.getById(item.folderId) : undefined),
			[item.folderId],
		);

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
					"group flex cursor-pointer items-center justify-between gap-3 rounded-md border border-transparent px-(--item-padding-x,0.75rem) py-(--item-padding-y,0.75rem) transition-colors corner-squircle hover:border-border hover:bg-card/50 focus-visible:border-ring focus-visible:bg-card/50 focus-visible:outline-none supports-[corner-shape:squircle]:rounded-2xl",
					isSelected ? "border-border bg-card/50 shadow-sm" : "border-transparent bg-transparent",
					isEffectivelyDragging && "opacity-50",
				)}
				onClick={(e) => {
					const target = e.target as HTMLElement;
					if (target.closest("button") || target.closest('[role="checkbox"]')) return;
					if (view !== "trash" && target.closest("a")) return;

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
				<div className="flex min-w-0 flex-1 items-center gap-3">
					{!isOverlay && (
						<Checkbox
							checked={isSelected}
							onCheckedChange={() => toggleSelection(item.id)}
							className={cn(
								"shrink-0 transition-opacity duration-200 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
								!isSelected &&
									"group-focus-within:opacity-100 md:opacity-0 md:group-hover:opacity-100 pointer-coarse:opacity-100",
							)}
						/>
					)}
					<div className="flex min-w-0 flex-1 items-center gap-3">
						<a
							href={view === "trash" ? undefined : item.url}
							target={view === "trash" ? undefined : "_blank"}
							rel={view === "trash" ? undefined : "noopener noreferrer"}
							onClick={(e) => {
								if (view === "trash") e.preventDefault();
							}}
							className={cn(
								"shrink-0 rounded-sm focus-visible:outline-none",
								!item.logo && "flex size-10 items-center justify-center bg-muted/50",
							)}
							tabIndex={-1}
							aria-hidden="true"
						>
							<SiteFavicon url={item.url} logo={item.logo} className="h-6 w-6" />
						</a>
						<div className="flex flex-col items-start overflow-hidden">
							<a
								href={view === "trash" ? undefined : item.url}
								target={view === "trash" ? undefined : "_blank"}
								rel={view === "trash" ? undefined : "noopener noreferrer"}
								onClick={(e) => {
									if (view === "trash") e.preventDefault();
								}}
								className={cn(
									"flex flex-col rounded-sm focus-visible:outline-none",
									view === "trash" && "cursor-pointer",
								)}
								tabIndex={-1}
							>
								<span
									className={cn(
										"line-clamp-2 text-sm font-medium text-foreground",
										view !== "trash" &&
											"decoration-muted-foreground/30 underline-offset-4 hover:underline",
									)}
								>
									{titleToDisplay}
								</span>
								{item.title && item.title !== item.url && (
									<span className="truncate font-mono text-[11px] tracking-tight text-muted-foreground">
										{item.url}
									</span>
								)}
							</a>
							{searchQuery && view !== "trash" && (
								<button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										setSearchQuery(null);
										setFolderId(item.folderId || null);
									}}
									className="mt-1.5 flex w-fit items-center gap-1.5 rounded-md border border-border/50 bg-secondary/50 px-2 py-0.5 text-[11px] font-medium text-secondary-foreground transition-colors corner-squircle hover:bg-secondary hover:text-foreground supports-[corner-shape:squircle]:rounded-xl"
								>
									<FolderIcon className="h-3 w-3 shrink-0 text-muted-foreground" />
									<span className="truncate">{parentFolder?.name || "Library"}</span>
								</button>
							)}
						</div>
					</div>
				</div>

				{!isOverlay && (
					<div className="flex shrink-0 items-center gap-1 sm:gap-2">
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
													isCopied
														? "text-emerald-600 hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/30"
														: "hover:text-foreground",
												)}
												onClick={handleCopy}
											>
												{isCopied ? (
													<CheckIcon className="h-4 w-4" aria-hidden="true" />
												) : (
													<CopyIcon className="h-4 w-4" aria-hidden="true" />
												)}
												<span className="sr-only">{isCopied ? "Copied" : "Copy URL"}</span>
											</Button>

											<Button variant="ghost" size="icon" className="h-8 w-8" asChild>
												<a href={item.url} target="_blank" rel="noopener noreferrer">
													<ExternalLinkIcon className="h-4 w-4" />
													<span className="sr-only">Open Link</span>
												</a>
											</Button>
										</div>

										<div className="mx-0.5 h-4 w-px bg-border/50" />

										<div className="flex items-center">
											<Button
												variant="ghost"
												size="icon"
												className={cn(
													"h-8 w-8 transition-colors",
													item.isFavorite
														? "text-red-500 hover:bg-red-500/10 hover:text-red-600"
														: "hover:text-foreground",
												)}
												onClick={handleToggleFavorite}
											>
												{item.isFavorite ? (
													<CustomHeartFilledIcon className="h-4 w-4" />
												) : (
													<CustomHeartIcon className="h-4 w-4" />
												)}
												<span className="sr-only">
													{item.isFavorite ? "Unfavorite" : "Favorite"}
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
												<FileEditIcon className="h-4 w-4" />
												<span className="sr-only">Edit</span>
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
									{view !== "trash" && (
										<>
											<DropdownMenuItem
												onClick={handleCopy}
												className="cursor-pointer py-2.5 md:py-1.5"
											>
												<CopyIcon className="mr-2 h-3.5 w-3.5" />
												<span className="text-[13px]">Copy URL</span>
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
												onClick={() =>
													useMoveStore.getState().openMoveDialog({ itemIds: [item.id] })
												}
												className="cursor-pointer py-2.5 md:py-1.5"
											>
												<MoveToFolderIcon className="mr-2 h-3.5 w-3.5" />
												<span className="text-[13px]">Move to...</span>
											</DropdownMenuItem>
										</>
									)}
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
										<DropdownMenuItem
											onClick={handleSoftDelete}
											variant="destructive"
											className="cursor-pointer py-2.5 md:py-1.5"
										>
											<TrashClockIcon className="mr-2 h-3.5 w-3.5" />
											<span className="text-[13px]">Delete</span>
										</DropdownMenuItem>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				)}
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
