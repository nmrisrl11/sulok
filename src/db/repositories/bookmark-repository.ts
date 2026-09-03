import { bookmarkSchema } from "@/features/links/schemas/bookmark.schema";
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
		const parsedData = bookmarkSchema.parse(bookmark);
		const now = Date.now();
		const record: Bookmark = {
			id: crypto.randomUUID(),
			...parsedData,
			createdAt: now,
			updatedAt: now,
		};
		await db.bookmarks.put(record);
	},

	async update(id: string, updates: Partial<Bookmark>): Promise<void> {
		const parsedData = bookmarkSchema.partial().parse(updates);
		// Ensure system fields cannot be overwritten
		delete (parsedData as any).id;
		delete (parsedData as any).createdAt;
		delete (parsedData as any).updatedAt;

		const updateRecord = {
			...parsedData,
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
