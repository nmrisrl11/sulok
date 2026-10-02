import { APP_INFO } from "@/constants/app-info";
import { Helmet } from "react-helmet-async";

import type { SEOProps } from "./seo-types";

export function SEO({
	title,
	description,
	canonical,
	type = "website",
	image = "/og-image.png",
	robots,
}: SEOProps) {
	const pageTitle = title ? `${title} — ${APP_INFO.name}` : APP_INFO.title;
	const pageDescription = description || APP_INFO.description;

	// Always derive siteUrl from APP_INFO.appUrl so that canonical/social preview links
	// remain accurate even if the app is previewed on alternate hostnames (e.g. localhost, preview deployments).
	const siteUrl = `https://${APP_INFO.appUrl}`;

	const getAbsoluteUrl = (path: string) => {
		if (path.startsWith("http")) return path;
		return `${siteUrl}${path.startsWith("/") ? "" : "/"}${path}`;
	};

	const absoluteImage = getAbsoluteUrl(image);
	const absoluteCanonical = canonical ? getAbsoluteUrl(canonical) : undefined;

	return (
		<Helmet>
			<title>{pageTitle}</title>
			<meta name="description" content={pageDescription} />
			{robots && <meta name="robots" content={robots} />}
			{absoluteCanonical && <link rel="canonical" href={absoluteCanonical} />}

			{/* Open Graph */}
			<meta property="og:title" content={pageTitle} />
			<meta property="og:description" content={pageDescription} />
			<meta property="og:type" content={type} />
			<meta property="og:image" content={absoluteImage} />
			{absoluteCanonical && <meta property="og:url" content={absoluteCanonical} />}

			{/* Twitter */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={pageTitle} />
			<meta name="twitter:description" content={pageDescription} />
			<meta name="twitter:image" content={absoluteImage} />
		</Helmet>
	);
}
