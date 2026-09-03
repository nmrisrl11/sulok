import Dexie, { type EntityTable } from "dexie";

export interface Bookmark {
	id: string; // UUID
	url: string;
	title?: string;
	description?: string;
	createdAt: number;
	updatedAt: number;
}

const db = new Dexie("SulokDB") as Dexie & {
	bookmarks: EntityTable<Bookmark, "id">;
};

// Schema declaration
db.version(1).stores({
	bookmarks: "id, url, title, createdAt, updatedAt", // Primary key and indexed props
});

export { db };
export default db;
