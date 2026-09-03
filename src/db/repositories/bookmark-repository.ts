import { db, type Bookmark } from "../db";

export const BookmarkRepository = {
	async getAll(): Promise<Bookmark[]> {
		return await db.bookmarks.orderBy("createdAt").reverse().toArray();
	},

	queryAllSorted(): Promise<Bookmark[]> {
		return db.bookmarks.orderBy("createdAt").reverse().toArray();
	},

	async getById(id: string): Promise<Bookmark | undefined> {
		return await db.bookmarks.get(id);
	},

	async count(): Promise<number> {
		return await db.bookmarks.count();
	},

	async save(bookmark: Omit<Bookmark, "id" | "createdAt" | "updatedAt">): Promise<void> {
		const now = Date.now();
		const record: Bookmark = {
			id: crypto.randomUUID(),
			...bookmark,
			createdAt: now,
			updatedAt: now,
		};
		await db.bookmarks.put(record);
	},

	async update(id: string, updates: Partial<Bookmark>): Promise<void> {
		const updateRecord = {
			...updates,
			updatedAt: Date.now(),
		};
		await db.bookmarks.update(id, updateRecord);
	},

	async delete(id: string): Promise<void> {
		await db.bookmarks.delete(id);
	},

	async deleteAll(): Promise<void> {
		await db.bookmarks.clear();
	},
};
