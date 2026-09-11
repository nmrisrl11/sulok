import { useSettingsStore } from "@/stores/settings-store";
import { useEffect } from "react";

function getLuminance(hex: string) {
	let r = 0,
		g = 0,
		b = 0;
	if (hex.length === 4) {
		r = parseInt(hex[1] + hex[1], 16);
		g = parseInt(hex[2] + hex[2], 16);
		b = parseInt(hex[3] + hex[3], 16);
	} else if (hex.length === 7) {
		r = parseInt(hex.substring(1, 3), 16);
		g = parseInt(hex.substring(3, 5), 16);
		b = parseInt(hex.substring(5, 7), 16);
	}
	const [rL, gL, bL] = [r, g, b].map((c) => {
		c /= 255;
		return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
	});
	return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
}

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
	const appearanceSettings = useSettingsStore((state) => state.settings.appearanceSettings);

	useEffect(() => {
		const root = window.document.documentElement;

		// 1. Accent Color
		if (appearanceSettings.accentColor === "foreground") {
			root.style.setProperty("--primary", "var(--foreground)");
			root.style.setProperty("--ring", "var(--foreground)");
			root.style.setProperty("--primary-foreground", "var(--background)");
		} else if (appearanceSettings.accentColor.startsWith("#")) {
			root.style.setProperty("--primary", appearanceSettings.accentColor);
			root.style.setProperty("--ring", appearanceSettings.accentColor);
			const luma = getLuminance(appearanceSettings.accentColor);
			root.style.setProperty("--primary-foreground", luma > 0.5 ? "#1E1B18" : "#F7F5F0");
		}

		// 2. Corner Style
		if (appearanceSettings.cornerStyle === "custom") {
			root.style.setProperty("--radius", `${appearanceSettings.customCornerRadius}px`);
			root.classList.remove("radius-squircle", "radius-standard");
		} else {
			root.style.removeProperty("--radius");
			root.classList.remove("radius-squircle", "radius-standard");
			root.classList.add(`radius-${appearanceSettings.cornerStyle}`);
		}

		// 3. Layout Density
		if (appearanceSettings.layoutDensity === "custom") {
			root.style.setProperty("--item-padding-x", `${appearanceSettings.customLayoutDensity}px`);
			root.style.setProperty("--item-padding-y", `${appearanceSettings.customLayoutDensity}px`);
			root.classList.remove("density-compact", "density-cozy");
		} else {
			root.style.removeProperty("--item-padding-x");
			root.style.removeProperty("--item-padding-y");
			root.classList.remove("density-compact", "density-cozy");
			root.classList.add(`density-${appearanceSettings.layoutDensity}`);
		}
	}, [appearanceSettings]);

	return <>{children}</>;
}
