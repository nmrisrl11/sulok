import { ItemRepository } from "@/db/repositories/item-repository";
import { importItemSchema, type ImportItem } from "@/schemas/import.schema";

export type ParsedImportItem = ImportItem & {
	isDuplicate: boolean;
};

export type ParsedImportData = {
	validItems: ParsedImportItem[];
	invalidCount: number;
	duplicateCount: number;
};

export async function parseImportFile(file: File): Promise<ParsedImportData> {
	// Pre-fetch all existing URLs to check for duplicates
	const existingItems = await ItemRepository.getAll();
	const existingUrls = new Set(existingItems.map((item) => item.url.toLowerCase()));

	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const content = e.target?.result as string;
				let parsedData: unknown[] = [];

				if (file.name.endsWith(".json") || file.type === "application/json") {
					const data = JSON.parse(content);
					parsedData = Array.isArray(data) ? data : [data];
				} else if (file.name.endsWith(".csv") || file.type === "text/csv") {
					parsedData = parseCSV(content);
				} else if (file.name.endsWith(".txt") || file.type === "text/plain") {
					parsedData = parseTXT(content);
				} else {
					reject(new Error("Unsupported file format. Please upload JSON, CSV, or TXT."));
					return;
				}

				const validItems: ParsedImportItem[] = [];
				let invalidCount = 0;
				let duplicateCount = 0;

				for (const item of parsedData) {
					const result = importItemSchema.safeParse(item);
					if (result.success) {
						const urlLower = result.data.url.toLowerCase();
						const isDuplicate = existingUrls.has(urlLower);

						if (isDuplicate) {
							duplicateCount++;
						} else {
							existingUrls.add(urlLower);
						}

						validItems.push({
							...result.data,
							isDuplicate,
						});
					} else {
						invalidCount++;
					}
				}

				resolve({ validItems, invalidCount, duplicateCount });
			} catch {
				reject(new Error("Failed to parse file. Make sure it is formatted correctly."));
			}
		};
		reader.onerror = () => reject(new Error("Failed to read file."));
		reader.readAsText(file);
	});
}

function parseCSV(content: string): unknown[] {
	const result: Record<string, unknown>[] = [];

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

	if (rows.length < 2) return [];

	const headers = rows[0].map((h) => h.trim());

	for (let i = 1; i < rows.length; i++) {
		const obj: Record<string, unknown> = {};
		const currentRow = rows[i];

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
		result.push(obj);
	}
	return result;
}

function parseTXT(content: string): unknown[] {
	const result: Record<string, string>[] = [];
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
			if (lowerLine.startsWith("id: ")) {
				obj.id = line.substring(4).trim();
			} else if (lowerLine.startsWith("url: ")) {
				obj.url = line.substring(5).trim();
			} else if (lowerLine.startsWith("title: ")) {
				obj.title = line.substring(7).trim();
			} else if (lowerLine.startsWith("description: ")) {
				obj.description = line.substring(13).trim();
			} else if (lowerLine.startsWith("createdat: ")) {
				obj.createdAt = line.substring(11).trim();
			} else if (lowerLine.startsWith("updatedat: ")) {
				obj.updatedAt = line.substring(11).trim();
			} else if (!obj.url && line.startsWith("http")) {
				obj.url = line;
			}
		}
		if (obj.url) {
			result.push(obj);
		}
	}

	// Fallback for simple line-by-line format
	if (result.length === 0) {
		const lines = content
			.split("\n")
			.map((l) => l.trim())
			.filter(Boolean);
		return lines.map((line) => ({ url: line }));
	}

	return result;
}
