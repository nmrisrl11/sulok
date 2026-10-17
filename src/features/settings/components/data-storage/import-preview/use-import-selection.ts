import type {
	ParsedImportData,
	ParsedImportFolder,
	ParsedImportItem,
} from "@/features/settings/utils/import-utils";
import { useCallback, useMemo, useState } from "react";
import type { TreeData } from "./types";

export interface ImportSelectionState {
	selectedItemIds: Set<string>;
	selectedEmptyFolderIds: Set<string>;
	itemsToImport: ParsedImportItem[];
	foldersToImport: ParsedImportFolder[];
	totalToImport: number;
	totalSelectable: number;
	isAllSelected: boolean;
	isSomeSelected: boolean;
	getFolderCheckState: (id: string) => "checked" | "unchecked" | "indeterminate";
	handleToggleItem: (id: string) => void;
	handleToggleFolder: (id: string) => void;
	handleToggleSelectAll: () => void;
}

export function useImportSelection(
	treeData: TreeData,
	data: ParsedImportData,
	onDataChange?: () => void,
): ImportSelectionState {
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
		onDataChange?.();
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

	return {
		selectedItemIds,
		selectedEmptyFolderIds,
		itemsToImport,
		foldersToImport,
		totalToImport,
		totalSelectable,
		isAllSelected,
		isSomeSelected,
		getFolderCheckState,
		handleToggleItem,
		handleToggleFolder,
		handleToggleSelectAll,
	};
}
