import { TRASH_RETENTION_DAYS } from "@/constants/app-info";
import { generateUniqueName } from "@/lib/utils";
import { folderSchema } from "@/schemas";
import { db, type Folder } from "../db";
import { ItemRepository } from "./item-repository";

export const FolderRepository = {
	async getAll(): Promise<Folder[]> {
		return await db.folders
			.orderBy("order")
			.filter((f) => !f.deletedAt)
			.toArray();
	},

	async query(
		params: {
			view?: "all" | "favorites" | "trash";
			parentId?: string | null;
			q?: string;
			sort?: string;
			dir?: string;
		} = {},
	): Promise<Folder[]> {
		const { view = "all", parentId, q = "", sort = "createdAt", dir = "desc" } = params;
		let results = await db.folders.toArray();

		if (view === "trash") {
			const deletedFolders = results.filter((f) => f.deletedAt);
			const deletedFolderIds = new Set(deletedFolders.map((f) => f.id));
			results = deletedFolders.filter((f) => !f.parentId || !deletedFolderIds.has(f.parentId));
		} else if (view === "favorites" && parentId === undefined) {
			results = results.filter((f) => !f.deletedAt && f.isFavorite);
		} else {
			results = results.filter((f) => !f.deletedAt);

			if (parentId !== undefined && !q.trim()) {
				results = results.filter((f) => f.parentId === parentId);
			}
		}

		if (q.trim()) {
			const query = q.toLowerCase().trim();
			results = results.filter((f) => f.name.toLowerCase().includes(query));
		}

		// Apply sorting
		results.sort((a, b) => {
			// Map "title" from Item sort to "name" for Folders
			const sortField = sort === "title" ? "name" : (sort as keyof Folder);
			let valA = a[sortField];
			let valB = b[sortField];

			if (valA === undefined || valA === null) valA = "";
			if (valB === undefined || valB === null) valB = "";

			if (typeof valA === "string" && typeof valB === "string") {
				return dir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
			}

			if (typeof valA === "number" && typeof valB === "number") {
				return dir === "asc" ? valA - valB : valB - valA;
			}

			return 0;
		});

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
			const parentId = parsedData.parentId || null;
			let finalName = parsedData.name.trim();

			// Handle duplicate names in the same parent folder
			const siblings = await db.folders
				.filter((f) => f.parentId === parentId && !f.deletedAt)
				.toArray();

			const isDuplicate = siblings.some((f) => f.name.toLowerCase() === finalName.toLowerCase());
			if (isDuplicate) {
				const existingNames = new Set(siblings.map((f) => f.name.toLowerCase()));
				finalName = generateUniqueName(finalName, existingNames);
			}

			const record: Folder = {
				id: crypto.randomUUID(),
				parentId,
				name: finalName,
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
			const existingFolder = await db.folders.get(id);
			if (!existingFolder) return;

			let finalName = parsedData.name?.trim();
			const targetParentId =
				parsedData.parentId !== undefined ? parsedData.parentId : existingFolder.parentId;

			// Handle duplicate names if renaming or moving to a different parent
			if (finalName && (finalName !== existingFolder.name || parsedData.parentId !== undefined)) {
				const siblings = await db.folders
					.filter((f) => f.parentId === targetParentId && !f.deletedAt && f.id !== id)
					.toArray();

				const existingNames = new Set(siblings.map((f) => f.name.toLowerCase()));
				finalName = generateUniqueName(finalName, existingNames);
				parsedData.name = finalName;
			}

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

				for (const fId of folderIds) {
					const folder = await db.folders.get(fId);
					if (!folder) continue;

					// Check for name collisions among active (non-deleted) siblings in the target parent
					const siblings = await db.folders
						.filter((f) => f.parentId === folder.parentId && !f.deletedAt && f.id !== fId)
						.toArray();

					const reservedNames = new Set(siblings.map((f) => f.name.toLowerCase()));
					let finalName = folder.name;

					if (reservedNames.has(finalName.toLowerCase())) {
						finalName = generateUniqueName(finalName, reservedNames);
					}

					await db.folders.update(fId, {
						name: finalName,
						deletedAt: undefined,
						updatedAt: now,
					});
				}

				// Also restore items inside these folders
				const itemsToRestore = await db.items.where("folderId").anyOf(folderIds).toArray();
				const itemIds = itemsToRestore.map((i) => i.id);
				if (itemIds.length > 0) {
					await ItemRepository.restoreMany(itemIds);
				}
			}
		});
	},

	async moveMany(ids: string[], targetParentId: string | null): Promise<void> {
		const now = Date.now();
		await db.transaction("rw", db.folders, async () => {
			// Validate that targetParentId is not one of the moving folders, or a descendant of them
			if (targetParentId) {
				let currentTarget = await db.folders.get(targetParentId);
				while (currentTarget) {
					if (ids.includes(currentTarget.id)) {
						throw new Error("Cannot move a folder into itself or its subfolders.");
					}
					if (currentTarget.parentId) {
						currentTarget = await db.folders.get(currentTarget.parentId);
					} else {
						break;
					}
				}
			}

			// Get all siblings in the target folder to resolve naming conflicts
			const siblings = await db.folders
				.filter((f) => f.parentId === targetParentId && !f.deletedAt && !ids.includes(f.id))
				.toArray();

			// We track new names we assign during this loop to handle conflicts within the moved batch itself
			const reservedNames = new Set(siblings.map((f) => f.name.toLowerCase()));

			for (const id of ids) {
				const folder = await db.folders.get(id);
				if (!folder) continue;

				let finalName = folder.name;

				if (reservedNames.has(finalName.toLowerCase())) {
					finalName = generateUniqueName(finalName, reservedNames);
				}

				reservedNames.add(finalName.toLowerCase());

				await db.folders.update(id, {
					parentId: targetParentId,
					name: finalName,
					updatedAt: now,
				});
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

	async emptyExpiredTrash(): Promise<void> {
		const expiryTime = Date.now() - TRASH_RETENTION_DAYS * 24 * 60 * 60 * 1000;
		await db.transaction("rw", db.folders, async () => {
			const expiredFolders = await db.folders
				.filter((f) => !!f.deletedAt && f.deletedAt < expiryTime)
				.toArray();
			const ids = expiredFolders.map((f) => f.id);
			if (ids.length > 0) {
				await db.folders.bulkDelete(ids);
			}
		});
	},
};
