import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { APP_INFO } from "./src/constants/app-info.ts";
import { APP_SCREENSHOTS } from "./src/constants/pwa-screenshots.ts";
import { htmlPlugin } from "./src/lib/vite-plugins.ts";

const isExtBuild = process.env.VITE_EXT_BUILD === "true";

export default defineConfig({
	plugins: [
		htmlPlugin(),
		react(),
		tailwindcss(),
		...(!isExtBuild
			? [
					VitePWA({
						registerType: "prompt",
						injectRegister: "auto",
						devOptions: {
							enabled: true,
							suppressWarnings: true,
							type: "module",
						},
						includeAssets: [
							"favicon.svg",
							"favicon.ico",
							"apple-touch-icon.png",
							"favicon-96x96.png",
						],
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
							screenshots: APP_SCREENSHOTS,
						},
						workbox: {
							cacheId: "sulok-app",
							globPatterns: ["**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp,woff,woff2,ttf}"],
							maximumFileSizeToCacheInBytes: 5000000,
							navigateFallback: "/index.html",
							runtimeCaching: [
								{
									urlPattern: /^https:\/\/www\.google\.com\/s2\/favicons/,
									handler: "StaleWhileRevalidate",
									options: {
										cacheName: "google-favicons-cache",
										expiration: {
											maxEntries: 200,
											maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
											purgeOnQuotaError: true,
										},
										cacheableResponse: {
											statuses: [0, 200],
										},
									},
								},
								{
									urlPattern: ({ url }) => /\.(?:png|jpg|jpeg|svg|gif|webp)$/i.test(url.pathname),
									handler: "StaleWhileRevalidate",
									options: {
										cacheName: "external-images-cache",
										expiration: {
											maxEntries: 100,
											maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
											purgeOnQuotaError: true,
										},
										cacheableResponse: {
											statuses: [0, 200],
										},
									},
								},
							],
						},
					}),
				]
			: []),
	],
	resolve: {
		alias: {
			"@": path.resolve(import.meta.dirname, "./src"),
		},
	},
	build: {
		outDir: isExtBuild ? "dist-ext" : "dist",
		chunkSizeWarningLimit: 500,
		rollupOptions: {
			output: isExtBuild
				? {}
				: {
						manualChunks(id) {
							if (id.includes("node_modules")) {
								const segments = id.split("node_modules/");
								const lastSegment = segments[segments.length - 1];
								const packageName = lastSegment.startsWith("@")
									? lastSegment.split("/").slice(0, 2).join("/")
									: lastSegment.split("/")[0];

								if (
									["react", "react-dom", "react-router", "react-router-dom"].includes(packageName)
								) {
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
