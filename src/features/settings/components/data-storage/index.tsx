import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SettingsCard } from "../settings-card";
import { BackupReminderSetting } from "./backup-reminder-setting";
import { BrowserStorageSetting } from "./browser-storage-setting";
import { DangerZoneSection as DangerZoneContent } from "./danger-zone-section";
import { DeviceSyncSetting } from "./device-sync-setting";
import { ExportLibrarySetting } from "./export-library-setting";
import { ReferralTrackingSetting } from "./referral-tracking-setting";
import { RestartAppTourSetting } from "./restart-app-tour-setting";
import { RestoreLibrarySetting } from "./restore-library-setting";
import { SyncSettingsSetting } from "./sync-settings-setting";

export function DataStorageSection() {
	const location = useLocation();

	useEffect(() => {
		if (location.hash === "#backup-restore") {
			const element = document.getElementById("backup-restore");
			if (element) {
				setTimeout(() => {
					element.scrollIntoView({ behavior: "smooth", block: "start" });
				}, 100);
			}
		}
	}, [location.hash]);

	return (
		<div className="animate-in space-y-8 duration-300 fade-in slide-in-from-bottom-2">
			<div>
				<h2 className="font-heading text-xl font-semibold">Data & Storage</h2>
				<p className="mt-1 text-sm text-muted-foreground">
					Your library is stored locally on your device. Manage your storage and export backups to
					safeguard your saved corners.
				</p>
			</div>

			<div className="space-y-10">
				<div className="space-y-4">
					<h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
						Storage & System
					</h3>
					<SettingsCard className="p-0 sm:p-0">
						<div className="flex flex-col divide-y divide-border/50 px-5 py-5 sm:px-6 sm:py-6">
							<BrowserStorageSetting />
							<ReferralTrackingSetting />
							<RestartAppTourSetting />
						</div>
					</SettingsCard>
				</div>

				<div id="backup-restore" className="scroll-mt-30 space-y-4">
					<h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
						Backup & Restore
					</h3>
					<SettingsCard className="p-0 sm:p-0">
						<div className="flex flex-col divide-y divide-border/50 px-5 py-5 sm:px-6 sm:py-6">
							<BackupReminderSetting />
							<DeviceSyncSetting />
							<ExportLibrarySetting />
							<RestoreLibrarySetting />
							<SyncSettingsSetting />
						</div>
					</SettingsCard>
				</div>

				<div className="space-y-4">
					<h3 className="text-xs font-semibold tracking-wider text-destructive uppercase">
						Danger Zone
					</h3>
					<SettingsCard className="p-0 sm:p-0">
						<DangerZoneContent />
					</SettingsCard>
				</div>
			</div>
		</div>
	);
}
