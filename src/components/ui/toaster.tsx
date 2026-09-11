import { useTheme } from "@/hooks/use-theme";
import { GooeyToaster } from "goey-toast";
import "goey-toast/styles.css";

export function Toaster() {
	const { theme } = useTheme();

	const toasterTheme =
		theme === "system"
			? undefined
			: theme === "dark" || theme === "midnight" || theme === "mocha"
				? "dark"
				: "light";

	return (
		<>
			<style>{`
				[data-sonner-toaster] {
					--mobile-offset-bottom: calc(var(--bottom-action-height, 0px) + 40px) !important;
				}
			`}</style>
			<GooeyToaster
				theme={toasterTheme}
				position="bottom-center"
				closeOnEscape={false}
				showTimestamp={false}
				offset="calc(var(--bottom-action-height, 0px) + 40px)"
			/>
		</>
	);
}
