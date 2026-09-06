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
	const lines = content
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);
	if (lines.length < 2) return [];

	const headers = lines[0].split(",").map((h) => h.replace(/^"|"$/g, "").trim());
	const result = [];

	for (let i = 1; i < lines.length; i++) {
		const obj: Record<string, unknown> = {};
		// Regex to handle CSV splitting respecting quotes
		const matchResult = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
		const row = matchResult || [];

		headers.forEach((header, index) => {
			let val = row[index] || "";
			val = val.replace(/^"|"$/g, "").replace(/""/g, '"').trim();

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
