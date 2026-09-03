import { useState, useEffect } from "react";

export interface URLMetadata {
	title?: string;
	description?: string;
	image?: string;
	logo?: string;
	url?: string;
}

export function useMetadata(url: string, enabled: boolean = true) {
	const [data, setData] = useState<URLMetadata | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!url || !enabled) {
			setData(null);
			setError(null);
			setLoading(false);
			return;
		}

		// Basic URL validation before trying to fetch
		try {
			new URL(url);
		} catch {
			setData(null);
			setError("Invalid URL");
			setLoading(false);
			return;
		}

		let isMounted = true;
		setLoading(true);
		setError(null);

		const fetchMetadata = async () => {
			try {
				// Using microlink.io API as a CORS-friendly way to fetch metadata
				const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);

				if (!response.ok) {
					throw new Error("Failed to fetch metadata");
				}

				const result = await response.json();

				if (isMounted) {
					if (result.status === "success" && result.data) {
						setData({
							title: result.data.title,
							description: result.data.description,
							image: result.data.image?.url,
							logo: result.data.logo?.url,
							url: result.data.url,
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
