import { TRASH_RETENTION_DAYS } from "@/constants/app-info";
import { setHasDataHint } from "@/lib/storage";
import { generateUniqueName } from "@/lib/utils";
import { itemSchema } from "@/schemas";
import { db, type Item } from "../db";

export const ItemRepository = {
	async getAll(): Promise<Item[]> {
		return await db.items
			.orderBy("createdAt")
			.filter((item) => !item.deletedAt)
			.reverse()
			.toArray();
	},

	async query(params: {
		q?: string;
		sort?: string;
		dir?: string;
		folderId?: string | null;
		view?: "all" | "favorites" | "trash";
	}): Promise<Item[]> {
		const { q = "", sort = "createdAt", dir = "desc", folderId, view = "all" } = params;

		let results = await db.items.toArray();

		if (view === "trash") {
			const deletedFolders = await db.folders.filter((f) => !!f.deletedAt).toArray();
			const deletedFolderIds = new Set(deletedFolders.map((f) => f.id));

			results = results.filter(
				(item) => item.deletedAt && (!item.folderId || !deletedFolderIds.has(item.folderId)),
			);
		} else if (view === "favorites" && folderId === undefined) {
			results = results.filter((item) => !item.deletedAt && item.isFavorite);
		} else {
			results = results.filter((item) => !item.deletedAt);
		}

		if (folderId !== undefined && !q.trim()) {
			if (folderId === "unorganized" || folderId === null) {
				results = results.filter((item) => !item.folderId);
			} else {
				results = results.filter((item) => item.folderId === folderId);
			}
		}

		if (q.trim()) {
			const query = q.toLowerCase().trim();
			results = results.filter(
				(item) =>
					item.title?.toLowerCase().includes(query) ||
					item.url.toLowerCase().includes(query) ||
					item.description?.toLowerCase().includes(query),
			);
		}

		results.sort((a, b) => {
			let valA = a[sort as keyof Item];
			let valB = b[sort as keyof Item];

			// Handle undefined values
			if (valA === undefined) valA = "";
			if (valB === undefined) valB = "";

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

	queryAllSorted(): Promise<Item[]> {
		return db.items
			.orderBy("createdAt")
			.filter((item) => !item.deletedAt)
			.reverse()
			.toArray();
	},

	async getById(id: string): Promise<Item | undefined> {
		return await db.items.get(id);
	},

	async findByUrl(url: string): Promise<Item | undefined> {
		const exactMatch = await db.items.where("url").equals(url).first();
		if (exactMatch) return exactMatch;

		const normalize = (u: string) => {
			try {
				const parsed = new URL(u);
				return (
					parsed.host.replace(/^www\./, "") + parsed.pathname.replace(/\/$/, "") + parsed.search
				);
			} catch {
				return u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
			}
		};

		const target = normalize(url);
		const allItems = await db.items.toArray();
		return allItems.find((item) => normalize(item.url) === target);
	},

	async count(): Promise<number> {
		return await db.items.count();
	},

	async save(item: Omit<Item, "id" | "createdAt" | "updatedAt">): Promise<void> {
		const parsedData = itemSchema.parse(item);
		const url = parsedData.url as string;
		const now = Date.now();

		await db.transaction("rw", db.items, async () => {
			const existing = await ItemRepository.findByUrl(url);
			if (existing) {
				throw new Error("This link is already in your corner.");
			}

			let finalTitle = parsedData.title?.trim() || "";
			const folderId = parsedData.folderId || null;

			if (finalTitle) {
				const siblings = await db.items
					.filter((item) => (item.folderId || null) === folderId && !item.deletedAt)
					.toArray();

				const isDuplicate = siblings.some(
					(item) => (item.title || "").toLowerCase() === finalTitle.toLowerCase(),
				);
				if (isDuplicate) {
					const existingNames = new Set(siblings.map((i) => (i.title || "").toLowerCase()));
					finalTitle = generateUniqueName(finalTitle, existingNames);
					parsedData.title = finalTitle;
				}
			}

			const record: Item = {
				id: crypto.randomUUID(),
				...parsedData,
				url,
				createdAt: now,
				updatedAt: now,
			};
			await db.items.put(record);
		});

		setHasDataHint(true);
	},

	async importItem(
		item: Omit<Item, "id" | "createdAt" | "updatedAt"> & {
			id?: string;
			createdAt?: number;
			updatedAt?: number;
		},
	): Promise<void> {
		const parsedData = itemSchema.parse(item);
		const url = parsedData.url as string;
		const now = Date.now();

		await db.transaction("rw", db.items, async () => {
			const existing = await ItemRepository.findByUrl(url);
			if (existing) {
				if (existing.deletedAt) {
					// The item is in the recycle bin. Let's restore it with the imported data!
					let finalTitle = parsedData.title?.trim();
					if (finalTitle) {
						const folderId = parsedData.folderId || null;
						const siblings = await db.items
							.filter(
								(i) => (i.folderId || null) === folderId && !i.deletedAt && i.id !== existing.id,
							)
							.toArray();

						const isDuplicate = siblings.some(
							(i) => (i.title || "").toLowerCase() === finalTitle!.toLowerCase(),
						);
						if (isDuplicate) {
							const existingNames = new Set(siblings.map((i) => (i.title || "").toLowerCase()));
							finalTitle = generateUniqueName(finalTitle, existingNames);
							parsedData.title = finalTitle;
						}
					}

					await db.items.update(existing.id, {
						...parsedData,
						deletedAt: undefined,
						updatedAt: now,
					});
					return;
				}

				throw new Error("This link is already in your corner.");
			}

			let finalTitle = parsedData.title?.trim();
			if (finalTitle) {
				const folderId = parsedData.folderId || null;
				const siblings = await db.items
					.filter((i) => (i.folderId || null) === folderId && !i.deletedAt)
					.toArray();

				const isDuplicate = siblings.some(
					(i) => (i.title || "").toLowerCase() === finalTitle!.toLowerCase(),
				);
				if (isDuplicate) {
					const existingNames = new Set(siblings.map((i) => (i.title || "").toLowerCase()));
					finalTitle = generateUniqueName(finalTitle, existingNames);
					parsedData.title = finalTitle;
				}
			}

			const record: Item = {
				id: item.id || crypto.randomUUID(),
				...parsedData,
				url,
				createdAt: item.createdAt ?? now,
				updatedAt: item.updatedAt ?? now,
			};
			await db.items.add(record);
		});

		setHasDataHint(true);
	},

	async update(id: string, updates: Partial<Item>): Promise<void> {
		const parsedData = itemSchema.partial().parse(updates);

		// Ensure system fields cannot be overwritten, without using `any`
		const {
			id: _id,
			createdAt: _createdAt,
			updatedAt: _updatedAt,
			...safeUpdates
		} = parsedData as Partial<Item>;

		await db.transaction("rw", db.items, async () => {
			const existingItem = await db.items.get(id);
			if (!existingItem) return;

			if (safeUpdates.url) {
				const existingUrl = await ItemRepository.findByUrl(safeUpdates.url);
				if (existingUrl && existingUrl.id !== id) {
					throw new Error("This link is already in your corner.");
				}
			}

			let finalTitle =
				safeUpdates.title !== undefined ? safeUpdates.title?.trim() : existingItem.title;
			const targetFolderId =
				safeUpdates.folderId !== undefined ? safeUpdates.folderId : existingItem.folderId;

			// Handle duplicate titles if renaming or moving to a different folder
			if (finalTitle && (finalTitle !== existingItem.title || safeUpdates.folderId !== undefined)) {
				const siblings = await db.items
					.filter(
						(item) =>
							(item.folderId || null) === (targetFolderId || null) &&
							!item.deletedAt &&
							item.id !== id,
					)
					.toArray();

				const existingNames = new Set(siblings.map((i) => (i.title || "").toLowerCase()));
				finalTitle = generateUniqueName(finalTitle, existingNames);
				safeUpdates.title = finalTitle;
			}

			const updateRecord = {
				...safeUpdates,
				updatedAt: Date.now(),
			};
			await db.items.update(id, updateRecord);
		});
	},

	async delete(id: string): Promise<void> {
		await db.items.delete(id);
		const count = await db.items.count();
		if (count === 0) {
			setHasDataHint(false);
		}
	},

	async deleteAll(): Promise<void> {
		await db.items.clear();
		setHasDataHint(false);
	},

	async deleteMany(ids: string[]): Promise<void> {
		await db.items.bulkDelete(ids);
		const count = await db.items.count();
		if (count === 0) {
			setHasDataHint(false);
		}
	},

	async softDeleteMany(ids: string[]): Promise<void> {
		const now = Date.now();
		await db.transaction("rw", db.items, async () => {
			for (const id of ids) {
				await db.items.update(id, { deletedAt: now, updatedAt: now });
			}
		});
	},

	async restoreMany(ids: string[]): Promise<void> {
		const now = Date.now();
		await db.transaction("rw", db.items, async () => {
			for (const id of ids) {
				const item = await db.items.get(id);
				if (!item) continue;

				let finalTitle = item.title || "";
				if (finalTitle) {
					// Check for name collisions among active (non-deleted) siblings in the target folder
					const siblings = await db.items
						.filter(
							(i) =>
								(i.folderId || null) === (item.folderId || null) && !i.deletedAt && i.id !== id,
						)
						.toArray();

					const reservedTitles = new Set(siblings.map((i) => (i.title || "").toLowerCase()));

					if (reservedTitles.has(finalTitle.toLowerCase())) {
						finalTitle = generateUniqueName(finalTitle, reservedTitles);
					}
				}

				await db.items.update(id, {
					title: finalTitle,
					deletedAt: undefined,
					updatedAt: now,
				});
			}
		});
	},

	async moveMany(ids: string[], targetFolderId: string | null): Promise<void> {
		const now = Date.now();
		await db.transaction("rw", db.items, async () => {
			// Get all siblings in the target folder to resolve naming conflicts
			const siblings = await db.items
				.filter(
					(item) =>
						(item.folderId || null) === targetFolderId && !item.deletedAt && !ids.includes(item.id),
				)
				.toArray();

			const reservedTitles = new Set(siblings.map((item) => (item.title || "").toLowerCase()));

			for (const id of ids) {
				const item = await db.items.get(id);
				if (!item) continue;

				let finalTitle = item.title || "";
				if (finalTitle) {
					if (reservedTitles.has(finalTitle.toLowerCase())) {
						finalTitle = generateUniqueName(finalTitle, reservedTitles);
					}

					reservedTitles.add(finalTitle.toLowerCase());
				}

				await db.items.update(id, {
					folderId: targetFolderId ?? undefined,
					title: finalTitle,
					updatedAt: now,
				});
			}
		});
	},

	async toggleFavorite(id: string): Promise<boolean> {
		let isFav = false;
		await db.transaction("rw", db.items, async () => {
			const item = await db.items.get(id);
			if (item) {
				isFav = !item.isFavorite;
				await db.items.update(id, { isFavorite: isFav, updatedAt: Date.now() });
			}
		});
		return isFav;
	},

	async emptyTrash(): Promise<void> {
		await db.transaction("rw", db.items, async () => {
			const trashItems = await db.items.filter((item) => !!item.deletedAt).toArray();
			const ids = trashItems.map((item) => item.id);
			await db.items.bulkDelete(ids);
		});
		const count = await db.items.count();
		if (count === 0) {
			setHasDataHint(false);
		}
	},

	async emptyExpiredTrash(): Promise<void> {
		const expiryTime = Date.now() - TRASH_RETENTION_DAYS * 24 * 60 * 60 * 1000;
		await db.transaction("rw", db.items, async () => {
			const expiredItems = await db.items
				.filter((item) => !!item.deletedAt && item.deletedAt < expiryTime)
				.toArray();
			const ids = expiredItems.map((item) => item.id);
			if (ids.length > 0) {
				await db.items.bulkDelete(ids);
			}
		});
		const count = await db.items.count();
		if (count === 0) {
			setHasDataHint(false);
		}
	},
};
