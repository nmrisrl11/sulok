import Dexie, { type EntityTable } from "dexie";

export interface Item {
	id: string; // UUID
	url: string;
	title?: string;
	description?: string;
	createdAt: number;
	updatedAt: number;
}

const db = new Dexie("SulokDB") as Dexie & {
	items: EntityTable<Item, "id">;
};

// Schema declaration
db.version(1).stores({
	bookmarks: "id, url, title, createdAt, updatedAt",
});

db.version(2).stores({
	bookmarks: null, // drop legacy table
	items: "id, url, title, createdAt, updatedAt", // Primary key and indexed props
});

export { db };
export default db;
