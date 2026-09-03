import { cn } from "@/lib/utils";
import { GlobeIcon } from "lucide-react";
import { useState } from "react";

interface SiteFaviconProps {
	url: string;
	className?: string;
	size?: number; // size in pixels, used for fetching from Google
}

export function SiteFavicon({ url, className, size = 64 }: SiteFaviconProps) {
	const [error, setError] = useState(false);

	// Extract domain for the favicon service
	let domain = "";
	try {
		domain = new URL(url).hostname;
	} catch (e) {
		// invalid url, we'll just fall back
		if (!error) setError(true);
	}

	if (error || !domain) {
		return (
			<div className={cn("bg-muted flex items-center justify-center overflow-hidden", className)}>
				<GlobeIcon className="h-1/2 w-1/2 text-muted-foreground opacity-50" />
			</div>
		);
	}

	return (
		<div className={cn("bg-white flex items-center justify-center overflow-hidden", className)}>
			<img
				src={`https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`}
				alt="favicon"
				className="h-full w-full object-contain"
				onError={() => setError(true)}
			/>
		</div>
	);
}
