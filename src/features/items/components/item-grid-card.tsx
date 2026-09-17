import { SiteFavicon } from "@/components/site-favicon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
	CopyIcon,
	CustomHeartFilledIcon,
	CustomHeartIcon,
	CustomHeartSlashIcon,
	ExternalLinkIcon,
	FileEditIcon,
	MoveToFolderIcon,
	TrashClockIcon,
	TrashUndoIcon,
	TrashXMarkIcon,
} from "@/components/icons";
import type { Item } from "@/db/db";
import { viewParser } from "@/lib/search-params";
import { cn } from "@/lib/utils";
import { useItemStore, useMoveStore } from "@/stores";
import { CheckIcon, MoreVerticalIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { memo } from "react";
import { useItemActions } from "../hooks/use-item-actions";

export const ItemGridCard = memo(
	function ItemGridCard({ item }: { item: Item }) {
		const titleToDisplay = item.title || item.url;

		const toggleSelection = useItemStore((state) => state.toggleSelection);
		const isSelected = useItemStore((state) => state.selectedIds.includes(item.id));
		const openMoveDialog = useMoveStore((state) => state.openMoveDialog);

		const [view] = useQueryState("view", viewParser);

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

		return (
			<div
				role="button"
				tabIndex={0}
				onClick={(e) => {
					if (view === "trash") {
						const target = e.target as HTMLElement;
						if (target.closest(".item-actions")) return;
						toggleSelection(item.id);
					} else {
						window.open(item.url, "_blank", "noopener,noreferrer");
					}
				}}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						if (view === "trash") {
							toggleSelection(item.id);
						} else {
							window.open(item.url, "_blank", "noopener,noreferrer");
						}
					}
				}}
				className={cn(
					"group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border p-4 transition-colors corner-squircle hover:border-border hover:bg-card/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none supports-[corner-shape:squircle]:rounded-2xl",
					isSelected
						? "border-primary/20 bg-card/50 shadow-sm"
						: "border-transparent bg-transparent",
					view === "trash" && "cursor-pointer",
				)}
			>
				{/* Checkbox (Top Left) */}
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

				{/* Dropdown Menu (Top Right) */}
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
						<DropdownMenuContent align="end" className="w-40" onClick={(e) => e.stopPropagation()}>
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

				<div className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-muted/50">
					<SiteFavicon url={item.url} logo={item.logo} className="h-6 w-6" />
				</div>

				<div className="flex w-full items-center justify-center gap-1">
					{item.isFavorite && <CustomHeartFilledIcon className="size-3.5 shrink-0 text-red-500" />}
					<span className="truncate text-center text-sm font-medium">{titleToDisplay}</span>
				</div>
			</div>
		);
	},
	(prev, next) => prev.item.updatedAt === next.item.updatedAt,
);
