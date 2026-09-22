import { db, type Folder, type Item } from "@/db/db";

export const stressTest = async (count: number) => {
	console.time("stressTest:generate");
	const folders: Folder[] = [];
	const items: Item[] = [];

	const now = Date.now();
	for (let i = 0; i < count; i++) {
		if (i % 2 === 0) {
			folders.push({
				id: crypto.randomUUID(),
				parentId: null,
				name: `Stress Folder ${i}`,
				createdAt: now + i,
				updatedAt: now + i,
				order: i,
			});
		} else {
			items.push({
				id: crypto.randomUUID(),
				url: `https://example.com/${i}`,
				title: `Stress Item ${i}`,
				createdAt: now + i,
				updatedAt: now + i,
			});
		}
	}
	console.timeEnd("stressTest:generate");

	console.time("stressTest:insert");
	await db.transaction("rw", db.folders, db.items, async () => {
		if (folders.length > 0) await db.folders.bulkAdd(folders);
		if (items.length > 0) await db.items.bulkAdd(items);
	});
	console.timeEnd("stressTest:insert");

	console.log(
		`Successfully added ${folders.length} folders and ${items.length} items. Total: ${count}`,
	);
};

export const clearStressTest = async () => {
	await db.transaction("rw", db.folders, db.items, async () => {
		const foldersToDelete = await db.folders
			.filter((f) => f.name.startsWith("Stress Folder"))
			.primaryKeys();
		const itemsToDelete = await db.items
			.filter((i) => i.title?.startsWith("Stress Item") ?? false)
			.primaryKeys();

		await db.folders.bulkDelete(foldersToDelete);
		await db.items.bulkDelete(itemsToDelete);

		console.log(`Cleared ${foldersToDelete.length} folders and ${itemsToDelete.length} items.`);
	});
};

if (typeof window !== "undefined") {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(window as any).stressTest = stressTest;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(window as any).clearStressTest = clearStressTest;
}
