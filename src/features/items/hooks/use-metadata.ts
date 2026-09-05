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

			// Check cache first
			if (metadataCache.has(url)) {
				if (isMounted) {
					setData(metadataCache.get(url)!);
					setError(null);
					setLoading(false);
				}
				return;
			}

			// Basic URL validation before trying to fetch
			try {
				new URL(url);
			} catch {
				if (isMounted) {
					setData(null);
					setError("Invalid URL");
					setLoading(false);
				}
				return;
			}

			if (isMounted) {
				setLoading(true);
				setError(null);
			}
			try {
				// Using OG Fetch as a simple, boundary-isolated metadata provider
				const response = await fetch(
					`https://api.ogfetch.com/preview?url=${encodeURIComponent(url)}`,
				);

				if (!response.ok) {
					throw new Error("Failed to fetch metadata");
				}

				const payload: unknown = await response.json();

				const parsed = ogFetchResponseSchema.safeParse(payload);

				if (parsed.success) {
					const resultData = parsed.data;
					const parsedMetadata: URLMetadata = {
						title: resultData.title || undefined,
						description: resultData.description || undefined,
						image: resultData.image || undefined,
						logo: resultData.favicon || undefined,
						url: resultData.url || undefined,
					};

					// Save to cache and enforce max limit of 50 to prevent memory leaks
					metadataCache.set(url, parsedMetadata);
					if (metadataCache.size > 50) {
						const oldestKey = metadataCache.keys().next().value;
						if (oldestKey) metadataCache.delete(oldestKey);
					}

					if (isMounted) {
						setData(parsedMetadata);
					}
				} else {
					throw new Error("Failed to parse metadata");
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
