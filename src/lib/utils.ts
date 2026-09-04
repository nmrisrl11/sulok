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

	if (formatted.endsWith("/")) {
		formatted = formatted.slice(0, -1);
	}

	return formatted;
}
