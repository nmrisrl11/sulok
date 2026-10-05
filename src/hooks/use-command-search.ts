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
		for (const f of allFolders) {
			folderMap.set(f.id, f);
		}

		// If no query, return 5 recent items/folders by default
		if (!q) {
			return {
				folders: allFolders.slice(0, 5),
				items: allItems.slice(0, 5),
				folderMap,
			};
		}

		// Filter folders (no limit when searching)
		const filteredFolders = allFolders.filter((f) => f.name.toLowerCase().includes(q));

		// Filter items (search by title, url, domain, or description - no limit when searching)
		const filteredItems = allItems.filter((item) => {
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
				item.description?.toLowerCase().includes(q)
			);
		});

		return {
			folders: filteredFolders,
			items: filteredItems,
			folderMap,
		};
	}, [query, allItems, allFolders]);

	return results;
}
