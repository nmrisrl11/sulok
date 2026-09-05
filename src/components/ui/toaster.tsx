import { useTheme } from "@/components/theme-provider";
import { GooeyToaster } from "goey-toast";
import "goey-toast/styles.css";

export function Toaster() {
	const { theme } = useTheme();

	return (
		<>
			<style>{`
				[data-sonner-toaster] {
					--mobile-offset-bottom: calc(var(--bottom-action-height, 0px) + 40px) !important;
				}
			`}</style>
			<GooeyToaster
				theme={theme === "system" ? undefined : theme}
				position="bottom-center"
				closeOnEscape={false}
				showTimestamp={false}
				offset="calc(var(--bottom-action-height, 0px) + 40px)"
			/>
		</>
	);
}
