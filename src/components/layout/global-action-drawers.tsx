import {
	CopyIcon,
	CustomHeartIcon,
	CustomHeartSlashIcon,
	ExternalLinkIcon,
	FileEditIcon,
	FolderEditIcon,
	FolderIcon,
	MoveToFolderIcon,
	TrashClockIcon,
	TrashUndoIcon,
	TrashXMarkIcon,
} from "@/components/icons";
import { SiteFavicon } from "@/components/site-favicon";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import type { Folder, Item } from "@/db/db";
import { useFolderActions } from "@/features/folders/hooks/use-folder-actions";
import { useItemActions } from "@/features/items/hooks/use-item-actions";
import { viewParser } from "@/lib/search-params";
import { cn, getTrashRetentionText } from "@/lib/utils";
import { useActionDrawerStore, useMoveStore, useTimeStore } from "@/stores";
import { useQueryState } from "nuqs";

function ActionRow({
	icon: Icon,
	label,
	onClick,
	variant = "default",
	iconClassName,
	labelClassName,
}: {
	icon: React.ElementType;
	label: string;
	onClick: () => void;
	variant?: "default" | "destructive";
	iconClassName?: string;
	labelClassName?: string;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors active:bg-muted/50 md:hover:bg-muted/50",
				variant === "destructive"
					? "text-destructive active:bg-destructive/10 md:hover:bg-destructive/10"
					: "text-foreground",
			)}
		>
			<Icon className={cn("h-5 w-5", iconClassName)} />
			<span className={cn("text-[15px] font-medium", labelClassName)}>{label}</span>
		</button>
	);
}

function ItemActionDrawerContent({ item, onClose }: { item: Item; onClose: () => void }) {
	const [view] = useQueryState("view", viewParser);
	const today = useTimeStore((state) => state.today);
	const {
		handleCopy,
		handleEdit,
		handleSoftDelete,
		handleRestore,
		handleHardDelete,
		handleOpenLink,
		handleToggleFavorite,
	} = useItemActions(item);

	const runAction = (action: () => void) => {
		action();
		onClose();
	};

	const titleToDisplay = item.title || item.url;

	return (
		<div className="flex flex-col px-4 pt-4 pb-8 sm:pb-6">
			<div className="mb-4 flex items-center gap-3 border-b border-border/50 pb-4">
				<div className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-muted/50">
					<SiteFavicon url={item.url} logo={item.logo} className="h-6 w-6" />
				</div>
				<div className="flex min-w-0 flex-col">
					<DrawerTitle className="line-clamp-2 text-sm font-medium text-foreground">
						{titleToDisplay}
					</DrawerTitle>
					{item.title && item.title !== item.url && (
						<span className="truncate font-mono text-[11px] tracking-tight text-muted-foreground">
							{item.url}
						</span>
					)}
					{view === "trash" && item.deletedAt && (
						<span className="mt-1 truncate font-mono text-[11px] tracking-tight text-muted-foreground">
							{getTrashRetentionText(item.deletedAt, today)}
						</span>
					)}
				</div>
			</div>

			<div className="flex flex-col gap-1">
				{view !== "trash" ? (
					<>
						<ActionRow icon={CopyIcon} label="Copy URL" onClick={() => runAction(handleCopy)} />
						<ActionRow
							icon={ExternalLinkIcon}
							label="Open Link"
							onClick={() => runAction(handleOpenLink)}
						/>
						<ActionRow
							icon={item.isFavorite ? CustomHeartSlashIcon : CustomHeartIcon}
							iconClassName={item.isFavorite ? "text-red-500" : ""}
							label={item.isFavorite ? "Unfavorite" : "Favorite"}
							labelClassName={item.isFavorite ? "text-red-500" : ""}
							onClick={() => runAction(handleToggleFavorite)}
						/>
						<ActionRow icon={FileEditIcon} label="Edit" onClick={() => runAction(handleEdit)} />
						<ActionRow
							icon={MoveToFolderIcon}
							label="Move to..."
							onClick={() => {
								useMoveStore.getState().openMoveDialog({ itemIds: [item.id] });
								onClose();
							}}
						/>
						<ActionRow
							icon={TrashClockIcon}
							label="Delete"
							variant="destructive"
							onClick={() => runAction(handleSoftDelete)}
						/>
					</>
				) : (
					<>
						<ActionRow
							icon={TrashUndoIcon}
							label="Restore"
							onClick={() => runAction(handleRestore)}
						/>
						<ActionRow
							icon={TrashXMarkIcon}
							label="Delete Forever"
							variant="destructive"
							onClick={() => runAction(handleHardDelete)}
						/>
					</>
				)}
			</div>
		</div>
	);
}

function FolderActionDrawerContent({ folder, onClose }: { folder: Folder; onClose: () => void }) {
	const { handleEdit, handleSoftDelete, handleRestore, handleHardDelete, handleToggleFavorite } =
		useFolderActions(folder);
	const [view] = useQueryState("view", viewParser);
	const today = useTimeStore((state) => state.today);

	const runAction = (action: () => void) => {
		action();
		onClose();
	};

	return (
		<div className="flex flex-col px-4 pt-4 pb-8 sm:pb-6">
			<div className="mb-4 flex items-center gap-3 border-b border-border/50 pb-4">
				<div className="flex size-10 shrink-0 items-center justify-center">
					<FolderIcon className="h-8 w-8 text-muted-foreground" />
				</div>
				<div className="flex min-w-0 flex-col">
					<DrawerTitle className="truncate text-sm font-medium text-foreground">
						{folder.name}
					</DrawerTitle>
					{view === "trash" && folder.deletedAt && (
						<span className="mt-1 truncate font-mono text-[11px] tracking-tight text-muted-foreground">
							{getTrashRetentionText(folder.deletedAt, today)}
						</span>
					)}
				</div>
			</div>

			<div className="flex flex-col gap-1">
				{view !== "trash" ? (
					<>
						<ActionRow
							icon={folder.isFavorite ? CustomHeartSlashIcon : CustomHeartIcon}
							iconClassName={folder.isFavorite ? "text-red-500" : ""}
							label={folder.isFavorite ? "Unfavorite" : "Favorite"}
							labelClassName={folder.isFavorite ? "text-red-500" : ""}
							onClick={() => runAction(handleToggleFavorite)}
						/>
						<ActionRow icon={FolderEditIcon} label="Rename" onClick={() => runAction(handleEdit)} />
						<ActionRow
							icon={MoveToFolderIcon}
							label="Move to..."
							onClick={() => {
								useMoveStore.getState().openMoveDialog({ folderIds: [folder.id] });
								onClose();
							}}
						/>
						<ActionRow
							icon={TrashClockIcon}
							label="Delete"
							variant="destructive"
							onClick={() => runAction(handleSoftDelete)}
						/>
					</>
				) : (
					<>
						<ActionRow
							icon={TrashUndoIcon}
							label="Restore"
							onClick={() => runAction(handleRestore)}
						/>
						<ActionRow
							icon={TrashXMarkIcon}
							label="Delete Forever"
							variant="destructive"
							onClick={() => runAction(handleHardDelete)}
						/>
					</>
				)}
			</div>
		</div>
	);
}

export function GlobalActionDrawers() {
	const {
		isItemDrawerOpen,
		isFolderDrawerOpen,
		activeItem,
		activeFolder,
		closeItemDrawer,
		closeFolderDrawer,
	} = useActionDrawerStore();

	return (
		<>
			<Drawer open={isItemDrawerOpen} onOpenChange={(open) => !open && closeItemDrawer()}>
				<DrawerContent className="sm:mx-auto sm:max-w-sm">
					{activeItem && <ItemActionDrawerContent item={activeItem} onClose={closeItemDrawer} />}
				</DrawerContent>
			</Drawer>

			<Drawer open={isFolderDrawerOpen} onOpenChange={(open) => !open && closeFolderDrawer()}>
				<DrawerContent className="sm:mx-auto sm:max-w-sm">
					{activeFolder && (
						<FolderActionDrawerContent folder={activeFolder} onClose={closeFolderDrawer} />
					)}
				</DrawerContent>
			</Drawer>
		</>
	);
}
