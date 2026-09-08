import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { MoonIcon, SunIcon } from "lucide-react";

export function ModeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<Button
			variant="ghost"
			size="icon"
			className="h-9 w-9 cursor-pointer"
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
		>
			<SunIcon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
			<MoonIcon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
