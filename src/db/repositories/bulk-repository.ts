import { setHasDataHint } from "@/lib/storage";
import { db } from "../db";

export const BulkRepository = {
	async softDelete(itemIds: string[], folderIds: string[]): Promise<void> {
		const now = Date.now();
		await db.transaction("rw", db.folders, db.items, async () => {
			if (folderIds.length > 0) {
				for (const id of folderIds) {
					const foldersToUpdate = new Set<string>([id]);
					let queue = [id];

					while (queue.length > 0) {
						const currentId = queue.shift()!;
						const children = await db.folders.filter((f) => f.parentId === currentId).toArray();
						for (const child of children) {
							foldersToUpdate.add(child.id);
							queue.push(child.id);
						}
					}

					const fIds = Array.from(foldersToUpdate);
					await db.folders.where("id").anyOf(fIds).modify({ deletedAt: now, updatedAt: now });
					await db.items.where("folderId").anyOf(fIds).modify({ deletedAt: now, updatedAt: now });
				}
			}

			if (itemIds.length > 0) {
				for (const id of itemIds) {
					await db.items.update(id, { deletedAt: now, updatedAt: now });
				}
			}
		});
	},

	async restore(itemIds: string[], folderIds: string[]): Promise<void> {
		const now = Date.now();
		await db.transaction("rw", db.folders, db.items, async () => {
			if (folderIds.length > 0) {
				for (const id of folderIds) {
					const foldersToUpdate = new Set<string>([id]);
					let queue = [id];

					while (queue.length > 0) {
						const currentId = queue.shift()!;
						const children = await db.folders.filter((f) => f.parentId === currentId).toArray();
						for (const child of children) {
							foldersToUpdate.add(child.id);
							queue.push(child.id);
						}
					}

					const fIds = Array.from(foldersToUpdate);
					await db.folders.where("id").anyOf(fIds).modify({ deletedAt: undefined, updatedAt: now });
					await db.items
						.where("folderId")
						.anyOf(fIds)
						.modify({ deletedAt: undefined, updatedAt: now });
				}
			}

			if (itemIds.length > 0) {
				for (const id of itemIds) {
					await db.items.update(id, { deletedAt: undefined, updatedAt: now });
				}
			}
		});
	},

	async hardDelete(itemIds: string[], folderIds: string[]): Promise<void> {
		await db.transaction("rw", db.folders, db.items, async () => {
			if (folderIds.length > 0) {
				for (const id of folderIds) {
					const foldersToDelete = new Set<string>([id]);
					let queue = [id];

					while (queue.length > 0) {
						const currentId = queue.shift()!;
						const children = await db.folders.filter((f) => f.parentId === currentId).toArray();
						for (const child of children) {
							foldersToDelete.add(child.id);
							queue.push(child.id);
						}
					}

					const fIds = Array.from(foldersToDelete);
					await db.items.where("folderId").anyOf(fIds).delete();
					await db.folders.bulkDelete(fIds);
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
		const now = Date.now();
		await db.transaction("rw", db.folders, db.items, async () => {
			if (folderIds.length > 0) {
				for (const id of folderIds) {
					await db.folders.update(id, { parentId: targetFolderId, updatedAt: now });
				}
			}

			if (itemIds.length > 0) {
				for (const id of itemIds) {
					await db.items.update(id, { folderId: targetFolderId ?? undefined, updatedAt: now });
				}
			}
		});
	},
};
