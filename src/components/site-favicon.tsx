import { cn } from "@/lib/utils";
import { GlobeIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface SiteFaviconProps {
	url: string;
	logo?: string;
	className?: string;
	size?: number; // size in pixels, used for fetching from Google
	smartInvert?: boolean;
	bypassCache?: boolean;
}

export function SiteFavicon({
	url,
	logo,
	className,
	size = 64,
	smartInvert = false,
	bypassCache = false,
}: SiteFaviconProps) {
	const [error, setError] = useState(false);
	const [logoError, setLogoError] = useState(false);
	const [needsInvert, setNeedsInvert] = useState(false);

	useEffect(() => {
		if (!smartInvert || !logo || logoError) return;
		let isMounted = true;
		const img = new Image();
		img.crossOrigin = "Anonymous";
		img.onload = () => {
			if (!isMounted) return;
			try {
				const canvas = document.createElement("canvas");
				canvas.width = img.width || 32;
				canvas.height = img.height || 32;
				const ctx = canvas.getContext("2d");
				if (!ctx) return;
				ctx.drawImage(img, 0, 0);
				const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
				let isWhite = true;
				let hasVisiblePixels = false;
				for (let i = 0; i < imageData.length; i += 4) {
					const r = imageData[i];
					const g = imageData[i + 1];
					const b = imageData[i + 2];
					const a = imageData[i + 3];
					if (a > 20) {
						hasVisiblePixels = true;
						// If any visible pixel is significantly not white (threshold ~200)
						if (r < 200 || g < 200 || b < 200) {
							isWhite = false;
							break;
						}
					}
				}
				if (hasVisiblePixels && isWhite) {
					setNeedsInvert(true);
				}
			} catch {
				// CORS blocked or other error, fallback to default rendering
			}
		};
		img.src = logo;
		return () => {
			isMounted = false;
		};
	}, [logo, logoError, smartInvert]);

	const [prevUrl, setPrevUrl] = useState(url);
	const [prevLogo, setPrevLogo] = useState(logo);

	// Reset error when URL or logo changes (derived state instead of effect)
	if (url !== prevUrl || logo !== prevLogo) {
		if (logo !== prevLogo) {
			setNeedsInvert(false);
		}
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

	const logoSrc = (() => {
		if (bypassCache && logo && logo.startsWith("http")) {
			try {
				const u = new URL(logo);
				u.searchParams.set("bypass_cache", "1");
				return u.toString();
			} catch {
				return logo;
			}
		}
		return logo;
	})();

	return (
		<div
			className={cn(
				"flex items-center justify-center overflow-hidden rounded-md border bg-white shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-xl",
				className,
			)}
		>
			{logo && !logoError ? (
				<img
					src={logoSrc}
					alt="favicon"
					className={cn("h-3/4 w-3/4 object-contain", needsInvert && "invert")}
					loading="lazy"
					decoding="async"
					onError={() => setLogoError(true)}
				/>
			) : (
				<img
					src={`https://www.google.com/s2/favicons?domain=${domain}&sz=${size}${bypassCache ? "&bypass_cache=1" : ""}`}
					alt="favicon"
					className="h-3/4 w-3/4 object-contain"
					loading="lazy"
					decoding="async"
					onError={() => setError(true)}
				/>
			)}
		</div>
	);
}
