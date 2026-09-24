import { ResetButton } from "@/components/reset-button";
import { useSettingsStore } from "@/stores";
import { useNavigate } from "react-router-dom";

export function RestartAppTourSetting() {
	const updateSettings = useSettingsStore((state) => state.updateSettings);
	const navigate = useNavigate();

	return (
		<div className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:py-6 sm:first:pt-0 sm:last:pb-0">
			<div className="space-y-1">
				<div className="flex items-center justify-between gap-4">
					<h3 className="text-sm font-medium text-foreground">Restart App Tour</h3>
					<ResetButton
						onClick={() => {
							updateSettings({ onboardingStatus: "in_progress", onboardingStep: 0 });
							navigate("/");
						}}
						label="Replay Tour"
						className="shrink-0 corner-squircle supports-[corner-shape:squircle]:rounded-xl"
					/>
				</div>
				<p className="w-full text-xs text-muted-foreground sm:max-w-[70%]">
					Replay the interactive welcome tour to relearn the core features and navigation of the
					app.
				</p>
			</div>
		</div>
	);
}
