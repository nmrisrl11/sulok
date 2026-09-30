import { useEffect, useState } from "react";
import { z } from "zod";

export interface URLMetadata {
	title?: string;
	description?: string;
	image?: string;
	logo?: string;
	url?: string;
}

const ogFetchResponseSchema = z.object({
	title: z.string().optional().nullable(),
	description: z.string().optional().nullable(),
	image: z.string().optional().nullable(),
	favicon: z.string().optional().nullable(),
	url: z.string().optional().nullable(),
});

// Simple in-memory cache to prevent exhausting the per-day API limit
const metadataCache = new Map<string, URLMetadata>();

export async function fetchUrlMetadata(url: string): Promise<URLMetadata> {
	// Check cache first
	if (metadataCache.has(url)) {
		return metadataCache.get(url)!;
	}

	// Basic URL validation before trying to fetch
	new URL(url); // Throws if invalid

	const response = await fetch(`https://api.ogfetch.com/preview?url=${encodeURIComponent(url)}`);
	if (!response.ok) {
		throw new Error("Failed to fetch metadata");
	}

	const payload: unknown = await response.json();
	const parsed = ogFetchResponseSchema.safeParse(payload);

	if (parsed.success) {
		const resultData = parsed.data;

		// Normalize relative URLs
		const sourceUrl = new URL(url);
		sourceUrl.username = "";
		sourceUrl.password = "";
		const baseUrl = sourceUrl.toString();

		const normalizeUrl = (u?: string | null) => {
			if (!u) return undefined;
			if (u.startsWith("http://") || u.startsWith("https://") || u.startsWith("data:")) {
				return u;
			}
			if (u.startsWith("//")) {
				return `https:${u}`;
			}
			try {
				return new URL(u, baseUrl).toString();
			} catch {
				return u;
			}
		};

		const parsedMetadata: URLMetadata = {
			title: resultData.title || undefined,
			description: resultData.description || undefined,
			image: normalizeUrl(resultData.image),
			logo: normalizeUrl(resultData.favicon),
			url: resultData.url || undefined,
		};

		// Save to cache and enforce max limit of 50 to prevent memory leaks
		metadataCache.set(url, parsedMetadata);
		if (metadataCache.size > 50) {
			const oldestKey = metadataCache.keys().next().value;
			if (oldestKey) metadataCache.delete(oldestKey);
		}

		return parsedMetadata;
	} else {
		throw new Error("Failed to parse metadata");
	}
}

export function useMetadata(url: string, enabled: boolean = true) {
	const [data, setData] = useState<URLMetadata | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		const fetchMetadata = async () => {
			// Defer execution to a microtask to avoid synchronous setState warnings in React Compiler
			await Promise.resolve();

			if (!url || !enabled) {
				if (isMounted) {
					setData(null);
					setError(null);
					setLoading(false);
				}
				return;
			}

			if (isMounted) {
				setLoading(true);
				setError(null);
			}

			try {
				const result = await fetchUrlMetadata(url);
				if (isMounted) {
					setData(result);
				}
			} catch (err) {
				if (isMounted) {
					setError(err instanceof Error ? err.message : "Failed to fetch metadata");
					setData(null);
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		};

		fetchMetadata();

		return () => {
			isMounted = false;
		};
	}, [url, enabled]);

	return { data, loading, error };
}
