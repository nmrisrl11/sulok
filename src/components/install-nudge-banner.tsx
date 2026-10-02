import { ScreenAppIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { APP_INFO } from "@/constants/app-info";
import { useExtensionInstalled } from "@/hooks";
import { useSettingsStore } from "@/stores";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function InstallNudgeBanner() {
	const isInstalled = useExtensionInstalled();
	const hasDismissed = useSettingsStore((state) => state.settings.hasDismissedInstallNudge);
	const onboardingStatus = useSettingsStore((state) => state.settings.onboardingStatus);
	const updateSettings = useSettingsStore((state) => state.updateSettings);

	const [isStandalone] = useState(() => {
		if (typeof window === "undefined") return false;
		return window.matchMedia("(display-mode: standalone)").matches;
	});

	// Don't show anything if already installed (extension or PWA), previously dismissed, or onboarding is in progress
	if (
		isInstalled === null ||
		isInstalled === true ||
		isStandalone ||
		hasDismissed ||
		onboardingStatus === "in_progress"
	) {
		return null;
	}

	return (
		<div className="relative flex animate-in flex-col items-start justify-between gap-4 overflow-hidden rounded-lg border border-primary/20 bg-primary/10 p-4 duration-500 corner-squircle fade-in supports-[corner-shape:squircle]:rounded-4xl sm:flex-row sm:items-center">
			{/* Decorative background element */}
			<div className="pointer-events-none absolute -top-12 -right-12 opacity-5">
				<ScreenAppIcon className="size-48" />
			</div>

			<div className="relative z-10 flex items-start gap-3 sm:items-center">
				<div className="hidden rounded-md bg-primary/20 p-2 text-primary corner-squircle supports-[corner-shape:squircle]:rounded-2xl sm:block">
					<ScreenAppIcon className="size-5" />
				</div>
				<div className="flex flex-col gap-1 pr-6 sm:pr-0">
					<h3 className="text-sm font-semibold text-foreground">
						Get the most out of {APP_INFO.name}
					</h3>
					<p className="text-xs text-muted-foreground">
						Install the app for offline access and the browser extension for zero-click saving.
					</p>
				</div>
			</div>

			<div className="relative z-10 flex w-full items-center gap-2 sm:w-auto">
				<Button asChild className="w-full shrink-0 sm:w-auto">
					<Link to="/install">Get the app</Link>
				</Button>
				<Button
					size="icon"
					variant="ghost"
					className="hidden h-8 w-8 shrink-0 text-muted-foreground hover:bg-black/5 hover:text-foreground sm:flex dark:hover:bg-white/10"
					onClick={() => updateSettings({ hasDismissedInstallNudge: true })}
					aria-label="Dismiss banner"
				>
					<XIcon className="size-4" />
				</Button>
			</div>

			<Button
				size="icon"
				variant="ghost"
				className="absolute top-2 right-2 z-20 flex h-8 w-8 text-muted-foreground hover:bg-black/5 hover:text-foreground sm:hidden dark:hover:bg-white/10"
				onClick={() => updateSettings({ hasDismissedInstallNudge: true })}
				aria-label="Dismiss banner"
			>
				<XIcon className="size-4" />
			</Button>
		</div>
	);
}
