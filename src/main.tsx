import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

if (import.meta.env.DEV) import("@/lib/stress-test");

// Remove static SEO tags from index.html (which are kept for Twitter/crawlers without JS)
// before React Helmet Async mounts and takes over to prevent duplication.
document.querySelectorAll('[data-static-seo="true"]').forEach((el) => el.remove());

// Clear the factory resetting flag from sessionStorage so the app can
// receive extension messages again (e.g., Sync Browser Bookmarks) after a factory reset.
sessionStorage.removeItem("isFactoryResetting");

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
