import type { Theme } from "@/hooks/use-theme";
import type { AccentColor } from "@/types/settings";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";

export const THEME_OPTIONS: { id: Theme; label: string; icon: React.ElementType }[] = [
	{ id: "light", label: "Light", icon: SunIcon },
	{ id: "dark", label: "Dark", icon: MoonIcon },
	{ id: "system", label: "System", icon: MonitorIcon },
];

export const ACCENT_COLORS: { id: AccentColor; label: string; class: string; ringClass: string }[] =
	[
		{
			id: "charcoal",
			label: "Charcoal",
			class: "bg-[#1E1B18] dark:bg-[#F7F5F0]",
			ringClass: "ring-[#1E1B18] dark:ring-[#F7F5F0]",
		},
		{ id: "amber", label: "Amber", class: "bg-[#c49a6c]", ringClass: "ring-[#c49a6c]" },
		{ id: "rose", label: "Rose", class: "bg-[#e11d48]", ringClass: "ring-[#e11d48]" },
		{ id: "blue", label: "Blue", class: "bg-[#2563eb]", ringClass: "ring-[#2563eb]" },
		{ id: "green", label: "Green", class: "bg-[#16a34a]", ringClass: "ring-[#16a34a]" },
	];
