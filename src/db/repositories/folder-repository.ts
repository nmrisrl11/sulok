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

	async getItemCounts(): Promise<Record<string, number>> {
		const counts: Record<string, number> = {};

		// Count items grouped by folder (active items to their folderId, trashed items cascaded with a folder to cascadeParentId)
		await db.items
			.filter((item) => (!item.deletedAt && !!item.folderId) || !!item.cascadeParentId)
			.each((item) => {
				const fId = item.cascadeParentId || item.folderId!;
				counts[fId] = (counts[fId] || 0) + 1;
			});

		// Count subfolders grouped by parent folder (active subfolders to parentId, trashed subfolders cascaded with a folder to cascadeParentId)
		await db.folders
			.filter((folder) => (!folder.deletedAt && !!folder.parentId) || !!folder.cascadeParentId)
			.each((folder) => {
				const pId = folder.cascadeParentId || folder.parentId!;
				counts[pId] = (counts[pId] || 0) + 1;
			});

		return counts;
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
			results = results.filter((f) => f.deletedAt && !f.cascadeParentId);
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

	async importFolder(
		folder: Omit<Folder, "id" | "createdAt" | "updatedAt" | "order"> & {
			id?: string;
			createdAt?: number;
			updatedAt?: number;
			order?: number;
		},
	): Promise<string> {
		const parsedData = folderSchema.parse(folder);
		const now = Date.now();
		let importedId = "";

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

			let newId = folder.id || crypto.randomUUID();
			if (folder.id) {
				const existing = await db.folders.get(folder.id);
				if (existing) {
					newId = crypto.randomUUID();
				}
			}
			importedId = newId;

			const record: Folder = {
				id: newId,
				parentId,
				name: finalName,
				createdAt: folder.createdAt ?? now,
				updatedAt: folder.updatedAt ?? now,
				order: folder.order ?? count,
			};
			await db.folders.add(record);
		});

		return importedId;
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
			// Find all subfolders recursively that were deleted with this folder (or active subfolders)
			const foldersToDelete = new Set<string>([id]);
			let queue = [id];

			while (queue.length > 0) {
				const currentId = queue.shift()!;
				const children = await db.folders
					.filter((f) => f.parentId === currentId && (f.cascadeParentId === id || !f.deletedAt))
					.toArray();
				for (const child of children) {
					foldersToDelete.add(child.id);
					queue.push(child.id);
				}
			}

			const folderIds = Array.from(foldersToDelete);

			// Delete items that were cascade-deleted with this folder or active in it
			const itemsToDelete = await db.items
				.where("folderId")
				.anyOf(folderIds)
				.filter((item) => item.cascadeParentId === id || !item.deletedAt)
				.toArray();
			const itemIdsToDelete = itemsToDelete.map((i) => i.id);
			if (itemIdsToDelete.length > 0) {
				await db.items.bulkDelete(itemIdsToDelete);
			}

			// Items in these folders that were individually deleted beforehand:
			// Unset their folderId so they remain safe in the Recycle Bin as unorganized
			const itemsToOrphan = await db.items
				.where("folderId")
				.anyOf(folderIds)
				.filter((item) => !!item.deletedAt && item.cascadeParentId !== id)
				.toArray();
			for (const item of itemsToOrphan) {
				await db.items.update(item.id, { folderId: undefined });
			}

			// Child folders that were individually deleted beforehand:
			// Unset their parentId so they remain safe in the Recycle Bin as root
			const foldersToOrphan = await db.folders
				.filter(
					(f) =>
						f.parentId !== null &&
						folderIds.includes(f.parentId) &&
						!!f.deletedAt &&
						f.cascadeParentId !== id,
				)
				.toArray();
			for (const f of foldersToOrphan) {
				await db.folders.update(f.id, { parentId: null });
			}

			// Delete the folders
			await db.folders.bulkDelete(folderIds);
		});
	},

	async deleteMany(ids: string[]): Promise<void> {
		await db.transaction("rw", db.folders, db.items, async () => {
			for (const id of ids) {
				await FolderRepository.delete(id);
			}
		});
	},

	async softDelete(ids: string[]): Promise<void> {
		const now = Date.now();
		await db.transaction("rw", db.folders, db.items, async () => {
			for (const id of ids) {
				const folder = await db.folders.get(id);
				if (!folder || (folder.deletedAt === now && folder.cascadeParentId)) {
					continue;
				}

				// Mark the target folder as deleted directly
				await db.folders.update(id, {
					deletedAt: now,
					cascadeParentId: undefined,
					updatedAt: now,
				});

				// Find all active (non-deleted) descendant folders recursively
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

				// Only cascade delete items that are NOT already deleted!
				const activeItems = await db.items
					.where("folderId")
					.anyOf(allAffectedFolderIds)
					.filter((item) => !item.deletedAt)
					.toArray();

				const activeItemIds = activeItems.map((i) => i.id);
				if (activeItemIds.length > 0) {
					await db.items
						.where("id")
						.anyOf(activeItemIds)
						.modify({ deletedAt: now, cascadeParentId: id, updatedAt: now });
				}
			}
		});
	},

	async restore(ids: string[]): Promise<void> {
		const now = Date.now();
		await db.transaction("rw", db.folders, db.items, async () => {
			for (const id of ids) {
				const folder = await db.folders.get(id);
				if (!folder) continue;

				let targetParentId = folder.parentId;
				if (targetParentId) {
					const parent = await db.folders.get(targetParentId);
					if (!parent || parent.deletedAt) {
						targetParentId = null;
					}
				}

				// Check for name collisions among active (non-deleted) siblings in the target parent
				const siblings = await db.folders
					.filter((f) => f.parentId === targetParentId && !f.deletedAt && f.id !== id)
					.toArray();

				const reservedNames = new Set(siblings.map((f) => f.name.toLowerCase()));
				let finalName = folder.name;

				if (reservedNames.has(finalName.toLowerCase())) {
					finalName = generateUniqueName(finalName, reservedNames);
				}

				await db.folders.update(id, {
					parentId: targetParentId,
					name: finalName,
					deletedAt: undefined,
					cascadeParentId: undefined,
					updatedAt: now,
				});

				// Find and restore any child folders that were cascade-deleted with this folder
				const cascadeFolders = await db.folders.filter((f) => f.cascadeParentId === id).toArray();
				for (const child of cascadeFolders) {
					const childSiblings = await db.folders
						.filter((f) => f.parentId === child.parentId && !f.deletedAt && f.id !== child.id)
						.toArray();
					const childReserved = new Set(childSiblings.map((f) => f.name.toLowerCase()));
					let childName = child.name;
					if (childReserved.has(childName.toLowerCase())) {
						childName = generateUniqueName(childName, childReserved);
					}
					await db.folders.update(child.id, {
						name: childName,
						deletedAt: undefined,
						cascadeParentId: undefined,
						updatedAt: now,
					});
				}

				// Find and restore any items that were cascade-deleted with this folder
				const cascadeItems = await db.items.filter((i) => i.cascadeParentId === id).toArray();
				const cascadeItemIds = cascadeItems.map((i) => i.id);
				if (cascadeItemIds.length > 0) {
					await ItemRepository.restoreMany(cascadeItemIds);
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
