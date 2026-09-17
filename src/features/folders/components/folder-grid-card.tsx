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
import type { Folder } from "@/db/db";
import { useFolderActions } from "@/features/folders/hooks/use-folder-actions";
import { folderIdParser, viewParser } from "@/lib/search-params";
import { cn } from "@/lib/utils";
import { useFolderStore, useMoveStore } from "@/stores";
import { MoreVerticalIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { memo } from "react";

export const FolderGridCard = memo(
	function FolderGridCard({ folder }: { folder: Folder }) {
		const [view] = useQueryState("view", viewParser);

		const [_, setFolderId] = useQueryState("folder", folderIdParser);
		const isSelected = useFolderStore((state) => state.selectedFolderIds.includes(folder.id));
		const toggleSelection = useFolderStore((state) => state.toggleSelection);
		const openMoveDialog = useMoveStore((state) => state.openMoveDialog);

		const { handleEdit, handleSoftDelete, handleRestore, handleHardDelete, handleToggleFavorite } =
			useFolderActions(folder);

		return (
			<div
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
				className={cn(
					"group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border p-4 transition-colors corner-squircle hover:border-border hover:bg-card/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none supports-[corner-shape:squircle]:rounded-2xl",
					isSelected
						? "border-primary/20 bg-card/50 shadow-sm"
						: "border-transparent bg-transparent",
				)}
			>
				{/* Checkbox (Top Left) */}
				<div
					className={cn(
						"absolute top-2 left-2 z-10 transition-opacity duration-200",
						!isSelected &&
							"opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 pointer-coarse:opacity-100",
					)}
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					<Checkbox
						checked={isSelected}
						onCheckedChange={() => toggleSelection(folder.id)}
						className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
					/>
				</div>

				{/* Dropdown Menu (Top Right) */}
				<div
					className={cn(
						"absolute top-1 right-1 z-10 transition-opacity duration-200",
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
										onClick={handleEdit}
										className="cursor-pointer py-2.5 md:py-1.5"
									>
										<FolderEditIcon className="mr-2 h-3.5 w-3.5" />
										<span className="text-[13px]">Rename</span>
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => openMoveDialog({ folderIds: [folder.id] })}
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

				<FolderIcon className="size-12" />
				<div className="flex w-full items-center justify-center gap-1">
					{folder.isFavorite && (
						<CustomHeartFilledIcon className="size-3.5 shrink-0 text-red-500" />
					)}
					<span className="truncate text-center text-sm font-medium">{folder.name}</span>
				</div>
			</div>
		);
	},
	(prev, next) => prev.folder.updatedAt === next.folder.updatedAt,
);
