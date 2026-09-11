import { createContext, useContext } from "react";

export type Theme = "dark" | "light" | "system" | "sepia" | "sand" | "midnight" | "mocha";

export const ThemeStateContext = createContext<Theme | undefined>(undefined);
export const ThemeDispatchContext = createContext<((theme: Theme) => void) | undefined>(undefined);

export const useTheme = () => {
	const theme = useContext(ThemeStateContext);
	const setTheme = useContext(ThemeDispatchContext);

	if (theme === undefined || setTheme === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}

	return { theme, setTheme };
};

export const useThemeState = () => {
	const context = useContext(ThemeStateContext);
	if (context === undefined) throw new Error("useThemeState must be used within a ThemeProvider");
	return context;
};

export const useThemeDispatch = () => {
	const context = useContext(ThemeDispatchContext);
	if (context === undefined)
		throw new Error("useThemeDispatch must be used within a ThemeProvider");
	return context;
};
