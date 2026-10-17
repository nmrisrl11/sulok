import type { ParsedImportData, ParsedImportFolder } from "@/features/settings/utils/import-utils";
import { useMemo, useState } from "react";
import type { ImportFilterStatus, TreeData, TreeNode } from "./types";

export interface ImportFilterState {
	activeFilter: ImportFilterStatus;
	setActiveFilter: React.Dispatch<React.SetStateAction<ImportFilterStatus>>;
	filteredNodes: TreeNode[];
	activeDuplicateCount: number;
	trashCount: number;
	invalidCount: number;
}

export function useImportFilter(
	treeData: TreeData,
	data: ParsedImportData,
	selectedItemIds: Set<string>,
	foldersToImport: ParsedImportFolder[],
): ImportFilterState {
	const [activeFilter, setActiveFilter] = useState<ImportFilterStatus>("all");

	const activeDuplicateCount = Math.max(0, data.duplicateCount - data.trashCount);
	const trashCount = data.trashCount;
	const invalidCount = data.invalidCount;

	const categorySets = useMemo(() => {
		const activeDuplicateItemIds = new Set<string>();
		const activeDuplicateFolderIds = new Set<string>();
		const trashItemIds = new Set<string>();
		const trashFolderIds = new Set<string>();
		const invalidEntryIds = new Set<string>();
		const invalidFolderIds = new Set<string>();

		for (const item of data.validItems) {
			if (!item.id) continue;
			if (item.inTrash) {
				trashItemIds.add(item.id);
				const ancestors = treeData.itemAncestorFolderIdsMap.get(item.id) || [];
				for (const aId of ancestors) trashFolderIds.add(aId);
			} else if (item.isDuplicate) {
				activeDuplicateItemIds.add(item.id);
				const ancestors = treeData.itemAncestorFolderIdsMap.get(item.id) || [];
				for (const aId of ancestors) activeDuplicateFolderIds.add(aId);
			}
		}

		for (const folder of data.validFolders || []) {
			if (!folder.id) continue;
			if (folder.inTrash) {
				trashFolderIds.add(folder.id);
				const ancestors = treeData.folderAncestorFolderIdsMap.get(folder.id) || [];
				for (const aId of ancestors) trashFolderIds.add(aId);
			} else if (folder.isDuplicate) {
				activeDuplicateFolderIds.add(folder.id);
				const ancestors = treeData.folderAncestorFolderIdsMap.get(folder.id) || [];
				for (const aId of ancestors) activeDuplicateFolderIds.add(aId);
			}
		}

		for (const entry of data.invalidEntries || []) {
			invalidEntryIds.add(entry.id);
			if (entry.folderId) {
				invalidFolderIds.add(entry.folderId);
				const ancestors = treeData.folderAncestorFolderIdsMap.get(entry.folderId) || [];
				for (const aId of ancestors) invalidFolderIds.add(aId);
			}
		}

		return {
			activeDuplicateItemIds,
			activeDuplicateFolderIds,
			trashItemIds,
			trashFolderIds,
			invalidEntryIds,
			invalidFolderIds,
		};
	}, [data.validItems, data.validFolders, data.invalidEntries, treeData]);

	const filteredNodes = useMemo(() => {
		if (activeFilter === "all") return treeData.nodes;

		if (activeFilter === "to-import") {
			const toImportFolderIdSet = new Set(foldersToImport.map((f) => f.id));
			return treeData.nodes.filter((node) => {
				if (node.type === "item") return selectedItemIds.has(node.id);
				if (node.type === "folder") return toImportFolderIdSet.has(node.id);
				return false;
			});
		}

		if (activeFilter === "duplicates") {
			return treeData.nodes.filter((node) => {
				if (node.type === "item") return categorySets.activeDuplicateItemIds.has(node.id);
				if (node.type === "folder") return categorySets.activeDuplicateFolderIds.has(node.id);
				return false;
			});
		}

		if (activeFilter === "trash") {
			return treeData.nodes.filter((node) => {
				if (node.type === "item") return categorySets.trashItemIds.has(node.id);
				if (node.type === "folder") return categorySets.trashFolderIds.has(node.id);
				return false;
			});
		}

		if (activeFilter === "invalid") {
			return treeData.nodes.filter((node) => {
				if (node.type === "invalid") return categorySets.invalidEntryIds.has(node.id);
				if (node.type === "folder") return categorySets.invalidFolderIds.has(node.id);
				return false;
			});
		}

		return treeData.nodes;
	}, [activeFilter, treeData.nodes, selectedItemIds, foldersToImport, categorySets]);

	return {
		activeFilter,
		setActiveFilter,
		filteredNodes,
		activeDuplicateCount,
		trashCount,
		invalidCount,
	};
}
