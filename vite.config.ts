import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, type ResolvedConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
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
	plugins: [
		htmlPlugin(),
		react(),
		tailwindcss(),
		VitePWA({
			registerType: "prompt",
			injectRegister: "auto",
			devOptions: {
				enabled: true,
				suppressWarnings: true,
				type: "module",
			},
			includeAssets: ["favicon.svg", "favicon.ico", "apple-touch-icon.png", "favicon-96x96.png"],
			manifest: {
				name: APP_INFO.name,
				short_name: APP_INFO.shortName,
				description: APP_INFO.description,
				theme_color: APP_INFO.themeColor,
				background_color: APP_INFO.backgroundColor,
				display: "standalone",
				orientation: "portrait",
				icons: [
					{
						src: "/web-app-manifest-192x192.png",
						sizes: "192x192",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "/web-app-manifest-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "/web-app-manifest-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
				],
				screenshots: [
					{
						src: "/screenshot-desktop-1.png",
						sizes: "1920x1080",
						type: "image/png",
						form_factor: "wide",
						label: "Sulok Library View",
					},
					{
						src: "/screenshot-desktop-2.png",
						sizes: "1920x1080",
						type: "image/png",
						form_factor: "wide",
						label: "Sulok Settings View",
					},
					{
						src: "/screenshot-mobile-1.png",
						sizes: "1080x1920",
						type: "image/png",
						form_factor: "narrow",
						label: "Sulok Mobile View",
					},
				],
			},
			workbox: {
				globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2,ttf}"],
				maximumFileSizeToCacheInBytes: 5000000,
			},
		}),
	],
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
