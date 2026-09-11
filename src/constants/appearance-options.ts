import type { Theme } from "@/hooks/use-theme";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import type { ElementType } from "react";

export const THEME_OPTIONS: { id: Theme; label: string; icon: ElementType }[] = [
	{ id: "light", label: "Light", icon: SunIcon },
	{ id: "dark", label: "Dark", icon: MoonIcon },
	{ id: "system", label: "System", icon: MonitorIcon },
];
