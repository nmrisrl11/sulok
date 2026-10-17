import { FolderRepository } from "@/db/repositories/folder-repository";
import { ItemRepository } from "@/db/repositories/item-repository";
import type { ParsedImportFolder, ParsedImportItem } from "@/features/settings/utils/import-utils";
import { notify } from "@/lib/notify";

export interface ExecuteImportOptions {
	foldersToImport: ParsedImportFolder[];
	itemsToImport: ParsedImportItem[];
	onSuccess: () => void;
}

export async function executeImport({
	foldersToImport,
	itemsToImport,
	onSuccess,
}: ExecuteImportOptions): Promise<boolean> {
	try {
		// Import folders sequentially to maintain parent-child ID mapping
		const idMap = new Map<string, string>();
		const failedFolderIds = new Set<string>();
		const folderResults: PromiseSettledResult<string>[] = [];

		for (const folder of foldersToImport) {
			try {
				const { isDuplicate: _isDuplicate, inTrash: _inTrash, parentId, ...folderData } = folder;

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
			const { isDuplicate: _isDuplicate, inTrash: _inTrash, folderId, ...itemData } = item;

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
			onSuccess();
			return true;
		} else if (successCount > 0) {
			notify.warning(`Imported ${successCount} entries, but ${failCount} failed.`);
			onSuccess();
			return true;
		} else {
			notify.error(`Failed to import all ${failCount} entries.`);
			return false;
		}
	} catch {
		notify.error("An error occurred during import.");
		return false;
	}
}
