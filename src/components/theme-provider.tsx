import { type Theme, ThemeDispatchContext, ThemeStateContext } from "@/hooks/use-theme";
import { useCallback, useEffect, useState } from "react";

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "sulok-ui-theme",
}: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(
		() => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
	);

	useEffect(() => {
		const root = window.document.documentElement;

		root.classList.remove(
			"light",
			"dark",
			"theme-sepia",
			"theme-sand",
			"theme-midnight",
			"theme-mocha",
		);

		if (theme === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light";

			root.classList.add(systemTheme);
			return;
		}

		if (theme === "light" || theme === "dark") {
			root.classList.add(theme);
			return;
		}

		root.classList.add(`theme-${theme}`);

		if (theme === "midnight" || theme === "mocha") {
			root.classList.add("dark");
		}
	}, [theme]);

	const handleSetTheme = useCallback(
		(newTheme: Theme) => {
			localStorage.setItem(storageKey, newTheme);
			setTheme(newTheme);
		},
		[storageKey],
	);

	return (
		<ThemeStateContext.Provider value={theme}>
			<ThemeDispatchContext.Provider value={handleSetTheme}>
				{children}
			</ThemeDispatchContext.Provider>
		</ThemeStateContext.Provider>
	);
}
