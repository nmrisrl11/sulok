export interface BookmarkImportPayload {
	folders: { id: string; name: string; parentId?: string; createdAt: number; updatedAt: number }[];
	items: {
		id: string;
		url: string;
		title: string;
		folderId?: string;
		createdAt: number;
		updatedAt: number;
	}[];
}

export function parseBookmarksTree(
	nodes: chrome.bookmarks.BookmarkTreeNode[],
): BookmarkImportPayload {
	const folders: BookmarkImportPayload["folders"] = [];
	const items: BookmarkImportPayload["items"] = [];

	function traverse(node: chrome.bookmarks.BookmarkTreeNode, parentId?: string) {
		if (node.url) {
			// It's a bookmark item
			items.push({
				id: node.id,
				url: node.url,
				title: node.title || node.url,
				folderId: parentId,
				createdAt: node.dateAdded || Date.now(),
				updatedAt: Date.now(),
			});
		} else {
			// It's a folder
			const isRoot = node.id === "0";

			if (!isRoot) {
				folders.push({
					id: node.id,
					name: node.title || "Untitled Folder",
					parentId: parentId,
					createdAt: node.dateAdded || Date.now(),
					updatedAt: Date.now(),
				});
			}

			if (node.children) {
				for (const child of node.children) {
					traverse(child, isRoot ? undefined : node.id);
				}
			}
		}
	}

	for (const node of nodes) {
		traverse(node, undefined);
	}

	return { folders, items };
}
