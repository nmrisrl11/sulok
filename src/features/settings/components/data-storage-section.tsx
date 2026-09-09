import { db } from "@/db/db";
import { ImportPreviewDialog } from "@/features/settings/components/import-preview-dialog";
import { SettingsCard } from "@/features/settings/components/settings-card";
import { exportData } from "@/features/settings/utils/export-utils";
import { parseImportFile, type ParsedImportData } from "@/features/settings/utils/import-utils";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";
import { useLiveQuery } from "dexie-react-hooks";
import {
	AlertCircleIcon,
	BracesIcon,
	DownloadIcon,
	FileTextIcon,
	TableIcon,
	UploadCloudIcon,
	UploadIcon,
} from "lucide-react";
import { useRef, useState } from "react";

interface ExportOptionButtonProps {
	icon: React.ReactNode;
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
				<h4 className="text-sm font-medium text-foreground">{title}</h4>
				<p className="mt-0.5 hidden text-xs leading-snug text-muted-foreground sm:block">
					{description}
				</p>
			</div>
		</button>
	);
}

export function DataStorageSection() {
	const [isImportPreviewOpen, setIsImportPreviewOpen] = useState(false);
	const [parsedData, setParsedData] = useState<ParsedImportData | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const importIdRef = useRef(0);
	const cleanupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const itemCount = useLiveQuery(() => db.items.count()) ?? 0;

	const handleExport = (format: "json" | "csv" | "txt") => {
		exportData(format).catch((error) => {
			notify.error(error instanceof Error ? error.message : "Failed to export data");
		});
	};

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const currentId = ++importIdRef.current;
		if (cleanupTimerRef.current) {
			clearTimeout(cleanupTimerRef.current);
			cleanupTimerRef.current = null;
		}

		try {
			const data = await parseImportFile(file);
			if (currentId === importIdRef.current) {
				setParsedData(data);
				setIsImportPreviewOpen(true);
			}
		} catch (error: unknown) {
			if (currentId === importIdRef.current) {
				if (error instanceof Error) {
					notify.error(error.message);
				} else {
					notify.error("Failed to parse file");
				}
			}
		}

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<div className="animate-in space-y-8 duration-300 fade-in slide-in-from-bottom-2">
			<div>
				<h2 className="font-heading text-xl font-semibold">Data & Storage</h2>
				<p className="mt-1 text-sm text-muted-foreground">
					Your library is stored locally on your device. Manage your storage and export backups to
					safeguard your saved corners.
				</p>
			</div>

			<div className="space-y-6">
				<SettingsCard>
					<div>
						<p className="flex items-center gap-2 text-sm font-medium text-foreground">
							<DownloadIcon className="h-4 w-4" /> Export Library
						</p>
						<p className="mt-1 text-xs text-muted-foreground">
							Create an offline archive of your library to keep your data safe.
						</p>
					</div>
					<div className="grid grid-cols-3 gap-3">
						<ExportOptionButton
							icon={<BracesIcon className="h-5 w-5" />}
							title="JSON"
							description="Full backup with complete metadata"
							onClick={() => handleExport("json")}
							disabled={itemCount === 0}
						/>
						<ExportOptionButton
							icon={<TableIcon className="h-5 w-5" />}
							title="CSV"
							description="Spreadsheet compatible format"
							onClick={() => handleExport("csv")}
							disabled={itemCount === 0}
						/>
						<ExportOptionButton
							icon={<FileTextIcon className="h-5 w-5" />}
							title="TXT"
							description="Simple plain text list of links"
							onClick={() => handleExport("txt")}
							disabled={itemCount === 0}
						/>
					</div>
					{itemCount === 0 && (
						<div className="flex items-start gap-2 rounded-xl bg-amber-500/10 p-3 text-amber-500 corner-squircle supports-[corner-shape:squircle]:rounded-2xl">
							<AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
							<p className="text-xs leading-relaxed font-medium">
								You don't have any items to export yet. Add some items first.
							</p>
						</div>
					)}
				</SettingsCard>

				<SettingsCard>
					<div>
						<p className="flex items-center gap-2 text-sm font-medium text-foreground">
							<UploadIcon className="h-4 w-4" /> Restore Library
						</p>
						<p className="mt-1 text-xs text-muted-foreground">
							Bring back your saved corners from a previous backup file.
						</p>
					</div>
					<input
						type="file"
						ref={fileInputRef}
						className="hidden"
						accept=".json,.csv,.txt"
						onChange={handleFileSelect}
					/>
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						className={cn(
							"group flex w-full items-center justify-start gap-4 p-4 text-left transition-all",
							"rounded-2xl border border-border/50 bg-background hover:border-border hover:bg-muted/50",
							"corner-squircle supports-[corner-shape:squircle]:rounded-3xl",
							"focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
						)}
					>
						<div className="rounded-xl border border-border/50 bg-card p-2.5 text-muted-foreground shadow-sm transition-colors corner-squircle supports-[corner-shape:squircle]:rounded-xl">
							<UploadCloudIcon className="h-5 w-5" />
						</div>
						<div>
							<h4 className="text-sm font-medium text-foreground">Select backup file</h4>
							<p className="mt-0.5 text-xs text-muted-foreground">
								Supports .json, .csv, and .txt files
							</p>
						</div>
					</button>
				</SettingsCard>
			</div>

			{parsedData && (
				<ImportPreviewDialog
					isOpen={isImportPreviewOpen}
					onClose={() => {
						setIsImportPreviewOpen(false);
						const currentId = importIdRef.current;
						if (cleanupTimerRef.current) clearTimeout(cleanupTimerRef.current);
						cleanupTimerRef.current = setTimeout(() => {
							if (currentId === importIdRef.current) setParsedData(null);
						}, 300);
					}}
					data={parsedData}
				/>
			)}
		</div>
	);
}
