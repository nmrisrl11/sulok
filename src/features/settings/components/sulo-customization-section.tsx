import { Button } from "@/components/ui/button";
import { notify } from "@/lib/notify";
import { defaultSettings, useSettingsStore } from "@/stores/settings-store";
import { RotateCcwIcon } from "lucide-react";
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
				<Button
					variant="outline"
					size="sm"
					onClick={handleRestoreAll}
					className="w-full shrink-0 gap-2 corner-squircle supports-[corner-shape:squircle]:rounded-xl sm:w-auto"
				>
					<RotateCcwIcon className="h-3.5 w-3.5" />
					Reset All
				</Button>
			</div>

			{/* Isolated Sub-sections */}
			<SuloExpressionsSection />

			<div className="border-t border-border/50" />

			<SuloWhispersSection />
		</div>
	);
}
