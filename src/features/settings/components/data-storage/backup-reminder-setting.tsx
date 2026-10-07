import { db } from "@/db/db";
import { isBackupOverdue } from "@/features/settings/utils/settings-sync-utils";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/stores";
import { useLiveQuery } from "dexie-react-hooks";
import { BellRingIcon } from "lucide-react";
import { useState } from "react";

const REMINDER_OPTIONS = [
	{ id: 7, label: "7 Days" },
	{ id: 14, label: "14 Days" },
	{ id: 30, label: "30 Days" },
	{ id: "off", label: "Off" },
] as const;

export function BackupReminderSetting() {
	const lastBackupDate = useSettingsStore((state) => state.settings.lastBackupDate);
	const backupReminderFrequency = useSettingsStore(
		(state) => state.settings.backupReminderFrequency ?? 7,
	);
	const isBackupReminderSnoozed = useSettingsStore(
		(state) => state.settings.isBackupReminderSnoozed,
	);
	const updateSettings = useSettingsStore((state) => state.updateSettings);

	const [now] = useState(() => Date.now());

	const itemCount = useLiveQuery(() => db.items.filter((i) => !i.deletedAt).count());
	const folderCount = useLiveQuery(() => db.folders.filter((f) => !f.deletedAt).count());

	const getBackupStatusText = () => {
		if (!lastBackupDate) return "Never backed up";

		const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
		const daysDifference = Math.round(
			(new Date(lastBackupDate).getTime() - now) / (1000 * 60 * 60 * 24),
		);

		return `Last backed up: ${rtf.format(daysDifference, "day")}`;
	};

	const isOverdue = () =>
		isBackupOverdue(
			backupReminderFrequency,
			lastBackupDate,
			itemCount,
			folderCount,
			now,
			isBackupReminderSnoozed,
		);

	return (
		<div className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:py-6 sm:first:pt-0 sm:last:pb-0">
			<div className="space-y-2.5">
				<div>
					<p className="flex items-center gap-2 text-sm font-medium text-foreground">
						<BellRingIcon className="h-4 w-4" /> Backup Reminders
					</p>
					<p className="mt-1 text-xs text-muted-foreground">
						Since your data is stored locally, we recommend exporting your library regularly to
						prevent data loss.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<div className="relative flex h-2 w-2 items-center justify-center">
						{isOverdue() && (
							<span className="absolute inline-flex h-4 w-4 animate-ping rounded-full bg-red-500/50" />
						)}
						<span
							className={cn(
								"relative inline-flex h-2 w-2 rounded-full",
								isOverdue() ? "bg-red-500" : "bg-muted-foreground/40",
							)}
						/>
					</div>
					<p
						className={cn(
							"text-[11px] font-medium tracking-wider uppercase",
							isOverdue() ? "text-red-500" : "text-muted-foreground",
						)}
					>
						{getBackupStatusText()}
					</p>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
				{REMINDER_OPTIONS.map((option) => {
					const isActive = backupReminderFrequency === option.id;
					return (
						<button
							key={option.id}
							type="button"
							onClick={() => updateSettings({ backupReminderFrequency: option.id })}
							className={cn(
								"group flex min-w-0 items-center justify-center text-center transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none supports-[corner-shape:squircle]:corner-squircle",
								"rounded-lg p-2.5 hover:bg-muted/50 supports-[corner-shape:squircle]:rounded-2xl sm:p-2",
								isActive
									? "bg-background text-foreground shadow-engraved"
									: "border border-border/40 bg-muted/20 text-muted-foreground hover:text-foreground",
							)}
						>
							<span className="text-xs font-medium sm:text-sm">{option.label}</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}
