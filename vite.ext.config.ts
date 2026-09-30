import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import webExtension from "vite-plugin-web-extension";
import { APP_INFO } from "./src/constants/app-info.ts";
import manifest from "./src/extension/manifest.json" with { type: "json" };
import { htmlPlugin } from "./src/lib/vite-plugins.ts";

export default defineConfig({
	plugins: [
		htmlPlugin(),
		react(),
		tailwindcss(),
		webExtension({
			manifest: () => ({
				...manifest,
				name: APP_INFO.name,
				description: APP_INFO.shortDescription,
				action: {
					...manifest.action,
					default_title: `Save to ${APP_INFO.name}`,
				},
				icons: {
					"16": "favicon-96x96.png",
					"32": "favicon-96x96.png",
					"48": "favicon-96x96.png",
					"96": "favicon-96x96.png",
					"128": "favicon-96x96.png",
				},
				content_security_policy: {
					extension_pages:
						"script-src 'self' http://localhost:*; object-src 'self'; font-src 'self' http://localhost:* data:; style-src 'self' 'unsafe-inline' http://localhost:*",
				},
			}),
			watchFilePaths: ["src/**/*", "vite.ext.config.ts"],
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(import.meta.dirname, "./src"),
		},
	},
	build: {
		outDir: "dist-ext",
		emptyOutDir: true,
	},
});
