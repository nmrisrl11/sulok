import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { APP_INFO } from "./src/constants/app-info.ts";

const htmlPlugin = () => {
	return {
		name: "html-transform",
		transformIndexHtml(html: string) {
			return html
				.replace(/%APP_TITLE%/g, APP_INFO.title)
				.replace(/%APP_DESCRIPTION%/g, APP_INFO.description)
				.replace(/%APP_KEYWORDS%/g, APP_INFO.keywords)
				.replace(/%APP_THEME_COLOR%/g, APP_INFO.themeColor)
				.replace(/%APP_NAME%/g, APP_INFO.name)
				.replace(/%APP_AUTHOR%/g, APP_INFO.author);
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
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("node_modules")) {
						if (id.includes("framer-motion") || id.includes("flubber")) {
							return "vendor-animation";
						}
						if (id.includes("react") || id.includes("react-dom") || id.includes("react-router")) {
							return "vendor-react";
						}
						return "vendor";
					}
				},
			},
		},
	},
});
