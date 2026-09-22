import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, type ResolvedConfig } from "vite";
import { APP_INFO } from "./src/constants/app-info.ts";

const htmlPlugin = () => {
	let isDev = false;
	return {
		name: "html-transform",
		configResolved(config: ResolvedConfig) {
			isDev = config.mode === "development";
		},
		transformIndexHtml(html: string) {
			const reactScanScript = isDev
				? '<script crossorigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js"></script>'
				: "";

			return html
				.replace(/%APP_TITLE%/g, APP_INFO.title)
				.replace(/%APP_DESCRIPTION%/g, APP_INFO.description)
				.replace(/%APP_KEYWORDS%/g, APP_INFO.keywords)
				.replace(/%APP_THEME_COLOR%/g, APP_INFO.themeColor)
				.replace(/%APP_NAME%/g, APP_INFO.name)
				.replace(/%APP_AUTHOR%/g, APP_INFO.author)
				.replace(/%APP_URL%/g, APP_INFO.appUrl)
				.replace(/%REACT_SCAN%/g, reactScanScript);
		},
	};
};

export default defineConfig({
	plugins: [htmlPlugin(), react(), tailwindcss()],
	resolve: {
		alias: {
			"@": path.resolve(import.meta.dirname, "./src"),
		},
	},
	build: {
		chunkSizeWarningLimit: 500,
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("node_modules")) {
						const segments = id.split("node_modules/");
						const lastSegment = segments[segments.length - 1];
						const packageName = lastSegment.startsWith("@")
							? lastSegment.split("/").slice(0, 2).join("/")
							: lastSegment.split("/")[0];

						if (["react", "react-dom", "react-router", "react-router-dom"].includes(packageName)) {
							return "vendor-react";
						}
						if (["framer-motion", "flubber"].includes(packageName)) {
							return "vendor-animation";
						}
						if (
							["lucide-react", "@radix-ui", "clsx", "tailwind-merge", "vaul"].includes(
								packageName,
							) ||
							packageName.startsWith("@radix-ui/")
						) {
							return "vendor-ui";
						}
						if (packageName.startsWith("@tanstack/")) {
							return "vendor-virtual";
						}
						if (
							["dexie", "dexie-react-hooks", "zod", "react-hook-form", "@hookform"].includes(
								packageName,
							) ||
							packageName.startsWith("@hookform/")
						) {
							return "vendor-db";
						}
						if (packageName.startsWith("@dnd-kit/")) {
							return "vendor-dnd";
						}
						if (["react-joyride", "react-floater"].includes(packageName)) {
							return "vendor-onboarding";
						}
						return "vendor-core";
					}
				},
			},
		},
	},
});
