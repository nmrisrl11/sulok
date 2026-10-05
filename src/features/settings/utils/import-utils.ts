import { FolderRepository } from "@/db/repositories/folder-repository";
import { ItemRepository } from "@/db/repositories/item-repository";
import { normalizeUrl } from "@/lib/utils";
import {
	importFolderSchema,
	importItemSchema,
	type ImportFolder,
	type ImportItem,
} from "@/schemas";

export type ParsedImportItem = ImportItem & {
	isDuplicate: boolean;
};

export type ParsedImportFolder = ImportFolder & {
	isDuplicate: boolean;
};

export type ParsedImportData = {
	validFolders: ParsedImportFolder[];
	validItems: ParsedImportItem[];
	invalidCount: number;
	duplicateCount: number;
};

export async function processImportPayload(parsedData: {
	folders: unknown[];
	items: unknown[];
}): Promise<ParsedImportData> {
	const existingItems = await ItemRepository.getAll();
	const existingUrls = new Set(existingItems.map((item) => normalizeUrl(item.url)));

	const existingFolders = await FolderRepository.getAll();
	const existingFolderIdsByParentAndName = new Map<string, Map<string, string>>();

	for (const folder of existingFolders) {
		const parentId = folder.parentId || "root";
		if (!existingFolderIdsByParentAndName.has(parentId)) {
			existingFolderIdsByParentAndName.set(parentId, new Map());
		}
		existingFolderIdsByParentAndName.get(parentId)!.set(folder.name.toLowerCase(), folder.id);
	}

	const validFolders: ParsedImportFolder[] = [];
	const validItems: ParsedImportItem[] = [];
	let invalidCount = 0;
	let duplicateCount = 0;

	const importIdToResolvedId = new Map<string, string>();

	for (const folder of parsedData.folders || []) {
		const result = importFolderSchema.safeParse(folder);
		if (result.success) {
			let checkParentId = result.data.parentId || "root";

			// Resolve mapped parent ID if it points to a duplicate or newly mapped folder
			if (importIdToResolvedId.has(checkParentId)) {
				checkParentId = importIdToResolvedId.get(checkParentId)!;
				result.data.parentId = checkParentId === "root" ? undefined : checkParentId;
			}

			const folderNameLower = result.data.name.toLowerCase();

			const parentMap = existingFolderIdsByParentAndName.get(checkParentId);
			const existingFolderId = parentMap ? parentMap.get(folderNameLower) : undefined;
			const isDuplicate = !!existingFolderId;

			if (isDuplicate) {
				duplicateCount++;
				if (result.data.id) {
					importIdToResolvedId.set(result.data.id, existingFolderId);
					result.data.id = existingFolderId;
				}
			} else {
				if (result.data.id) {
					importIdToResolvedId.set(result.data.id, result.data.id);
				}
				if (!existingFolderIdsByParentAndName.has(checkParentId)) {
					existingFolderIdsByParentAndName.set(checkParentId, new Map());
				}
				existingFolderIdsByParentAndName.get(checkParentId)!.set(folderNameLower, result.data.id!);
			}

			validFolders.push({
				...result.data,
				isDuplicate,
			});
		} else {
			invalidCount++;
		}
	}

	for (const item of parsedData.items || []) {
		const result = importItemSchema.safeParse(item);
		if (result.success) {
			let checkFolderId = result.data.folderId || "root";
			if (importIdToResolvedId.has(checkFolderId)) {
				checkFolderId = importIdToResolvedId.get(checkFolderId)!;
				result.data.folderId = checkFolderId === "root" ? undefined : checkFolderId;
			}

			const normalizedUrl = normalizeUrl(result.data.url);
			const isDuplicate = existingUrls.has(normalizedUrl);

			if (isDuplicate) {
				duplicateCount++;
			} else {
				existingUrls.add(normalizedUrl);
			}

			validItems.push({
				...result.data,
				isDuplicate,
			});
		} else {
			invalidCount++;
		}
	}

	return { validFolders, validItems, invalidCount, duplicateCount };
}

export async function parseImportFile(file: File): Promise<ParsedImportData> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = async (e) => {
			try {
				const content = e.target?.result as string;
				let parsedData: { folders: unknown[]; items: unknown[] } = { folders: [], items: [] };

				if (file.name.endsWith(".json") || file.type === "application/json") {
					const data = JSON.parse(content);
					if (Array.isArray(data)) {
						parsedData.items = data;
					} else if (typeof data === "object" && data !== null) {
						parsedData.folders = ((data as Record<string, unknown>).folders as unknown[]) || [];
						parsedData.items = ((data as Record<string, unknown>).items as unknown[]) || [];
					}
				} else if (file.name.endsWith(".csv") || file.type === "text/csv") {
					parsedData = parseCSV(content);
				} else if (file.name.endsWith(".txt") || file.type === "text/plain") {
					parsedData = parseTXT(content);
				} else if (file.name.endsWith(".html") || file.type === "text/html") {
					parsedData = parseHTML(content);
				} else {
					reject(new Error("Unsupported file format. Please upload JSON, CSV, TXT, or HTML."));
					return;
				}

				const result = await processImportPayload(parsedData);
				resolve(result);
			} catch {
				reject(new Error("Failed to parse file. Make sure it is formatted correctly."));
			}
		};
		reader.onerror = () => reject(new Error("Failed to read file."));
		reader.readAsText(file);
	});
}

function parseCSV(content: string): { folders: unknown[]; items: unknown[] } {
	const folders: Record<string, unknown>[] = [];
	const items: Record<string, unknown>[] = [];

	let pos = 0;

	const nextToken = (): { value: string; isEndOfRow: boolean; isEOF: boolean } => {
		if (pos >= content.length) return { value: "", isEndOfRow: true, isEOF: true };

		let value = "";
		let inQuotes = false;

		while (pos < content.length) {
			const char = content[pos];

			if (inQuotes) {
				if (char === '"') {
					if (pos + 1 < content.length && content[pos + 1] === '"') {
						value += '"';
						pos += 2;
					} else {
						inQuotes = false;
						pos++;
					}
				} else {
					value += char;
					pos++;
				}
			} else {
				if (char === '"') {
					inQuotes = true;
					pos++;
				} else if (char === ",") {
					pos++;
					return { value, isEndOfRow: false, isEOF: false };
				} else if (char === "\n") {
					pos++;
					return { value, isEndOfRow: true, isEOF: false };
				} else if (char === "\r") {
					pos++;
					if (pos < content.length && content[pos] === "\n") {
						pos++;
					}
					return { value, isEndOfRow: true, isEOF: false };
				} else {
					value += char;
					pos++;
				}
			}
		}

		return { value, isEndOfRow: true, isEOF: true };
	};

	let row: string[] = [];
	let eof = false;
	const rows: string[][] = [];

	while (!eof) {
		const token = nextToken();
		row.push(token.value);
		if (token.isEndOfRow) {
			if (!(token.isEOF && row.length === 1 && row[0] === "")) {
				rows.push(row);
			}
			row = [];
		}
		eof = token.isEOF;
	}

	if (rows.length < 2) return { folders, items };

	const headers = rows[0].map((h) => h.trim());

	// Determine if it's the new format (with "type") or old format
	const isNewFormat = headers[0] === "type";

	for (let i = 1; i < rows.length; i++) {
		const obj: Record<string, unknown> = {};
		const currentRow = rows[i];

		if (isNewFormat) {
			const type = (currentRow[0] || "").trim().toLowerCase();
			if (type === "folder") {
				obj.id = currentRow[1]?.trim();
				obj.name = currentRow[2]?.trim();
				obj.parentId = currentRow[7]?.trim();
				obj.createdAt = currentRow[8]?.trim();
				obj.updatedAt = currentRow[9]?.trim();

				// clean up
				for (const k in obj) {
					if (/^'[=+\-@]/.test(obj[k] as string)) {
						obj[k] = (obj[k] as string).substring(1);
					}
				}
				folders.push(obj);
			} else if (type === "item") {
				obj.id = currentRow[1]?.trim();
				obj.url = currentRow[2]?.trim();
				obj.title = currentRow[3]?.trim();
				obj.description = currentRow[4]?.trim();
				obj.image = currentRow[5]?.trim();
				obj.logo = currentRow[6]?.trim();
				obj.folderId = currentRow[7]?.trim();
				obj.createdAt = currentRow[8]?.trim();
				obj.updatedAt = currentRow[9]?.trim();
				obj.note = currentRow[10]?.trim();

				for (const k in obj) {
					if (/^'[=+\-@]/.test(obj[k] as string)) {
						obj[k] = (obj[k] as string).substring(1);
					}
				}
				items.push(obj);
			}
			continue;
		}

		// Fallback for old format
		headers.forEach((header, index) => {
			let val = currentRow[index] || "";
			val = val.trim();

			if (/^'[=+\-@]/.test(val)) {
				val = val.substring(1);
			}

			if (header === "createdAt" || header === "updatedAt") {
				if (val !== "") {
					if (/^\d+$/.test(val)) {
						obj[header] = Number(val);
					} else {
						obj[header] = val; // let Zod parse ISO string
					}
				}
			} else {
				obj[header] = val;
			}
		});
		items.push(obj);
	}

	return { folders, items };
}

function parseTXT(content: string): { folders: unknown[]; items: unknown[] } {
	const folders: Record<string, string>[] = [];
	const items: Record<string, string>[] = [];

	const blocks = content.split(/\n---\n|\r\n---\r\n/);

	for (const block of blocks) {
		const lines = block
			.split("\n")
			.map((l) => l.trim())
			.filter(Boolean);
		if (lines.length === 0) continue;

		const obj: Record<string, string> = {};
		for (const line of lines) {
			const lowerLine = line.toLowerCase();
			if (lowerLine.startsWith("type: ")) {
				obj.type = line.substring(6).trim().toLowerCase();
			} else if (lowerLine.startsWith("id: ")) {
				obj.id = line.substring(4).trim();
			} else if (lowerLine.startsWith("url: ")) {
				obj.url = line.substring(5).trim();
			} else if (lowerLine.startsWith("name: ")) {
				obj.name = line.substring(6).trim();
			} else if (lowerLine.startsWith("title: ")) {
				obj.title = line.substring(7).trim();
			} else if (lowerLine.startsWith("description: ")) {
				obj.description = line.substring(13).trim();
			} else if (lowerLine.startsWith("image: ")) {
				obj.image = line.substring(7).trim();
			} else if (lowerLine.startsWith("logo: ")) {
				obj.logo = line.substring(6).trim();
			} else if (lowerLine.startsWith("folderid: ")) {
				obj.folderId = line.substring(10).trim();
			} else if (lowerLine.startsWith("parentid: ")) {
				obj.parentId = line.substring(10).trim();
			} else if (lowerLine.startsWith("createdat: ")) {
				obj.createdAt = line.substring(11).trim();
			} else if (lowerLine.startsWith("updatedat: ")) {
				obj.updatedAt = line.substring(11).trim();
			} else if (lowerLine.startsWith("note: ")) {
				obj.note = line.substring(6).trim();
			} else if (!obj.url && line.startsWith("http")) {
				obj.url = line;
			}
		}

		if (obj.type === "folder" || (!obj.url && obj.name)) {
			folders.push(obj);
		} else if (obj.url) {
			items.push(obj);
		}
	}

	// Fallback for simple line-by-line format
	if (items.length === 0 && folders.length === 0) {
		const lines = content
			.split("\n")
			.map((l) => l.trim())
			.filter(Boolean);
		return { folders: [], items: lines.map((line) => ({ url: line })) };
	}

	return { folders, items };
}

function parseHTML(content: string): { folders: unknown[]; items: unknown[] } {
	const folders: Record<string, unknown>[] = [];
	const items: Record<string, unknown>[] = [];

	const parser = new DOMParser();
	const doc = parser.parseFromString(content, "text/html");

	const parseDL = (dlElement: Element, parentId: string) => {
		const children = dlElement.children;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if (child.tagName.toLowerCase() === "dt") {
				const h3 = child.querySelector("h3");
				const a = child.querySelector("a");

				if (h3) {
					const folderId = crypto.randomUUID();
					const addDate = h3.getAttribute("add_date");
					const lastModified = h3.getAttribute("last_modified");
					const name = h3.textContent?.trim() || "Untitled Folder";

					folders.push({
						id: folderId,
						name,
						parentId: parentId === "root" ? undefined : parentId,
						createdAt: addDate ? parseInt(addDate, 10) * 1000 : Date.now(),
						updatedAt: lastModified ? parseInt(lastModified, 10) * 1000 : Date.now(),
					});

					// In Netscape HTML, <DL> might be a child of <DT> (due to unclosed tags) or a sibling
					let dlToParse: Element | null = null;

					// 1. Check if it's nested inside the DT
					const childDl = child.querySelector("dl");
					if (childDl) {
						dlToParse = childDl;
					} else {
						// 2. Check if it's a sibling, possibly wrapped in a <DD> or separated by <P>
						let nextSibling = child.nextElementSibling;
						while (
							nextSibling &&
							(nextSibling.tagName.toLowerCase() === "p" ||
								nextSibling.tagName.toLowerCase() === "dd")
						) {
							if (nextSibling.tagName.toLowerCase() === "dd") {
								const nestedInDd = nextSibling.querySelector("dl");
								if (nestedInDd) {
									dlToParse = nestedInDd;
									break;
								}
							}
							nextSibling = nextSibling.nextElementSibling;
						}

						if (!dlToParse && nextSibling && nextSibling.tagName.toLowerCase() === "dl") {
							dlToParse = nextSibling;
						}
					}

					if (dlToParse) {
						parseDL(dlToParse, folderId);
					}
				} else if (a) {
					const itemId = crypto.randomUUID();
					const href = a.getAttribute("href") || "";
					const addDate = a.getAttribute("add_date");
					const icon = a.getAttribute("icon");
					const title = a.textContent?.trim() || href;

					if (href) {
						items.push({
							id: itemId,
							url: href,
							title,
							logo: icon || undefined,
							folderId: parentId === "root" ? undefined : parentId,
							createdAt: addDate ? parseInt(addDate, 10) * 1000 : Date.now(),
							updatedAt: Date.now(),
						});
					}
				}
			}
		}
	};

	const rootDl = doc.querySelector("dl");
	if (rootDl) {
		parseDL(rootDl, "root");
	}

	return { folders, items };
}
