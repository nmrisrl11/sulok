import { FolderRepository } from "@/db/repositories/folder-repository";
import { ItemRepository } from "@/db/repositories/item-repository";
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

export async function parseImportFile(file: File): Promise<ParsedImportData> {
	const normalizeUrl = (u: string) => {
		try {
			const parsed = new URL(u);
			return parsed.host.replace(/^www\./, "") + parsed.pathname.replace(/\/$/, "") + parsed.search;
		} catch {
			return u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
		}
	};

	const existingItems = await ItemRepository.getAll();
	const existingUrls = new Set(existingItems.map((item) => normalizeUrl(item.url)));

	const existingFolders = await FolderRepository.getAll();
	const existingFolderNamesByParent = new Map<string, Set<string>>();

	for (const folder of existingFolders) {
		const parentId = folder.parentId || "root";
		if (!existingFolderNamesByParent.has(parentId)) {
			existingFolderNamesByParent.set(parentId, new Set());
		}
		existingFolderNamesByParent.get(parentId)!.add(folder.name.toLowerCase());
	}

	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => {
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
				} else {
					reject(new Error("Unsupported file format. Please upload JSON, CSV, or TXT."));
					return;
				}

				const validFolders: ParsedImportFolder[] = [];
				const validItems: ParsedImportItem[] = [];
				let invalidCount = 0;
				let duplicateCount = 0;

				for (const folder of parsedData.folders || []) {
					const result = importFolderSchema.safeParse(folder);
					if (result.success) {
						const parentId = result.data.parentId || "root";
						const folderNameLower = result.data.name.toLowerCase();

						const parentSet = existingFolderNamesByParent.get(parentId);
						const isDuplicate = parentSet ? parentSet.has(folderNameLower) : false;

						if (isDuplicate) {
							duplicateCount++;
						} else {
							if (!existingFolderNamesByParent.has(parentId)) {
								existingFolderNamesByParent.set(parentId, new Set());
							}
							existingFolderNamesByParent.get(parentId)!.add(folderNameLower);
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

				resolve({ validFolders, validItems, invalidCount, duplicateCount });
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
