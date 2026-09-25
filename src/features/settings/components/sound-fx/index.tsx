import { ResetButton } from "@/components/reset-button";
import { APP_INFO } from "@/constants/app-info";
import { defaultSettings, useSettingsStore } from "@/stores";
import { SettingsCard } from "../settings-card";
import { AudioSignaturesSetting } from "./audio-signatures-setting";
import { VolumeSetting } from "./master-volume-setting";
import { SoundSettingsSetting } from "./play-interaction-sounds-setting";

export function SoundFxSection() {
	const updateSettings = useSettingsStore((state) => state.updateSettings);

	const handleRestore = () => {
		updateSettings({ soundSettings: defaultSettings.soundSettings });
	};

	return (
		<div className="animate-in space-y-8 duration-300 fade-in slide-in-from-bottom-2">
			<div className="flex flex-col gap-1">
				<div className="flex items-center justify-between gap-4">
					<h2 className="font-heading text-xl font-semibold">Sound FX</h2>
					<ResetButton
						onClick={handleRestore}
						label="Reset Sound FX"
						className="corner-squircle supports-[corner-shape:squircle]:rounded-xl"
					/>
				</div>

				<p className="mt-1 text-sm text-muted-foreground">
					Bring your corner to life with subtle audio cues as you interact with {APP_INFO.name}.
				</p>
			</div>

			<div className="space-y-10">
				<div className="space-y-4">
					<h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
						Sound Preferences
					</h3>
					<SettingsCard className="p-0 sm:p-0">
						<div className="flex flex-col divide-y divide-border/50 px-5 py-5 sm:px-6 sm:py-6">
							<SoundSettingsSetting />
							<VolumeSetting />
							<AudioSignaturesSetting />
						</div>
					</SettingsCard>
				</div>
			</div>
		</div>
	);
}
