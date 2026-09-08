import { cn } from "@/lib/utils";
import { GlobeIcon } from "lucide-react";
import { useState } from "react";

interface SiteFaviconProps {
	url: string;
	logo?: string;
	className?: string;
	size?: number; // size in pixels, used for fetching from Google
}

export function SiteFavicon({ url, logo, className, size = 64 }: SiteFaviconProps) {
	const [error, setError] = useState(false);
	const [logoError, setLogoError] = useState(false);

	const [prevUrl, setPrevUrl] = useState(url);
	const [prevLogo, setPrevLogo] = useState(logo);

	// Reset error when URL or logo changes (derived state instead of effect)
	if (url !== prevUrl || logo !== prevLogo) {
		setPrevUrl(url);
		setPrevLogo(logo);
		setError(false);
		setLogoError(false);
	}

	// Extract domain for the favicon service
	let domain = "";
	try {
		domain = new URL(url).origin;
	} catch {
		// invalid url, we'll just fall back
		if (!error) setError(true);
	}

	if (error || (!domain && !logo)) {
		return (
			<div
				className={cn(
					"flex items-center justify-center overflow-hidden rounded-md border bg-muted corner-squircle supports-[corner-shape:squircle]:rounded-xl",
					className,
				)}
			>
				<GlobeIcon className="h-1/2 w-1/2 text-muted-foreground opacity-50" />
			</div>
		);
	}

	return (
		<div
			className={cn(
				"flex items-center justify-center overflow-hidden rounded-md border bg-white shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-xl",
				className,
			)}
		>
			{logo && !logoError ? (
				<img
					src={logo}
					alt="favicon"
					className="h-3/4 w-3/4 object-contain"
					onError={() => setLogoError(true)}
				/>
			) : (
				<img
					src={`https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`}
					alt="favicon"
					className="h-3/4 w-3/4 object-contain"
					onError={() => setError(true)}
				/>
			)}
		</div>
	);
}
