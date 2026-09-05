import { setHasDataHint } from "@/lib/storage";
import { itemSchema } from "@/schemas/item.schema";
import { db, type Item } from "../db";

export const ItemRepository = {
	async getAll(): Promise<Item[]> {
		return await db.items.orderBy("createdAt").reverse().toArray();
	},

	async query(params: { q?: string; sort?: string; dir?: string }): Promise<Item[]> {
		const { q = "", sort = "createdAt", dir = "desc" } = params;

		let results = await db.items.toArray();

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
		return db.items.orderBy("createdAt").reverse().toArray();
	},

	async getById(id: string): Promise<Item | undefined> {
		return await db.items.get(id);
	},

	async count(): Promise<number> {
		return await db.items.count();
	},

	async save(item: Omit<Item, "id" | "createdAt" | "updatedAt">): Promise<void> {
		const parsedData = itemSchema.parse(item);
		const now = Date.now();
		const record: Item = {
			id: crypto.randomUUID(),
			...parsedData,
			url: parsedData.url as string,
			createdAt: now,
			updatedAt: now,
		};
		await db.items.put(record);
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

		const updateRecord = {
			...safeUpdates,
			updatedAt: Date.now(),
		};
		await db.items.update(id, updateRecord);
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
};
