import { ResetButton } from "@/components/reset-button";
import { notify } from "@/lib/notify";
import { defaultSettings, useSettingsStore } from "@/stores/settings-store";
import { SuloExpressionsSection } from "./sulo-expressions-section";
import { SuloWhispersSection } from "./sulo-whispers-section";

export function SuloCustomizationSection() {
	const updateSettings = useSettingsStore((state) => state.updateSettings);

	const handleRestoreAll = () => {
		updateSettings({ suloSettings: defaultSettings.suloSettings });
		notify.success("Sulo settings restored", { id: "restore-all-sulo" });
	};

	return (
		<div className="flex animate-in flex-col gap-12 duration-300 fade-in slide-in-from-bottom-2">
			{/* Header */}
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
				<div>
					<h2 className="font-heading text-xl font-semibold">Sulo Customization</h2>
					<p className="mt-1 text-sm text-muted-foreground">
						Personalize how Sulo reacts and what he says throughout the app.
					</p>
				</div>
				<ResetButton
					onClick={handleRestoreAll}
					label="Reset All"
					className="corner-squircle supports-[corner-shape:squircle]:rounded-xl"
				/>
			</div>

			{/* Isolated Sub-sections */}
			<SuloExpressionsSection />

			<div className="border-t border-border/50" />

			<SuloWhispersSection />
		</div>
	);
}
