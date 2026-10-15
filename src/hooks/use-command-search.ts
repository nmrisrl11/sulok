import { FolderRepository } from "@/db/repositories/folder-repository";
import { ItemRepository } from "@/db/repositories/item-repository";
import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";

import type { Folder, Item } from "@/db/db";

const EMPTY_ITEMS: Item[] = [];
const EMPTY_FOLDERS: Folder[] = [];

export function useCommandSearch(query: string) {
	const allItems = useLiveQuery(() => ItemRepository.getAll(), []) ?? EMPTY_ITEMS;
	const allFolders = useLiveQuery(() => FolderRepository.getAll(), []) ?? EMPTY_FOLDERS;

	const results = useMemo(() => {
		const q = query.toLowerCase().trim();

		const folderMap = new Map<string, Folder>();
		const folderCounts: Record<string, number> = {};

		for (const f of allFolders) {
			folderMap.set(f.id, f);
			if (f.parentId) {
				folderCounts[f.parentId] = (folderCounts[f.parentId] || 0) + 1;
			}
		}

		for (const item of allItems) {
			if (item.folderId) {
				folderCounts[item.folderId] = (folderCounts[item.folderId] || 0) + 1;
			}
		}

		// If no query, return 5 recent items/folders by default
		if (!q) {
			return {
				folders: [...allFolders].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5),
				items: allItems.slice(0, 5),
				folderMap,
				folderCounts,
			};
		}

		// Filter folders (limit to 50 when searching)
		const filteredFolders = allFolders.filter((f) => f.name.toLowerCase().includes(q)).slice(0, 50);

		// Filter items (search by title, url, domain, or description - limit to 50 when searching)
		const filteredItems = allItems
			.filter((item) => {
				const domainMatch = (() => {
					try {
						return new URL(item.url).hostname.replace(/^www\./, "").includes(q);
					} catch {
						return false;
					}
				})();

				return (
					item.title?.toLowerCase().includes(q) ||
					item.url.toLowerCase().includes(q) ||
					domainMatch ||
					item.description?.toLowerCase().includes(q) ||
					item.note?.toLowerCase().includes(q)
				);
			})
			.slice(0, 50);

		return {
			folders: filteredFolders,
			items: filteredItems,
			folderMap,
			folderCounts,
		};
	}, [query, allItems, allFolders]);

	return results;
}
