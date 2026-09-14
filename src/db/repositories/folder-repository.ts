import { folderSchema } from "@/schemas/folder.schema";
import { db, type Folder } from "../db";

export const FolderRepository = {
	async getAll(): Promise<Folder[]> {
		return await db.folders
			.orderBy("order")
			.filter((f) => !f.deletedAt)
			.toArray();
	},

	async query(
		params: { view?: "all" | "favorites" | "trash"; parentId?: string | null; q?: string } = {},
	): Promise<Folder[]> {
		const { view = "all", parentId, q = "" } = params;
		let results = await db.folders.orderBy("order").toArray();

		if (view === "trash") {
			const deletedFolders = results.filter((f) => f.deletedAt);
			const deletedFolderIds = new Set(deletedFolders.map((f) => f.id));
			results = deletedFolders.filter((f) => !f.parentId || !deletedFolderIds.has(f.parentId));
		} else if (view === "favorites") {
			results = results.filter((f) => !f.deletedAt && f.isFavorite);
			if (parentId !== undefined) {
				results = results.filter((f) => f.parentId === parentId);
			}
		} else {
			results = results.filter((f) => !f.deletedAt);

			if (parentId !== undefined) {
				results = results.filter((f) => f.parentId === parentId);
			}
		}

		if (q.trim()) {
			const query = q.toLowerCase().trim();
			results = results.filter((f) => f.name.toLowerCase().includes(query));
		}

		return results;
	},

	async getById(id: string): Promise<Folder | undefined> {
		return await db.folders.get(id);
	},

	async getByParentId(parentId: string | null): Promise<Folder[]> {
		// Note: Dexie indexing null is tricky. We can filter the getAll results for simplicity
		// since folder trees typically aren't massive.
		const all = await this.getAll();
		return all.filter((f) => f.parentId === parentId);
	},

	async save(folder: Omit<Folder, "id" | "createdAt" | "updatedAt" | "order">): Promise<void> {
		const parsedData = folderSchema.parse(folder);
		const now = Date.now();

		await db.transaction("rw", db.folders, async () => {
			const count = await db.folders.count();

			const record: Folder = {
				id: crypto.randomUUID(),
				parentId: parsedData.parentId || null,
				name: parsedData.name,
				createdAt: now,
				updatedAt: now,
				order: count,
			};
			await db.folders.put(record);
		});
	},

	async update(id: string, updates: Partial<Folder>): Promise<void> {
		const parsedData = folderSchema.partial().parse(updates);

		await db.transaction("rw", db.folders, async () => {
			const updateRecord = {
				...parsedData,
				updatedAt: Date.now(),
			};
			await db.folders.update(id, updateRecord);
		});
	},

	async delete(id: string): Promise<void> {
		await db.transaction("rw", db.folders, db.items, async () => {
			// Find all subfolders recursively
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

			const folderIds = Array.from(foldersToDelete);

			// Delete all items in these folders
			await db.items.where("folderId").anyOf(folderIds).delete();

			// Delete the folders
			await db.folders.bulkDelete(folderIds);
		});
	},

	async deleteMany(ids: string[]): Promise<void> {
		await db.transaction("rw", db.folders, db.items, async () => {
			for (const id of ids) {
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

				const folderIds = Array.from(foldersToDelete);
				await db.items.where("folderId").anyOf(folderIds).delete();
				await db.folders.bulkDelete(folderIds);
			}
		});
	},

	async softDelete(ids: string[]): Promise<void> {
		const now = Date.now();
		await db.transaction("rw", db.folders, db.items, async () => {
			for (const id of ids) {
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

				const folderIds = Array.from(foldersToUpdate);
				await db.folders.where("id").anyOf(folderIds).modify({ deletedAt: now, updatedAt: now });
				await db.items
					.where("folderId")
					.anyOf(folderIds)
					.modify({ deletedAt: now, updatedAt: now });
			}
		});
	},

	async restore(ids: string[]): Promise<void> {
		const now = Date.now();
		await db.transaction("rw", db.folders, db.items, async () => {
			for (const id of ids) {
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

				const folderIds = Array.from(foldersToUpdate);
				// In Dexie 3/4, passing undefined removes the property
				await db.folders
					.where("id")
					.anyOf(folderIds)
					.modify({ deletedAt: undefined, updatedAt: now });
				await db.items
					.where("folderId")
					.anyOf(folderIds)
					.modify({ deletedAt: undefined, updatedAt: now });
			}
		});
	},

	async moveMany(ids: string[], targetParentId: string | null): Promise<void> {
		const now = Date.now();
		await db.transaction("rw", db.folders, async () => {
			// Prevent circular references: targetParentId cannot be inside any of the `ids`
			// We can do a quick check, but for a local UI it's usually blocked by the UI not showing them.
			for (const id of ids) {
				await db.folders.update(id, { parentId: targetParentId, updatedAt: now });
			}
		});
	},

	async toggleFavorite(id: string): Promise<boolean> {
		let isFav = false;
		await db.transaction("rw", db.folders, async () => {
			const folder = await db.folders.get(id);
			if (folder) {
				isFav = !folder.isFavorite;
				await db.folders.update(id, { isFavorite: isFav, updatedAt: Date.now() });
			}
		});
		return isFav;
	},

	async emptyTrash(): Promise<void> {
		await db.transaction("rw", db.folders, async () => {
			const trashFolders = await db.folders.filter((f) => !!f.deletedAt).toArray();
			const ids = trashFolders.map((f) => f.id);
			await db.folders.bulkDelete(ids);
		});
	},
};
