import type {
	ParsedImportData,
	ParsedImportFolder,
	ParsedImportItem,
	ParsedInvalidEntry,
} from "@/features/settings/utils/import-utils";
import { useMemo } from "react";
import type { TreeData, TreeNode } from "./types";

export function useImportTree(data: ParsedImportData): TreeData {
	return useMemo<TreeData>(() => {
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

		const invalidByFolder = new Map<string | null, ParsedInvalidEntry[]>();
		for (const entry of data.invalidEntries || []) {
			const folderId =
				entry.folderId && importedFolderIds.has(entry.folderId) ? entry.folderId : null;
			if (!invalidByFolder.has(folderId)) invalidByFolder.set(folderId, []);
			invalidByFolder.get(folderId)!.push(entry);
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

			const invalidItems = invalidByFolder.get(parentId) || [];
			for (const inv of invalidItems) {
				nodes.push({ type: "invalid", id: inv.id, depth, data: inv });
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
	}, [data.validFolders, data.validItems, data.invalidEntries]);
}
