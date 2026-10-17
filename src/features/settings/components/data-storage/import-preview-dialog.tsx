import { FolderIcon, NoteIcon } from "@/components/icons";
import { SiteFavicon } from "@/components/site-favicon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { FolderRepository } from "@/db/repositories/folder-repository";
import { ItemRepository } from "@/db/repositories/item-repository";
import type {
	ParsedImportData,
	ParsedImportFolder,
	ParsedImportItem,
} from "@/features/settings/utils/import-utils";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { AlertCircleIcon, InfoIcon } from "lucide-react";
import { memo, useCallback, useDeferredValue, useMemo, useState } from "react";

interface ImportPreviewDialogProps {
	isOpen: boolean;
	onClose: (success?: boolean) => void;
	data: ParsedImportData;
	onImportingChange?: (isImporting: boolean) => void;
}

type TreeNode =
	| {
			type: "folder";
			id: string;
			depth: number;
			data: ParsedImportFolder;
	  }
	| {
			type: "item";
			id: string;
			depth: number;
			data: ParsedImportItem;
	  };

interface TreeData {
	nodes: TreeNode[];
	foldersById: Map<string, ParsedImportFolder>;
	itemsById: Map<string, ParsedImportItem>;
	folderDescendantItemIdsMap: Map<string, string[]>;
	folderDescendantFolderIdsMap: Map<string, string[]>;
	folderDescendantEmptyFolderIdsMap: Map<string, string[]>;
	emptyFolderIds: Set<string>;
	itemAncestorFolderIdsMap: Map<string, string[]>;
	folderAncestorFolderIdsMap: Map<string, string[]>;
	allSelectableItemIds: string[];
	allSelectableFolderIds: string[];
	allSelectableEmptyFolderIds: string[];
	folderDirectItemCountMap: Map<string, number>;
	folderSelectableDescendantItemCountMap: Map<string, number>;
}

interface ImportPreviewFolderRowProps {
	folder: ParsedImportFolder;
	depth: number;
	checkState: "checked" | "unchecked" | "indeterminate";
	hasSelectableContent: boolean;
	itemCount: number;
	onToggle: (id: string) => void;
}

const ImportPreviewFolderRow = memo(function ImportPreviewFolderRow({
	folder,
	depth,
	checkState,
	hasSelectableContent,
	itemCount,
	onToggle,
}: ImportPreviewFolderRowProps) {
	const depthPadding = depth * 24;
	const isDuplicate = folder.isDuplicate;
	const isDisabled = !hasSelectableContent && isDuplicate;

	const handleCheckboxChange = () => {
		if (isDisabled || !folder.id) return;
		onToggle(folder.id);
	};

	const handleRowClick = () => {
		if (isDisabled || !folder.id) return;
		onToggle(folder.id);
	};

	return (
		<div style={{ paddingLeft: `${depthPadding}px` }} className="h-full">
			<div
				onClick={!isDisabled ? handleRowClick : undefined}
				className={cn(
					"flex items-center justify-between gap-3 rounded-md border p-2 transition-colors corner-squircle supports-[corner-shape:squircle]:rounded-xl",
					isDuplicate
						? "border-transparent bg-muted/30 opacity-50 grayscale"
						: "cursor-pointer bg-card hover:bg-card/80",
				)}
			>
				<div className="flex min-w-0 flex-1 items-center gap-2.5">
					{hasSelectableContent && (
						<div
							className="flex h-5 w-5 shrink-0 items-center justify-center"
							onClick={(e) => e.stopPropagation()}
						>
							<Checkbox
								checked={
									checkState === "checked"
										? true
										: checkState === "indeterminate"
											? "indeterminate"
											: false
								}
								onCheckedChange={handleCheckboxChange}
								aria-label={`Select folder ${folder.name}`}
								disabled={isDisabled}
							/>
						</div>
					)}
					<div className="flex h-5 w-5 shrink-0 items-center justify-center">
						<FolderIcon className="h-4 w-4 text-muted-foreground" />
					</div>
					<div className="min-w-0 flex-1">
						<p className="truncate text-sm font-medium">{folder.name}</p>
						<p className="truncate font-mono text-[11px] text-muted-foreground">
							{itemCount > 0 ? `${itemCount} ${itemCount === 1 ? "item" : "items"}` : "Folder"}
						</p>
					</div>
				</div>
				{isDuplicate && (
					<span
						className={cn(
							"shrink-0 rounded-sm border px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase",
							folder.inTrash
								? "border-destructive/30 bg-destructive/10 text-destructive"
								: "border-border/60 bg-background/50 text-muted-foreground",
						)}
					>
						{folder.inTrash ? "In Trash" : "Exists"}
					</span>
				)}
			</div>
		</div>
	);
});

interface ImportPreviewItemRowProps {
	item: ParsedImportItem;
	depth: number;
	isSelected: boolean;
	onToggle: (id: string) => void;
}

const ImportPreviewItemRow = memo(function ImportPreviewItemRow({
	item,
	depth,
	isSelected,
	onToggle,
}: ImportPreviewItemRowProps) {
	const depthPadding = depth * 24;
	const isDuplicate = item.isDuplicate;

	let hostname = item.url;
	try {
		hostname = new URL(item.url).hostname;
	} catch {
		// fallback
	}

	const handleCheckboxChange = () => {
		if (isDuplicate || !item.id) return;
		onToggle(item.id);
	};

	const handleRowClick = () => {
		if (isDuplicate || !item.id) return;
		onToggle(item.id);
	};

	return (
		<div style={{ paddingLeft: `${depthPadding}px` }} className="h-full">
			<div
				onClick={!isDuplicate ? handleRowClick : undefined}
				className={cn(
					"flex items-center justify-between gap-3 rounded-md border p-2 transition-colors corner-squircle supports-[corner-shape:squircle]:rounded-xl",
					isDuplicate
						? "border-transparent bg-muted/30 opacity-50 grayscale"
						: "cursor-pointer bg-card hover:bg-card/80",
				)}
			>
				<div className="flex min-w-0 flex-1 items-center gap-2.5">
					{!isDuplicate && (
						<div
							className="flex h-5 w-5 shrink-0 items-center justify-center"
							onClick={(e) => e.stopPropagation()}
						>
							<Checkbox
								checked={isSelected}
								onCheckedChange={handleCheckboxChange}
								aria-label={`Select ${item.title || hostname}`}
							/>
						</div>
					)}
					<SiteFavicon
						url={item.url}
						logo={item.logo}
						className="h-5 w-5 shrink-0"
						size={64}
						bypassCache={true}
					/>
					<div className="min-w-0 flex-1">
						<p className="truncate text-sm font-medium">{item.title || hostname}</p>
						<div className="mt-0.5 flex items-center gap-1.5 truncate">
							<span className="truncate font-mono text-[11px] text-muted-foreground">
								{item.url}
							</span>
							{!!item.note && (
								<div
									className="flex shrink-0 items-center gap-1 rounded-sm border border-border/50 bg-secondary/80 px-1.5 py-0.5 text-secondary-foreground corner-squircle supports-[corner-shape:squircle]:rounded-full"
									title="Contains a note"
								>
									<NoteIcon className="size-2.5" />
									<span className="text-[9px] leading-none font-medium tracking-widest uppercase opacity-80">
										Note
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
				{isDuplicate && (
					<span
						className={cn(
							"shrink-0 rounded-sm border px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase",
							item.inTrash
								? "border-destructive/30 bg-destructive/10 text-destructive"
								: "border-border/60 bg-background/50 text-muted-foreground",
						)}
					>
						{item.inTrash ? "In Trash" : "Exists"}
					</span>
				)}
			</div>
		</div>
	);
});

interface ImportPreviewTreeProps {
	flattenedNodes: TreeNode[];
	selectedItemIds: Set<string>;
	getFolderCheckState: (id: string) => "checked" | "unchecked" | "indeterminate";
	treeData: TreeData;
	onToggleItem: (id: string) => void;
	onToggleFolder: (id: string) => void;
}

const ImportPreviewTree = memo(function ImportPreviewTree({
	flattenedNodes,
	selectedItemIds,
	getFolderCheckState,
	treeData,
	onToggleItem,
	onToggleFolder,
}: ImportPreviewTreeProps) {
	const [parentEl, setParentEl] = useState<HTMLDivElement | null>(null);

	// eslint-disable-next-line react/incompatible-library
	const rowVirtualizer = useVirtualizer({
		count: flattenedNodes.length,
		getScrollElement: () => parentEl,
		estimateSize: () => 52,
		overscan: 5,
	});

	const virtualItems = rowVirtualizer.getVirtualItems();
	const deferredVirtualItems = useDeferredValue(virtualItems);

	return (
		<div ref={setParentEl} className="custom-scrollbar flex-1 overflow-y-auto p-4">
			<div className="relative w-full" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
				{deferredVirtualItems.map((virtualRow) => {
					const node = flattenedNodes[virtualRow.index];
					if (!node) return null;

					if (node.type === "folder") {
						const folder = node.data;
						const folderId = node.id;
						const checkState = getFolderCheckState(folderId);
						const descendantItems = treeData.folderDescendantItemIdsMap.get(folderId) || [];
						const descendantEmpty = treeData.folderDescendantEmptyFolderIdsMap.get(folderId) || [];
						const isEmptyFolder = treeData.emptyFolderIds.has(folderId);
						const hasSelectableContent =
							descendantItems.length > 0 ||
							descendantEmpty.length > 0 ||
							(isEmptyFolder && !folder.isDuplicate);
						const directItemCount = treeData.folderDirectItemCountMap.get(folderId) ?? 0;

						return (
							<div
								key={virtualRow.key}
								data-index={virtualRow.index}
								ref={rowVirtualizer.measureElement}
								className="absolute top-0 left-0 w-full pb-1"
								style={{
									transform: `translate3d(0, ${virtualRow.start}px, 0)`,
									willChange: "transform",
								}}
							>
								<ImportPreviewFolderRow
									folder={folder}
									depth={node.depth}
									checkState={checkState}
									hasSelectableContent={hasSelectableContent}
									itemCount={directItemCount}
									onToggle={onToggleFolder}
								/>
							</div>
						);
					} else {
						const item = node.data;
						const itemId = node.id;
						const isSelected = selectedItemIds.has(itemId);

						return (
							<div
								key={virtualRow.key}
								data-index={virtualRow.index}
								ref={rowVirtualizer.measureElement}
								className="absolute top-0 left-0 w-full pb-1"
								style={{
									transform: `translate3d(0, ${virtualRow.start}px, 0)`,
									willChange: "transform",
								}}
							>
								<ImportPreviewItemRow
									item={item}
									depth={node.depth}
									isSelected={isSelected}
									onToggle={onToggleItem}
								/>
							</div>
						);
					}
				})}
			</div>
		</div>
	);
});

export function ImportPreviewDialog({
	isOpen,
	onClose,
	data,
	onImportingChange,
}: ImportPreviewDialogProps) {
	const [isImporting, setIsImporting] = useState(false);

	const treeData = useMemo<TreeData>(() => {
		const foldersById = new Map<string, ParsedImportFolder>();
		const itemsById = new Map<string, ParsedImportItem>();
		const foldersByParent = new Map<string, ParsedImportFolder[]>();
		const itemsByFolder = new Map<string | null, ParsedImportItem[]>();

		const importedFolderIds = new Set(data.validFolders?.map((f) => f.id) || []);

		for (const folder of data.validFolders || []) {
			if (folder.id) {
				foldersById.set(folder.id, folder);
			}
			const pId =
				folder.parentId && importedFolderIds.has(folder.parentId) ? folder.parentId : "root";
			if (!foldersByParent.has(pId)) foldersByParent.set(pId, []);
			foldersByParent.get(pId)!.push(folder);
		}

		for (const item of data.validItems) {
			if (item.id) {
				itemsById.set(item.id, item);
			}
			const folderId = item.folderId && importedFolderIds.has(item.folderId) ? item.folderId : null;
			if (!itemsByFolder.has(folderId)) itemsByFolder.set(folderId, []);
			itemsByFolder.get(folderId)!.push(item);
		}

		const nodes: TreeNode[] = [];
		let counter = 0;
		function traverse(parentId: string | null, depth: number) {
			const folders = foldersByParent.get(parentId || "root") || [];
			for (const f of folders) {
				nodes.push({ type: "folder", id: f.id || `temp-f-${counter++}`, depth, data: f });
				traverse(f.id || null, depth + 1);
			}

			const items = itemsByFolder.get(parentId) || [];
			for (const item of items) {
				nodes.push({ type: "item", id: item.id || `temp-i-${counter++}`, depth, data: item });
			}
		}

		traverse(null, 0);

		const folderDescendantItemIdsMap = new Map<string, string[]>();
		const folderDescendantFolderIdsMap = new Map<string, string[]>();
		const itemAncestorFolderIdsMap = new Map<string, string[]>();
		const folderAncestorFolderIdsMap = new Map<string, string[]>();
		const folderDirectItemCountMap = new Map<string, number>();
		const folderSelectableDescendantItemCountMap = new Map<string, number>();

		for (const folder of data.validFolders || []) {
			if (!folder.id) continue;
			const ancestors: string[] = [];
			let currentParentId =
				folder.parentId && importedFolderIds.has(folder.parentId) ? folder.parentId : null;
			while (currentParentId && foldersById.has(currentParentId)) {
				ancestors.push(currentParentId);
				const parent = foldersById.get(currentParentId);
				currentParentId =
					parent?.parentId && importedFolderIds.has(parent.parentId) ? parent.parentId : null;
			}
			folderAncestorFolderIdsMap.set(folder.id, ancestors);
		}

		for (const item of data.validItems) {
			if (!item.id) continue;
			const ancestors: string[] = [];
			let currentParentId =
				item.folderId && importedFolderIds.has(item.folderId) ? item.folderId : null;
			while (currentParentId && foldersById.has(currentParentId)) {
				ancestors.push(currentParentId);
				const parent = foldersById.get(currentParentId);
				currentParentId =
					parent?.parentId && importedFolderIds.has(parent.parentId) ? parent.parentId : null;
			}
			itemAncestorFolderIdsMap.set(item.id, ancestors);
		}

		const folderDescendantEmptyFolderIdsMap = new Map<string, string[]>();
		const emptyFolderIds = new Set<string>();

		function collectFolderDescendants(folderId: string): {
			itemIds: string[];
			folderIds: string[];
			emptyFolderIdsList: string[];
		} {
			const directItems = itemsByFolder.get(folderId) || [];
			const directSubfolders = foldersByParent.get(folderId) || [];

			folderDirectItemCountMap.set(folderId, directItems.length);

			if (directItems.length === 0 && directSubfolders.length === 0) {
				emptyFolderIds.add(folderId);
			}

			const descendantItemIds: string[] = [];
			for (const item of directItems) {
				if (item.id && !item.isDuplicate) {
					descendantItemIds.push(item.id);
				}
			}

			const descendantFolderIds: string[] = [];
			const descendantEmptyFolderIds: string[] = [];

			for (const sub of directSubfolders) {
				if (!sub.id) continue;
				if (!sub.isDuplicate) {
					descendantFolderIds.push(sub.id);
				}
				const subResult = collectFolderDescendants(sub.id);
				descendantItemIds.push(...subResult.itemIds);
				descendantFolderIds.push(...subResult.folderIds);
				descendantEmptyFolderIds.push(...subResult.emptyFolderIdsList);

				if (emptyFolderIds.has(sub.id) && !sub.isDuplicate) {
					descendantEmptyFolderIds.push(sub.id);
				}
			}

			folderDescendantItemIdsMap.set(folderId, descendantItemIds);
			folderDescendantFolderIdsMap.set(folderId, descendantFolderIds);
			folderDescendantEmptyFolderIdsMap.set(folderId, descendantEmptyFolderIds);
			folderSelectableDescendantItemCountMap.set(folderId, descendantItemIds.length);

			return {
				itemIds: descendantItemIds,
				folderIds: descendantFolderIds,
				emptyFolderIdsList: descendantEmptyFolderIds,
			};
		}

		for (const folder of data.validFolders || []) {
			if (folder.id && !folderDescendantItemIdsMap.has(folder.id)) {
				collectFolderDescendants(folder.id);
			}
		}

		const allSelectableItemIds: string[] = [];
		for (const item of data.validItems) {
			if (item.id && !item.isDuplicate) {
				allSelectableItemIds.push(item.id);
			}
		}

		const allSelectableFolderIds: string[] = [];
		const allSelectableEmptyFolderIds: string[] = [];
		for (const folder of data.validFolders || []) {
			if (!folder.id || folder.isDuplicate) continue;
			const descendantItems = folderDescendantItemIdsMap.get(folder.id) || [];
			const descendantEmpty = folderDescendantEmptyFolderIdsMap.get(folder.id) || [];
			const isEmpty = emptyFolderIds.has(folder.id);
			if (descendantItems.length > 0 || descendantEmpty.length > 0 || isEmpty) {
				allSelectableFolderIds.push(folder.id);
				if (isEmpty) {
					allSelectableEmptyFolderIds.push(folder.id);
				}
			}
		}

		return {
			nodes,
			foldersById,
			itemsById,
			folderDescendantItemIdsMap,
			folderDescendantFolderIdsMap,
			folderDescendantEmptyFolderIdsMap,
			emptyFolderIds,
			itemAncestorFolderIdsMap,
			folderAncestorFolderIdsMap,
			allSelectableItemIds,
			allSelectableFolderIds,
			allSelectableEmptyFolderIds,
			folderDirectItemCountMap,
			folderSelectableDescendantItemCountMap,
		};
	}, [data.validFolders, data.validItems]);

	const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(() => {
		const set = new Set<string>();
		for (const item of data.validItems) {
			if (!item.isDuplicate && item.id) {
				set.add(item.id);
			}
		}
		return set;
	});

	const [selectedEmptyFolderIds, setSelectedEmptyFolderIds] = useState<Set<string>>(() => {
		const set = new Set<string>();
		for (const id of treeData.allSelectableEmptyFolderIds) {
			set.add(id);
		}
		return set;
	});

	// Derive state updates during render if data changes per React compiler rules
	const [prevData, setPrevData] = useState(data);
	if (prevData !== data) {
		setPrevData(data);
		const initialItems = new Set<string>();
		for (const item of data.validItems) {
			if (!item.isDuplicate && item.id) initialItems.add(item.id);
		}
		setSelectedItemIds(initialItems);
		setSelectedEmptyFolderIds(new Set(treeData.allSelectableEmptyFolderIds));
	}

	const getFolderCheckState = useCallback(
		(folderId: string): "checked" | "unchecked" | "indeterminate" => {
			const descendantItems = treeData.folderDescendantItemIdsMap.get(folderId) || [];
			const descendantEmptyFolders = treeData.folderDescendantEmptyFolderIdsMap.get(folderId) || [];
			const isEmptyFolder = treeData.emptyFolderIds.has(folderId);
			const folder = treeData.foldersById.get(folderId);

			const totalSelectableInFolder =
				descendantItems.length +
				descendantEmptyFolders.length +
				(isEmptyFolder && !folder?.isDuplicate ? 1 : 0);

			if (totalSelectableInFolder === 0) {
				return "unchecked";
			}

			let selectedCount = 0;
			for (const id of descendantItems) {
				if (selectedItemIds.has(id)) {
					selectedCount++;
				}
			}
			for (const id of descendantEmptyFolders) {
				if (selectedEmptyFolderIds.has(id)) {
					selectedCount++;
				}
			}
			if (isEmptyFolder && selectedEmptyFolderIds.has(folderId)) {
				selectedCount++;
			}

			if (selectedCount === 0) {
				return "unchecked";
			}

			if (selectedCount === totalSelectableInFolder) {
				return "checked";
			}

			return "indeterminate";
		},
		[treeData, selectedItemIds, selectedEmptyFolderIds],
	);

	const handleToggleItem = useCallback(
		(itemId: string) => {
			const item = treeData.itemsById.get(itemId);
			if (!item || item.isDuplicate) return;

			setSelectedItemIds((prev) => {
				const next = new Set(prev);
				if (next.has(itemId)) {
					next.delete(itemId);
				} else {
					next.add(itemId);
				}
				return next;
			});
		},
		[treeData],
	);

	const handleToggleFolder = useCallback(
		(folderId: string) => {
			const folder = treeData.foldersById.get(folderId);
			if (!folder) return;

			const descendantItems = treeData.folderDescendantItemIdsMap.get(folderId) || [];
			const descendantEmptyFolders = treeData.folderDescendantEmptyFolderIdsMap.get(folderId) || [];
			const isEmptyFolder = treeData.emptyFolderIds.has(folderId) && !folder.isDuplicate;

			const currentCheckState = getFolderCheckState(folderId);

			if (currentCheckState === "checked") {
				setSelectedItemIds((prev) => {
					const next = new Set(prev);
					for (const id of descendantItems) {
						next.delete(id);
					}
					return next;
				});

				setSelectedEmptyFolderIds((prev) => {
					const next = new Set(prev);
					if (isEmptyFolder) {
						next.delete(folderId);
					}
					for (const id of descendantEmptyFolders) {
						next.delete(id);
					}
					return next;
				});
			} else {
				setSelectedItemIds((prev) => {
					const next = new Set(prev);
					for (const id of descendantItems) {
						next.add(id);
					}
					return next;
				});

				setSelectedEmptyFolderIds((prev) => {
					const next = new Set(prev);
					if (isEmptyFolder) {
						next.add(folderId);
					}
					for (const id of descendantEmptyFolders) {
						next.add(id);
					}
					return next;
				});
			}
		},
		[treeData, getFolderCheckState],
	);

	const itemsToImport = useMemo(
		() =>
			data.validItems.filter(
				(item) => !item.isDuplicate && item.id && selectedItemIds.has(item.id),
			),
		[data.validItems, selectedItemIds],
	);

	const foldersToImport = useMemo(() => {
		const orderedFolders: ParsedImportFolder[] = [];
		for (const node of treeData.nodes) {
			if (node.type !== "folder") continue;
			const folder = node.data;
			if (folder.isDuplicate || !folder.id) continue;

			const descendantItems = treeData.folderDescendantItemIdsMap.get(folder.id) || [];
			const hasSelectedItems = descendantItems.some((id) => selectedItemIds.has(id));
			if (hasSelectedItems) {
				orderedFolders.push(folder);
				continue;
			}

			const descendantEmpty = treeData.folderDescendantEmptyFolderIdsMap.get(folder.id) || [];
			const hasSelectedEmpty = descendantEmpty.some((id) => selectedEmptyFolderIds.has(id));
			if (hasSelectedEmpty) {
				orderedFolders.push(folder);
				continue;
			}

			if (treeData.emptyFolderIds.has(folder.id) && selectedEmptyFolderIds.has(folder.id)) {
				orderedFolders.push(folder);
			}
		}
		return orderedFolders;
	}, [treeData, selectedItemIds, selectedEmptyFolderIds]);

	const totalToImport = itemsToImport.length + foldersToImport.length;
	const totalSelectable =
		treeData.allSelectableItemIds.length + treeData.allSelectableFolderIds.length;

	const isAllSelected = totalSelectable > 0 && totalToImport === totalSelectable;
	const isSomeSelected = totalToImport > 0 && !isAllSelected;

	const handleToggleSelectAll = useCallback(() => {
		if (totalSelectable === 0) return;

		if (isAllSelected) {
			setSelectedItemIds(new Set());
			setSelectedEmptyFolderIds(new Set());
		} else {
			setSelectedItemIds(new Set(treeData.allSelectableItemIds));
			setSelectedEmptyFolderIds(new Set(treeData.allSelectableEmptyFolderIds));
		}
	}, [totalSelectable, isAllSelected, treeData]);

	const handleConfirm = async () => {
		if (totalToImport === 0) {
			onClose();
			return;
		}

		setIsImporting(true);
		onImportingChange?.(true);
		try {
			// Import folders sequentially to maintain ID mapping
			const idMap = new Map<string, string>();
			const failedFolderIds = new Set<string>();
			const folderResults: PromiseSettledResult<string>[] = [];

			for (const folder of foldersToImport) {
				try {
					const { isDuplicate: _isDuplicate, parentId, ...folderData } = folder;

					if (parentId && failedFolderIds.has(parentId)) {
						if (folder.id) failedFolderIds.add(folder.id);
						folderResults.push({
							status: "rejected",
							reason: new Error("Parent folder import failed"),
						});
						continue;
					}

					const resolvedParentId = parentId
						? idMap.has(parentId)
							? (idMap.get(parentId) ?? null)
							: parentId
						: null;
					const newId = await FolderRepository.importFolder({
						...folderData,
						parentId: resolvedParentId,
					});
					if (folder.id) {
						idMap.set(folder.id, newId);
					}
					folderResults.push({ status: "fulfilled", value: newId });
				} catch (error) {
					if (folder.id) failedFolderIds.add(folder.id);
					folderResults.push({ status: "rejected", reason: error });
				}
			}

			const itemPromises = itemsToImport.map((item) => {
				const { isDuplicate: _isDuplicate, folderId, ...itemData } = item;

				if (folderId && failedFolderIds.has(folderId)) {
					return Promise.reject(new Error("Parent folder import failed"));
				}

				const resolvedFolderId = folderId
					? idMap.has(folderId)
						? (idMap.get(folderId) ?? undefined)
						: folderId
					: undefined;
				return ItemRepository.importItem({ ...itemData, folderId: resolvedFolderId });
			});
			const itemResults = await Promise.allSettled(itemPromises);

			const allResults = [...folderResults, ...itemResults];
			const successCount = allResults.filter((r) => r.status === "fulfilled").length;
			const failCount = allResults.length - successCount;

			if (failCount === 0) {
				notify.success(
					`Successfully imported ${successCount} ${successCount === 1 ? "entry" : "entries"}`,
				);
				onClose(true);
			} else if (successCount > 0) {
				notify.warning(`Imported ${successCount} entries, but ${failCount} failed.`);
				onClose(true);
			} else {
				notify.error(`Failed to import all ${failCount} entries.`);
			}
		} catch {
			notify.error("An error occurred during import.");
		} finally {
			setIsImporting(false);
			onImportingChange?.(false);
		}
	};

	const totalInFile = (data.validFolders?.length || 0) + data.validItems.length + data.invalidCount;

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && !isImporting && onClose()}>
			<DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-xl">
				<div className="border-b p-6 pb-4">
					<DialogHeader>
						<DialogTitle className="font-heading text-xl">Import Preview</DialogTitle>
						<DialogDescription>
							We found {totalInFile} items in the file. Review them before importing.
						</DialogDescription>
					</DialogHeader>

					<div className="mt-6 flex items-center gap-6">
						<div className="flex flex-col">
							<span className="font-mono text-xl font-semibold text-foreground">
								{totalToImport}
							</span>
							<span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
								To Import
							</span>
						</div>
						<div className="flex flex-col">
							<span className="font-mono text-xl font-medium text-muted-foreground">
								{data.duplicateCount}
							</span>
							<span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
								Duplicates
							</span>
						</div>
						<div className="flex flex-col">
							<span className="font-mono text-xl font-medium text-muted-foreground">
								{data.invalidCount}
							</span>
							<span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
								Invalid
							</span>
						</div>
					</div>

					{(data.duplicateCount > 0 || data.invalidCount > 0) && (
						<div className="mt-4 space-y-1.5 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
							{data.duplicateCount > 0 && (
								<p className="flex items-center gap-1.5">
									<InfoIcon className="h-4 w-4 shrink-0" />
									{data.trashCount === data.duplicateCount
										? `${data.duplicateCount} ${data.duplicateCount === 1 ? "entry is" : "entries are"} in your Recycle Bin and will be skipped.`
										: data.trashCount && data.trashCount > 0
											? `${data.duplicateCount} ${data.duplicateCount === 1 ? "entry already exists" : "entries already exist"} (${data.trashCount} in Recycle Bin) and will be skipped.`
											: `${data.duplicateCount} ${data.duplicateCount === 1 ? "entry already exists" : "entries already exist"} in your library and will be skipped.`}
								</p>
							)}
							{data.invalidCount > 0 && (
								<p className="flex items-center gap-1.5">
									<AlertCircleIcon className="h-4 w-4 shrink-0" />
									{data.invalidCount} {data.invalidCount === 1 ? "entry has" : "entries have"}{" "}
									missing or invalid data and will be skipped.
								</p>
							)}
						</div>
					)}
				</div>

				<div className="flex items-center justify-between border-b bg-muted/20 px-6 py-2.5 text-xs text-muted-foreground">
					<div className="flex items-center gap-2.5">
						<Checkbox
							id="import-select-all"
							checked={isAllSelected ? true : isSomeSelected ? "indeterminate" : false}
							disabled={totalSelectable === 0}
							onCheckedChange={handleToggleSelectAll}
							aria-label="Select all entries"
						/>
						<label
							htmlFor="import-select-all"
							className={cn(
								"font-medium select-none",
								totalSelectable > 0 ? "cursor-pointer text-foreground" : "text-muted-foreground",
							)}
						>
							Select all
						</label>
					</div>
					<div className="font-mono text-[11px]">
						<span className="font-semibold text-foreground">{totalToImport}</span>
						<span className="text-muted-foreground"> of {totalSelectable} selected</span>
					</div>
				</div>

				<ImportPreviewTree
					flattenedNodes={treeData.nodes}
					selectedItemIds={selectedItemIds}
					getFolderCheckState={getFolderCheckState}
					treeData={treeData}
					onToggleItem={handleToggleItem}
					onToggleFolder={handleToggleFolder}
				/>

				<DialogFooter className="m-0 border-t p-4">
					<Button variant="ghost" onClick={() => onClose()} disabled={isImporting}>
						Cancel
					</Button>
					<Button onClick={handleConfirm} disabled={isImporting || totalToImport === 0}>
						{isImporting
							? "Importing..."
							: `Import ${totalToImport} ${totalToImport === 1 ? "entry" : "entries"}`}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
