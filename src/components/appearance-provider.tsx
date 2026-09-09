import { useSettingsStore } from "@/stores/settings-store";
import { useEffect } from "react";

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
	const appearanceSettings = useSettingsStore((state) => state.settings.appearanceSettings);

	useEffect(() => {
		const root = window.document.documentElement;

		// Clear previous appearance classes
		root.classList.remove(
			"theme-charcoal",
			"theme-amber",
			"theme-rose",
			"theme-blue",
			"theme-green",
			"radius-squircle",
			"radius-standard",
			"density-compact",
			"density-cozy",
		);

		// Apply new classes
		root.classList.add(`theme-${appearanceSettings.accentColor}`);
		root.classList.add(`radius-${appearanceSettings.cornerStyle}`);
		root.classList.add(`density-${appearanceSettings.layoutDensity}`);
	}, [appearanceSettings]);

	return <>{children}</>;
}
