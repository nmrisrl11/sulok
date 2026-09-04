import { useTheme } from "@/components/theme-provider";
import { GooeyToaster } from "goey-toast";
import "goey-toast/styles.css";

export function Toaster() {
	const { theme } = useTheme();

	return (
		<GooeyToaster
			theme={theme === "system" ? undefined : theme}
			position="bottom-center"
			closeOnEscape={false}
			showTimestamp={false}
		/>
	);
}
