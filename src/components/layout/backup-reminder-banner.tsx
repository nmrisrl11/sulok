import { Button } from "@/components/ui/button";
import { BACKUP_MINIMUM_DATA_THRESHOLD } from "@/constants/validation-constants";
import { db } from "@/db/db";
import { useExtensionInstalled } from "@/hooks";
import { useSettingsStore } from "@/stores";
import { useLiveQuery } from "dexie-react-hooks";
import { DownloadIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function getContextText(items?: number, folders?: number) {
	if (items === undefined || folders === undefined)
		return "Remember to back up your library regularly.";
	if (items === 0 && folders === 0) return "Remember to back up your library regularly.";

	let text = "You have ";
	if (items > 0) {
		text += `${items} link${items === 1 ? "" : "s"}`;
	}
	if (items > 0 && folders > 0) {
		text += " and ";
	}
	if (folders > 0) {
		text += `${folders} folder${folders === 1 ? "" : "s"}`;
	}
	text += ". Remember to back up your library regularly.";
	return text;
}

export function BackupReminderBanner() {
	const lastBackupDate = useSettingsStore((state) => state.settings.lastBackupDate);
	const backupReminderFrequency = useSettingsStore(
		(state) => state.settings.backupReminderFrequency ?? 7,
	);
	const updateSettings = useSettingsStore((state) => state.updateSettings);
	const onboardingStatus = useSettingsStore((state) => state.settings.onboardingStatus);
	const hasDismissedInstallNudge = useSettingsStore(
		(state) => state.settings.hasDismissedInstallNudge,
	);
	const isInstalled = useExtensionInstalled();

	// Local state to hide it until the next render if they close it this session
	const [isDismissed, setIsDismissed] = useState(false);
	const [now] = useState(() => Date.now());
	const [isStandalone] = useState(() => {
		if (typeof window === "undefined") return false;
		return window.matchMedia("(display-mode: standalone)").matches;
	});

	const itemCount = useLiveQuery(() => db.items.filter((i) => !i.deletedAt).count());
	const folderCount = useLiveQuery(() => db.folders.filter((f) => !f.deletedAt).count());

	const isOverdue = () => {
		if (backupReminderFrequency === "off") return false;
		if (!lastBackupDate) return true;

		const lastBackup = new Date(lastBackupDate);
		const daysSinceBackup = (now - lastBackup.getTime()) / (1000 * 60 * 60 * 24);
		return daysSinceBackup > backupReminderFrequency;
	};

	const willInstallNudgeShow = !(
		isInstalled === null ||
		isInstalled === true ||
		isStandalone ||
		hasDismissedInstallNudge ||
		onboardingStatus === "in_progress"
	);

	if (
		isDismissed ||
		!isOverdue() ||
		onboardingStatus === "in_progress" ||
		willInstallNudgeShow ||
		itemCount === undefined ||
		folderCount === undefined ||
		itemCount + folderCount < BACKUP_MINIMUM_DATA_THRESHOLD
	) {
		return null;
	}

	const handleRemindLater = () => {
		// Just snooze it for now by updating lastBackupDate to now
		updateSettings({
			lastBackupDate: new Date().toISOString(),
		});
		setIsDismissed(true);
	};

	return (
		<section className="relative mx-4 mt-4 rounded-lg border border-border bg-card px-4 py-3 pb-4 corner-squircle supports-[corner-shape:squircle]:rounded-4xl sm:px-6 sm:py-3 md:mt-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
				<div className="flex flex-col items-center gap-1 text-center sm:flex-row sm:gap-2 sm:text-left">
					<span className="w-fit rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-amber-600 uppercase dark:text-amber-500">
						Reminder
					</span>
					<p className="text-sm leading-snug text-foreground sm:leading-normal">
						{getContextText(itemCount, folderCount)}
					</p>
				</div>
				<div className="flex w-full items-center justify-center gap-4 pt-1 sm:w-auto sm:justify-end sm:pt-0">
					<div className="flex items-center gap-2">
						<Button asChild size="sm" className="h-7 text-xs">
							<Link to="/settings?tab=data#backup-restore" onClick={() => setIsDismissed(true)}>
								<DownloadIcon className="mr-1.5 h-3.5 w-3.5" /> Backup Now
							</Link>
						</Button>
						<Button
							onClick={handleRemindLater}
							size="sm"
							variant="ghost"
							className="h-7 text-xs text-muted-foreground hover:text-foreground"
						>
							Later
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
