import type { ResolvedConfig } from "vite";
import { APP_INFO } from "../constants/app-info.ts";

export const htmlPlugin = () => {
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
