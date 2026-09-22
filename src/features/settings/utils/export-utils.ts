import { FolderRepository } from "@/db/repositories/folder-repository";
import { ItemRepository } from "@/db/repositories/item-repository";

function formatDate(timestamp: number | undefined): string | undefined {
	if (!timestamp) return undefined;
	const d = new Date(timestamp);
	if (isNaN(d.getTime())) return undefined;

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const month = months[d.getMonth()];
	const day = d.getDate().toString().padStart(2, "0");
	const year = d.getFullYear();
	let hours = d.getHours();
	const ampm = hours >= 12 ? "PM" : "AM";
	hours = hours % 12;
	hours = hours ? hours : 12;
	const minutes = d.getMinutes().toString().padStart(2, "0");

	return `${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`;
}

export async function exportData(format: "json" | "csv" | "txt") {
	const items = await ItemRepository.getAll();
	const folders = await FolderRepository.getAll();

	if (items.length === 0 && folders.length === 0) {
		throw new Error("No data to export");
	}

	let content = "";
	let mimeType = "";
	const extension = format;

	if (format === "json") {
		const formattedItems = items.map((item) => ({
			...item,
			createdAt: formatDate(item.createdAt),
			updatedAt: formatDate(item.updatedAt),
		}));
		const formattedFolders = folders.map((folder) => ({
			...folder,
			createdAt: formatDate(folder.createdAt),
			updatedAt: formatDate(folder.updatedAt),
		}));
		content = JSON.stringify({ folders: formattedFolders, items: formattedItems }, null, 2);
		mimeType = "application/json";
	} else if (format === "csv") {
		const headers = [
			"type",
			"id",
			"url_or_name",
			"title",
			"description",
			"image",
			"logo",
			"folderId_or_parentId",
			"createdAt",
			"updatedAt",
		];

		const folderRows = folders.map((folder) => {
			return [
				"folder",
				folder.id,
				folder.name,
				"",
				"",
				"",
				"",
				folder.parentId || "",
				folder.createdAt,
				folder.updatedAt,
			]
				.map((val, index) => {
					let finalVal = val;
					if (index === 8 || index === 9) {
						// createdAt, updatedAt
						finalVal = val ? formatDate(val as number) || "" : "";
					}
					let strVal = finalVal === undefined || finalVal === null ? "" : String(finalVal);
					if (/^\s*[=+\-@]/.test(strVal)) {
						strVal = "'" + strVal;
					}
					strVal = strVal.replace(/"/g, '""');
					return `"${strVal}"`;
				})
				.join(",");
		});

		const itemRows = items.map((item) => {
			return [
				"item",
				item.id,
				item.url,
				item.title || "",
				item.description || "",
				item.image || "",
				item.logo || "",
				item.folderId || "",
				item.createdAt,
				item.updatedAt,
			]
				.map((val, index) => {
					let finalVal = val;
					if (index === 8 || index === 9) {
						// createdAt, updatedAt
						finalVal = val ? formatDate(val as number) || "" : "";
					}
					let strVal = finalVal === undefined || finalVal === null ? "" : String(finalVal);
					if (/^\s*[=+\-@]/.test(strVal)) {
						strVal = "'" + strVal;
					}
					strVal = strVal.replace(/"/g, '""');
					return `"${strVal}"`;
				})
				.join(",");
		});

		content = [headers.join(","), ...folderRows, ...itemRows].join("\n");
		mimeType = "text/csv";
	} else if (format === "txt") {
		const folderBlocks = folders.map((folder) => {
			let block = `Type: Folder\nID: ${folder.id}\nName: ${folder.name}`;
			if (folder.parentId) block += `\nParentId: ${folder.parentId}`;
			if (folder.createdAt) block += `\nCreatedAt: ${formatDate(folder.createdAt)}`;
			if (folder.updatedAt) block += `\nUpdatedAt: ${formatDate(folder.updatedAt)}`;
			return block;
		});

		const itemBlocks = items.map((item) => {
			let block = `Type: Item\nID: ${item.id}\nURL: ${item.url}`;
			if (item.title) block += `\nTitle: ${item.title}`;
			if (item.description) block += `\nDescription: ${item.description}`;
			if (item.image) block += `\nImage: ${item.image}`;
			if (item.logo) block += `\nLogo: ${item.logo}`;
			if (item.folderId) block += `\nFolderId: ${item.folderId}`;
			if (item.createdAt) block += `\nCreatedAt: ${formatDate(item.createdAt)}`;
			if (item.updatedAt) block += `\nUpdatedAt: ${formatDate(item.updatedAt)}`;
			return block;
		});

		content = [...folderBlocks, ...itemBlocks].join("\n---\n");
		mimeType = "text/plain";
	}

	const blob = new Blob([content], { type: mimeType });
	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = `sulok-export-${new Date().toISOString().split("T")[0]}.${extension}`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	setTimeout(() => URL.revokeObjectURL(url), 100);
}
