import { APP_INFO } from "@/constants/app-info";
import { setHasDataHint } from "@/lib/storage";
import Dexie, { type EntityTable } from "dexie";
export interface Item {
	id: string; // UUID
	folderId?: string; // Relation to Folder
	url: string;
	title?: string;
	description?: string;
	image?: string;
	logo?: string;
	createdAt: number;
	updatedAt: number;
	deletedAt?: number;
	isFavorite?: boolean;
}

export interface Folder {
	id: string; // nanoid
	parentId: string | null; // null for root folders
	name: string;
	createdAt: number;
	updatedAt: number;
	order: number;
	deletedAt?: number;
	isFavorite?: boolean;
}

const db = new Dexie("SulokDB") as Dexie & {
	items: EntityTable<Item, "id">;
	folders: EntityTable<Folder, "id">;
};

// Schema declaration
db.version(1).stores({
	bookmarks: "id, url, title, createdAt, updatedAt",
});

db.version(2)
	.stores({
		items: "id, url, title, createdAt, updatedAt",
	})
	.upgrade((trans) => {
		// Migrate old bookmarks to the new items table
		return trans.table("bookmarks").each((bookmark) => {
			trans.table("items").put(bookmark);
		});
	});

db.version(3).stores({
	bookmarks: null, // drop legacy table
});

db.version(4)
	.stores({
		items: "id, folderId, url, title, createdAt, updatedAt",
		folders: "id, parentId, name, createdAt, updatedAt, order",
	})
	.upgrade((_trans) => {
		// Upgrade existing items to have no folderId implicitly, or we could leave it since it's optional.
		// Dexie adds the index automatically.
	});

db.version(5)
	.stores({
		items: "id, folderId, url, title, createdAt, updatedAt, deletedAt, isFavorite",
		folders: "id, parentId, name, createdAt, updatedAt, order, deletedAt, isFavorite",
	})
	.upgrade((_trans) => {
		// Add soft delete and favorite indexes
	});

db.on("populate", (transaction) => {
	transaction.on("abort", () => {
		setHasDataHint(false);
	});

	const now = Date.now();
	const welcomeFolderId = crypto.randomUUID();

	transaction.table("folders").add({
		id: welcomeFolderId,
		parentId: null,
		name: `Welcome to ${APP_INFO.name}`,
		createdAt: now,
		updatedAt: now,
		order: 0,
	});

	transaction.table("items").add({
		id: crypto.randomUUID(),
		folderId: welcomeFolderId,
		url: `https://${APP_INFO.appUrl}`,
		title: APP_INFO.title,
		description: APP_INFO.description,
		image: `https://${APP_INFO.appUrl}/og-image.png`,
		logo: `https://${APP_INFO.appUrl}/favicon.svg`,
		createdAt: now,
		updatedAt: now,
	});

	setHasDataHint(true);
});

export { db };
