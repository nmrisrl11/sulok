import { useEffect, useState } from "react";
import { z } from "zod";

export interface URLMetadata {
	title?: string;
	description?: string;
	image?: string;
	logo?: string;
	url?: string;
}

const microlinkResponseSchema = z.object({
	status: z.string(),
	data: z
		.object({
			title: z.string().optional().nullable(),
			description: z.string().optional().nullable(),
			image: z.object({ url: z.string() }).optional().nullable(),
			logo: z.object({ url: z.string() }).optional().nullable(),
			url: z.string().optional().nullable(),
		})
		.optional()
		.nullable(),
});

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
				// Using microlink.io API as a CORS-friendly way to fetch metadata
				const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);

				if (!response.ok) {
					throw new Error("Failed to fetch metadata");
				}

				const payload: unknown = await response.json();

				if (isMounted) {
					const parsed = microlinkResponseSchema.safeParse(payload);

					if (parsed.success && parsed.data.status === "success" && parsed.data.data) {
						const resultData = parsed.data.data;
						setData({
							title: resultData.title || undefined,
							description: resultData.description || undefined,
							image: resultData.image?.url || undefined,
							logo: resultData.logo?.url || undefined,
							url: resultData.url || undefined,
						});
					} else {
						throw new Error("Failed to parse metadata");
					}
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
