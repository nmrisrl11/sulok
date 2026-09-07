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

	if (items.length === 0) {
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
		content = JSON.stringify(formattedItems, null, 2);
		mimeType = "application/json";
	} else if (format === "csv") {
		const headers = [
			"id",
			"url",
			"title",
			"description",
			"image",
			"logo",
			"createdAt",
			"updatedAt",
		];
		const rows = items.map((item) => {
			return headers
				.map((header) => {
					let val = item[header as keyof typeof item];
					if (header === "createdAt" || header === "updatedAt") {
						val = val ? formatDate(val as number) || "" : "";
					}
					// Escape quotes, handle undefined/null, and protect against CSV injection
					let strVal = val === undefined || val === null ? "" : String(val);
					if (/^\s*[=+\-@]/.test(strVal)) {
						strVal = "'" + strVal;
					}
					strVal = strVal.replace(/"/g, '""');
					return `"${strVal}"`;
				})
				.join(",");
		});
		content = [headers.join(","), ...rows].join("\n");
		mimeType = "text/csv";
	} else if (format === "txt") {
		content = items
			.map((item) => {
				let block = `ID: ${item.id}\nURL: ${item.url}`;
				if (item.title) block += `\nTitle: ${item.title}`;
				if (item.description) block += `\nDescription: ${item.description}`;
				if (item.image) block += `\nImage: ${item.image}`;
				if (item.logo) block += `\nLogo: ${item.logo}`;
				if (item.createdAt) block += `\nCreatedAt: ${formatDate(item.createdAt)}`;
				if (item.updatedAt) block += `\nUpdatedAt: ${formatDate(item.updatedAt)}`;
				return block;
			})
			.join("\n---\n");
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
