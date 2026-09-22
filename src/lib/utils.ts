import { TRASH_RETENTION_DAYS } from "@/constants/app-info";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatUrl(url: string): string {
	let formatted = url.trim();
	if (!formatted) return formatted;

	if (!/^https?:\/\//i.test(formatted)) {
		formatted = `https://${formatted}`;
	}

	try {
		const parsed = new URL(formatted);
		if (formatted === `${parsed.origin}/`) {
			formatted = parsed.origin;
		}
	} catch {
		// Ignore
	}

	return formatted;
}

export function generateUniqueName(name: string, existingNames: Set<string>): string {
	let finalName = name;
	if (existingNames.has(finalName.toLowerCase())) {
		const match = name.match(/^(.*?)(?:\s+\(\d+\))?$/);
		const baseName = match ? match[1] : name;
		let counter = 1;
		while (existingNames.has(finalName.toLowerCase())) {
			finalName = `${baseName} (${counter})`;
			counter++;
		}
	}
	return finalName;
}

export function getTrashRetentionText(deletedAt?: number): string | null {
	if (!deletedAt) return null;
	const expiryDate = new Date(deletedAt + TRASH_RETENTION_DAYS * 24 * 60 * 60 * 1000);
	const now = new Date();

	const diffTime = expiryDate.getTime() - now.getTime();
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	if (diffDays <= 0) return `Deletes today`;
	if (diffDays === 1) return `1 day left`;
	return `${diffDays} days left`;
}
