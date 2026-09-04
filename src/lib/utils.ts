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
