import { SiteFavicon } from "@/components/site-favicon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Item } from "@/db/db";
import { viewParser } from "@/lib/search-params";
import { cn } from "@/lib/utils";
import { useItemStore, useMoveStore } from "@/stores";
import {
	CheckIcon,
	CopyIcon,
	Edit2Icon,
	ExternalLinkIcon,
	FolderInputIcon,
	HeartIcon,
	MoreVerticalIcon,
	RotateCcwIcon,
	Trash2Icon,
} from "lucide-react";
import { useQueryState } from "nuqs";
import { memo } from "react";
import { useItemActions } from "../hooks/use-item-actions";

export const ItemCard = memo(function ItemCard({ item }: { item: Item }) {
	const titleToDisplay = item.title || item.url;

	const toggleSelection = useItemStore((state) => state.toggleSelection);
	const isSelected = useItemStore((state) => state.selectedIds.includes(item.id));

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
			className={cn(
				"group flex items-center justify-between gap-3 rounded-md border border-transparent px-(--item-padding-x,0.75rem) py-(--item-padding-y,0.75rem) transition-colors corner-squircle hover:border-border hover:bg-card/50 supports-[corner-shape:squircle]:rounded-xl",
				isSelected && "bg-card/50 shadow-sm ring-1 ring-border",
				view === "trash" && "cursor-pointer",
			)}
			onClick={(e) => {
				if (view === "trash") {
					const target = e.target as HTMLElement;
					if (target.closest("button") || target.closest('[role="checkbox"]')) return;
					toggleSelection(item.id);
				}
			}}
		>
			<div className="flex min-w-0 flex-1 items-center gap-3">
				<Checkbox
					checked={isSelected}
					onCheckedChange={() => toggleSelection(item.id)}
					className={cn(
						"shrink-0 transition-opacity duration-200 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
						!isSelected &&
							"group-focus-within:opacity-100 md:opacity-0 md:group-hover:opacity-100 pointer-coarse:opacity-100",
					)}
				/>
				<a
					href={view === "trash" ? undefined : item.url}
					target={view === "trash" ? undefined : "_blank"}
					rel={view === "trash" ? undefined : "noopener noreferrer"}
					onClick={(e) => {
						if (view === "trash") e.preventDefault();
					}}
					className={cn(
						"flex min-w-0 flex-1 items-center gap-3 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
						view === "trash" && "cursor-pointer",
					)}
				>
					<SiteFavicon url={item.url} logo={item.logo} className="h-6 w-6 shrink-0" />
					<div className="flex flex-col overflow-hidden">
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
					</div>
				</a>
			</div>

			<div className="flex shrink-0 items-center gap-1 sm:gap-2">
				<div className="hidden shrink-0 items-center opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 md:flex">
					{view !== "trash" && (
						<>
							<Button
								variant="ghost"
								size="icon"
								className={cn(
									"h-8 w-8 transition-colors",
									isCopied
										? "text-emerald-600 hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/30"
										: "text-muted-foreground hover:text-foreground",
								)}
								onClick={handleCopy}
							>
								{isCopied ? (
									<CheckIcon className="h-4 w-4" aria-hidden="true" />
								) : (
									<CopyIcon className="h-4 w-4" aria-hidden="true" />
								)}
								<span className="sr-only">Copy URL</span>
							</Button>

							<Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleOpenLink}>
								<ExternalLinkIcon className="h-4 w-4 text-muted-foreground" />
								<span className="sr-only">Open Link</span>
							</Button>

							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8"
								onClick={handleToggleFavorite}
							>
								<HeartIcon
									className={cn(
										"h-4 w-4 transition-colors",
										item.isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground",
									)}
								/>
								<span className="sr-only">
									{item.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
								</span>
							</Button>

							<Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleEdit}>
								<Edit2Icon className="h-4 w-4 text-muted-foreground" />
								<span className="sr-only">Edit</span>
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
							{view !== "trash" && (
								<>
									<DropdownMenuItem
										onClick={handleCopy}
										className="cursor-pointer py-2.5 md:py-1.5"
									>
										<CopyIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/80" />
										<span className="text-[13px]">Copy URL</span>
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={handleOpenLink}
										className="cursor-pointer py-2.5 md:py-1.5"
									>
										<ExternalLinkIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/80" />
										<span className="text-[13px]">Open Link</span>
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={handleToggleFavorite}
										className="cursor-pointer py-2.5 md:py-1.5"
									>
										<HeartIcon
											className={cn(
												"mr-2 h-3.5 w-3.5",
												item.isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground/80",
											)}
										/>
										<span className={cn(item.isFavorite && "text-red-500")}>
											{item.isFavorite ? "Unfavorite" : "Favorite"}
										</span>
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={handleEdit}
										className="cursor-pointer py-2.5 md:py-1.5"
									>
										<Edit2Icon className="mr-2 h-3.5 w-3.5 text-muted-foreground/80" />
										<span className="text-[13px]">Edit</span>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => useMoveStore.getState().openMoveDialog({ itemIds: [item.id] })}
										className="cursor-pointer py-2.5 md:py-1.5"
									>
										<FolderInputIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/80" />
										<span className="text-[13px]">Move to...</span>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
								</>
							)}
							{view === "trash" ? (
								<>
									<DropdownMenuItem
										onClick={handleRestore}
										className="cursor-pointer py-2.5 md:py-1.5"
									>
										<RotateCcwIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/80" />
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
								<DropdownMenuItem
									onClick={handleSoftDelete}
									variant="destructive"
									className="cursor-pointer py-2.5 md:py-1.5"
								>
									<Trash2Icon className="mr-2 h-3.5 w-3.5 opacity-70" />
									<span className="text-[13px]">Delete</span>
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	);
});
