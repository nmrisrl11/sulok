import { setHasDataHint } from "@/lib/storage";
import { db } from "../db";

export const BulkRepository = {
	async softDelete(itemIds: string[], folderIds: string[]): Promise<void> {
		const now = Date.now();
		await db.transaction("rw", db.folders, db.items, async () => {
			if (itemIds.length > 0) {
				for (const id of itemIds) {
					await db.items.update(id, { deletedAt: now, cascadeParentId: undefined, updatedAt: now });
				}
			}

			if (folderIds.length > 0) {
				for (const id of folderIds) {
					const folder = await db.folders.get(id);
					if (!folder || (folder.deletedAt === now && folder.cascadeParentId)) {
						continue;
					}

					await db.folders.update(id, {
						deletedAt: now,
						cascadeParentId: undefined,
						updatedAt: now,
					});

					const cascadeFolderIds: string[] = [];
					let queue = [id];

					while (queue.length > 0) {
						const currentId = queue.shift()!;
						const children = await db.folders
							.filter((f) => f.parentId === currentId && !f.deletedAt)
							.toArray();
						for (const child of children) {
							cascadeFolderIds.push(child.id);
							queue.push(child.id);
						}
					}

					if (cascadeFolderIds.length > 0) {
						await db.folders
							.where("id")
							.anyOf(cascadeFolderIds)
							.modify({ deletedAt: now, cascadeParentId: id, updatedAt: now });
					}

					const allAffectedFolderIds = [id, ...cascadeFolderIds];

					const activeItems = await db.items
						.where("folderId")
						.anyOf(allAffectedFolderIds)
						.filter((item) => !item.deletedAt && !itemIds.includes(item.id))
						.toArray();

					const activeItemIds = activeItems.map((i) => i.id);
					if (activeItemIds.length > 0) {
						await db.items
							.where("id")
							.anyOf(activeItemIds)
							.modify({ deletedAt: now, cascadeParentId: id, updatedAt: now });
					}
				}
			}
		});
	},

	async restore(itemIds: string[], folderIds: string[]): Promise<void> {
		const { FolderRepository } = await import("./folder-repository");
		const { ItemRepository } = await import("./item-repository");

		await db.transaction("rw", db.folders, db.items, async () => {
			if (folderIds.length > 0) {
				await FolderRepository.restore(folderIds);
			}

			if (itemIds.length > 0) {
				await ItemRepository.restoreMany(itemIds);
			}
		});
	},

	async hardDelete(itemIds: string[], folderIds: string[]): Promise<void> {
		const { FolderRepository } = await import("./folder-repository");

		await db.transaction("rw", db.folders, db.items, async () => {
			if (folderIds.length > 0) {
				for (const id of folderIds) {
					await FolderRepository.delete(id);
				}
			}

			if (itemIds.length > 0) {
				await db.items.bulkDelete(itemIds);
			}
		});

		const count = await db.items.count();
		if (count === 0) {
			setHasDataHint(false);
		}
	},

	async emptyTrash(): Promise<void> {
		await db.transaction("rw", db.folders, db.items, async () => {
			const trashItems = await db.items.filter((item) => !!item.deletedAt).toArray();
			const itemIds = trashItems.map((item) => item.id);
			await db.items.bulkDelete(itemIds);

			const trashFolders = await db.folders.filter((f) => !!f.deletedAt).toArray();
			const folderIds = trashFolders.map((f) => f.id);
			await db.folders.bulkDelete(folderIds);
		});

		const count = await db.items.count();
		if (count === 0) {
			setHasDataHint(false);
		}
	},

	async move(itemIds: string[], folderIds: string[], targetFolderId: string | null): Promise<void> {
		const { FolderRepository } = await import("./folder-repository");
		const { ItemRepository } = await import("./item-repository");

		await db.transaction("rw", db.folders, db.items, async () => {
			if (folderIds.length > 0) {
				await FolderRepository.moveMany(folderIds, targetFolderId);
			}

			if (itemIds.length > 0) {
				await ItemRepository.moveMany(itemIds, targetFolderId);
			}
		});
	},

	async setFavoriteStatus(
		itemIds: string[],
		folderIds: string[],
		isFavorite: boolean,
	): Promise<void> {
		const now = Date.now();
		await db.transaction("rw", db.folders, db.items, async () => {
			if (folderIds.length > 0) {
				for (const id of folderIds) {
					await db.folders.update(id, { isFavorite, updatedAt: now });
				}
			}

			if (itemIds.length > 0) {
				for (const id of itemIds) {
					await db.items.update(id, { isFavorite, updatedAt: now });
				}
			}
		});
	},

	async areAllSelectedFavorited(itemIds: string[], folderIds: string[]): Promise<boolean> {
		if (itemIds.length === 0 && folderIds.length === 0) return false;

		let itemsAllFav = true;
		if (itemIds.length > 0) {
			const items = await db.items.where("id").anyOf(itemIds).toArray();
			itemsAllFav = items.length === new Set(itemIds).size && items.every((i) => i.isFavorite);
		}

		let foldersAllFav = true;
		if (folderIds.length > 0) {
			const folders = await db.folders.where("id").anyOf(folderIds).toArray();
			foldersAllFav =
				folders.length === new Set(folderIds).size && folders.every((f) => f.isFavorite);
		}

		return itemsAllFav && foldersAllFav;
	},
};
