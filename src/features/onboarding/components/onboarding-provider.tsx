import { APP_INFO } from "@/constants/app-info";
import { useTheme } from "@/hooks";
import { useSettingsStore } from "@/stores";
import { type ReactNode } from "react";
import { type EventData, Joyride, STATUS, type Step } from "react-joyride";
import { useLocation } from "react-router-dom";
import { CustomTooltip } from "./custom-tooltip";

const TOUR_STEPS: Step[] = [
	{
		target: "body",
		title: `Welcome to ${APP_INFO.name}`,
		content:
			"Your local-first corner of the web. Save, organize, and rediscover your favorite links without sacrificing privacy. Let's show you around!",
		placement: "center",
		skipBeacon: true,
	},
	{
		target: "#explorer-sidebar",
		title: "Your Digital Library",
		content:
			"This is your command center. Hop between your main library, your favorite links, and the recycle bin.",
		placement: "right",
		skipBeacon: true,
	},
	{
		target: "#explorer-main",
		title: "Your Collection",
		content:
			"This is where all your saved content will seamlessly live. If you're new here, we've added some examples to get you started!",
		placement: "top",
		skipBeacon: true,
	},
	{
		target: "#new-folder-btn",
		title: "Stay Organized",
		content:
			"Create folders and sub-folders to keep your links neatly categorized. Think of it like a file explorer for the web.",
		placement: "bottom",
		skipBeacon: true,
	},
	{
		target: "#add-to-corner-btn",
		title: "Save for Later",
		content:
			"Found something interesting? Click here to stash a new link into your current folder.",
		placement: "bottom",
		skipBeacon: true,
	},
	{
		target: "#quick-customize-btn",
		title: "Make it Yours",
		content:
			"Access Quick Customize to instantly change your theme, fine-tune sound effects, and personalize Sulo's expressions to match your mood.",
		placement: "left",
		skipBeacon: true,
	},
	{
		target: "body",
		title: "100% Private",
		content:
			"There are no servers, no accounts, and no tracking. Everything is saved strictly on this device. You're all set!",
		placement: "center",
		skipBeacon: true,
	},
];

export function OnboardingProvider({ children }: { children: ReactNode }) {
	const { settings, updateSettings } = useSettingsStore();
	const { theme } = useTheme();
	const location = useLocation();

	// Ensure tour only runs on the home page so targets can be found
	const isRunning = settings.onboardingStatus === "in_progress" && location.pathname === "/";
	const stepIndex = settings.onboardingStep ?? 0;

	const handleJoyrideCallback = (data: EventData) => {
		const { action, status, type, index } = data;
		const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

		if (finishedStatuses.includes(status)) {
			updateSettings({ onboardingStatus: "completed" });
		} else if (type === "step:after" || type === "error:target_not_found") {
			// Update step index as user progresses (increment or decrement based on action)
			const nextStepIndex = index + (action === "prev" ? -1 : 1);
			updateSettings({ onboardingStep: nextStepIndex });
		}
	};

	const isDarkMode =
		theme === "dark" ||
		theme === "midnight" ||
		theme === "mocha" ||
		(theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

	return (
		<>
			{children}
			<Joyride
				steps={TOUR_STEPS}
				run={isRunning}
				stepIndex={stepIndex}
				onEvent={handleJoyrideCallback}
				continuous
				tooltipComponent={CustomTooltip}
				options={{
					zIndex: 10000,
					overlayColor: isDarkMode ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.4)",
				}}
				styles={{
					arrow: { color: "var(--card)" },
				}}
			/>
		</>
	);
}
