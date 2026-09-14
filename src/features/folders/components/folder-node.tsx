import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Folder } from "@/db/db";
import { cn } from "@/lib/utils";
import { useConfirmationStore } from "@/stores";
import { useFolderStore } from "@/stores";
import {
	ChevronDownIcon,
	ChevronRightIcon,
	EditIcon,
	FolderIcon,
	MoreHorizontalIcon,
	TrashIcon,
} from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";

interface FolderNodeProps {
	folder: Folder;
	allFolders: Folder[];
	depth?: number;
}

export function FolderNode({ folder, allFolders, depth = 0 }: FolderNodeProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const { openEditDialog, softDeleteFolders, selectedFolderIds } = useFolderStore();
	const { confirm } = useConfirmationStore();
	const [activeFolderId, setActiveFolderId] = useQueryState(
		"folder",
		parseAsString.withDefault(""),
	);

	const isActive = activeFolderId === folder.id;
	// We'll keep isSelected for potential future bulk actions, but highlight based on isActive
	const isSelected = selectedFolderIds.includes(folder.id);
	const children = allFolders
		.filter((f) => f.parentId === folder.id)
		.sort((a, b) => a.order - b.order);
	const hasChildren = children.length > 0;

	const handleToggleExpand = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsExpanded((prev) => !prev);
	};

	const handleSelect = () => {
		// Toggle the active folder. If already active, show all items (clear the param)
		if (isActive) {
			setActiveFolderId("");
		} else {
			setActiveFolderId(folder.id);
		}
	};

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		confirm({
			title: "Delete Folder",
			description: `Are you sure you want to delete "${folder.name}"? The folder and its contents will be moved to the Recycle Bin.`,
			confirmText: "Delete",
			cancelText: "Cancel",
			onConfirm: async () => {
				await softDeleteFolders([folder.id]);
			},
		});
	};

	return (
		<div className="flex w-full flex-col">
			<div
				role="button"
				tabIndex={0}
				className={cn(
					"group flex cursor-pointer items-center justify-between rounded-md border border-transparent px-2 py-1.5 transition-colors hover:bg-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
					isActive && "border-primary/20 bg-card",
					isSelected && "border-dashed bg-card/50", // Just in case bulk selection is ever used, give it a different style
				)}
				style={{ paddingLeft: `${depth * 12 + 8}px` }}
				onClick={handleSelect}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						handleSelect();
					}
				}}
			>
				<div className="flex items-center gap-2 overflow-hidden">
					<button
						type="button"
						onClick={handleToggleExpand}
						className={cn(
							"flex size-5 shrink-0 items-center justify-center rounded transition-colors hover:bg-black/5 dark:hover:bg-white/10",
							!hasChildren && "pointer-events-none opacity-0",
						)}
					>
						{isExpanded ? (
							<ChevronDownIcon className="size-3.5 text-muted-foreground" />
						) : (
							<ChevronRightIcon className="size-3.5 text-muted-foreground" />
						)}
					</button>
					<FolderIcon className="size-4 shrink-0 fill-amber-500/20 text-amber-500" />
					<span className="truncate text-sm text-foreground/90">{folder.name}</span>
				</div>

				<div className="flex items-center opacity-0 transition-opacity group-hover:opacity-100">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="size-6 h-6 w-6"
								onClick={(e) => e.stopPropagation()}
							>
								<MoreHorizontalIcon className="size-3.5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-36">
							<DropdownMenuItem
								onClick={(e) => {
									e.stopPropagation();
									openEditDialog(folder);
								}}
							>
								<EditIcon className="mr-2 size-3.5" />
								Rename
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="text-red-500 focus:bg-red-50 focus:text-red-500 dark:focus:bg-red-950/50"
								onClick={handleDelete}
							>
								<TrashIcon className="mr-2 size-3.5" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{isExpanded && hasChildren && (
				<div className="flex flex-col">
					{children.map((child) => (
						<FolderNode key={child.id} folder={child} allFolders={allFolders} depth={depth + 1} />
					))}
				</div>
			)}
		</div>
	);
}
