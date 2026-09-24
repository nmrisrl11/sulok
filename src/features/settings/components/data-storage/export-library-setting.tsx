import { db } from "@/db/db";
import { exportData } from "@/features/settings/utils/export-utils";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";
import { useLiveQuery } from "dexie-react-hooks";
import { AlertCircleIcon, BracesIcon, DownloadIcon, FileTextIcon, TableIcon } from "lucide-react";
import { type ReactNode } from "react";

interface ExportOptionButtonProps {
	icon: ReactNode;
	title: string;
	description: string;
	onClick: () => void;
	disabled: boolean;
}

function ExportOptionButton({
	icon,
	title,
	description,
	onClick,
	disabled,
}: ExportOptionButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={cn(
				"flex flex-col items-center gap-2 p-3 text-center transition-all sm:items-start sm:gap-3 sm:p-4 sm:text-left",
				"rounded-2xl border border-border/50 bg-background hover:border-border hover:bg-muted/50",
				"corner-squircle supports-[corner-shape:squircle]:rounded-3xl",
				"focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
			)}
		>
			<div className="rounded-xl border border-border/50 bg-card p-2 text-muted-foreground shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-xl">
				{icon}
			</div>
			<div>
				<h3 className="text-sm font-medium text-foreground">{title}</h3>
				<p className="mt-0.5 hidden text-xs leading-snug text-muted-foreground sm:block">
					{description}
				</p>
			</div>
		</button>
	);
}

export function ExportLibrarySetting() {
	const itemCount = useLiveQuery(() => db.items.count()) ?? 0;
	const folderCount = useLiveQuery(() => db.folders.count()) ?? 0;
	const hasData = itemCount > 0 || folderCount > 0;

	const handleExport = (format: "json" | "csv" | "txt") => {
		exportData(format).catch((error) => {
			notify.error(error instanceof Error ? error.message : "Failed to export data", {
				id: "export-error",
			});
		});
	};

	return (
		<div className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:py-6 sm:first:pt-0 sm:last:pb-0">
			<div>
				<p className="flex items-center gap-2 text-sm font-medium text-foreground">
					<DownloadIcon className="h-4 w-4" /> Export Library
				</p>
				<p className="mt-1 w-full text-xs text-muted-foreground sm:max-w-[85%]">
					Create an offline archive of your library to keep your data safe.
				</p>
			</div>
			<div className="grid grid-cols-3 gap-3">
				<ExportOptionButton
					icon={<BracesIcon className="h-5 w-5" />}
					title="JSON"
					description="Full backup with complete metadata"
					onClick={() => handleExport("json")}
					disabled={!hasData}
				/>
				<ExportOptionButton
					icon={<TableIcon className="h-5 w-5" />}
					title="CSV"
					description="Spreadsheet compatible format"
					onClick={() => handleExport("csv")}
					disabled={!hasData}
				/>
				<ExportOptionButton
					icon={<FileTextIcon className="h-5 w-5" />}
					title="TXT"
					description="Simple plain text list of links"
					onClick={() => handleExport("txt")}
					disabled={!hasData}
				/>
			</div>
			{!hasData && (
				<div className="flex items-start gap-2 rounded-xl bg-amber-500/10 p-3 text-amber-500 corner-squircle supports-[corner-shape:squircle]:rounded-2xl">
					<AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
					<p className="text-xs leading-relaxed font-medium">
						You don't have any items to export yet. Add some items first.
					</p>
				</div>
			)}
		</div>
	);
}
