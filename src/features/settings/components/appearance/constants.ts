import { Settings2Icon, SquareIcon, SquircleIcon } from "lucide-react";

export const WORKSPACE_THEMES = [
	{
		id: "system",
		label: "System",
		bg: "linear-gradient(135deg, #f7f5f0 50%, #1e1b18 50%)",
		fg: "#888",
		type: "system",
	},
	{ id: "light", label: "Cream", bg: "#f7f5f0", fg: "#1e1b18", type: "light" },
	{ id: "sepia", label: "Sepia", bg: "#F4ECD8", fg: "#4A3C31", type: "light" },
	{ id: "sand", label: "Sand", bg: "#EAE6DF", fg: "#45423E", type: "light" },
	{ id: "dark", label: "Charcoal", bg: "#1e1b18", fg: "#f7f5f0", type: "dark" },
	{ id: "midnight", label: "Midnight", bg: "#0B1120", fg: "#F8FAFC", type: "dark" },
	{ id: "mocha", label: "Mocha", bg: "#241C18", fg: "#F5EFEB", type: "dark" },
] as const;

export type AccentPreset = {
	id: string;
	label: string;
	color?: string;
};

export const ACCENT_PRESETS: AccentPreset[] = [
	{ id: "foreground", label: "Default" },
	{ id: "#0ea5e9", label: "Cyan", color: "#0ea5e9" },
	{ id: "#f97316", label: "Orange", color: "#f97316" },
	{ id: "#22c55e", label: "Green", color: "#22c55e" },
	{ id: "#a855f7", label: "Purple", color: "#a855f7" },
	{ id: "#f43f5e", label: "Rose", color: "#f43f5e" },
];

export const CORNER_STYLES = [
	{ id: "squircle", label: "Squircle", icon: SquircleIcon },
	{ id: "standard", label: "Standard", icon: SquareIcon },
	{ id: "custom", label: "Custom", icon: Settings2Icon },
];
