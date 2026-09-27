import { type ManifestOptions } from "vite-plugin-pwa";

export const APP_SCREENSHOTS: NonNullable<ManifestOptions["screenshots"]> = [
	{
		src: "/rich-install-ui/desktop/1.jpg",
		sizes: "1920x1080",
		type: "image/png",
		form_factor: "wide",
		label: "Library Page",
	},
	{
		src: "/rich-install-ui/desktop/2.jpg",
		sizes: "1920x1080",
		type: "image/png",
		form_factor: "wide",
		label: "Quick Customize Drawer",
	},
	{
		src: "/rich-install-ui/desktop/3.jpg",
		sizes: "1920x1080",
		type: "image/png",
		form_factor: "wide",
		label: "Data & Storage Settings",
	},
	{
		src: "/rich-install-ui/desktop/4.jpg",
		sizes: "1920x1080",
		type: "image/png",
		form_factor: "wide",
		label: "Apperance Settings",
	},
	{
		src: "/rich-install-ui/desktop/5.jpg",
		sizes: "1920x1080",
		type: "image/png",
		form_factor: "wide",
		label: "Sound FX Settings",
	},
	{
		src: "/rich-install-ui/desktop/6.jpg",
		sizes: "1920x1080",
		type: "image/png",
		form_factor: "wide",
		label: "Sulo Customization Settings",
	},
	{
		src: "/rich-install-ui/desktop/7.jpg",
		sizes: "1920x1080",
		type: "image/png",
		form_factor: "wide",
		label: "About Page",
	},
	{
		src: "/rich-install-ui/desktop/8.jpg",
		sizes: "1920x1080",
		type: "image/png",
		form_factor: "wide",
		label: "Installation Page",
	},
	{
		src: "/screenshot-mobile-1.png",
		sizes: "1080x1920",
		type: "image/png",
		form_factor: "narrow",
		label: "Sulok Mobile View",
	},
	// Mobile Placeholders
	{
		src: "/screenshot-mobile-placeholder-2.png",
		sizes: "1080x1920",
		type: "image/png",
		form_factor: "narrow",
		label: "Mobile Library Page Placeholder",
	},
	{
		src: "/screenshot-mobile-placeholder-3.png",
		sizes: "1080x1920",
		type: "image/png",
		form_factor: "narrow",
		label: "Mobile Settings Placeholder",
	},
];
