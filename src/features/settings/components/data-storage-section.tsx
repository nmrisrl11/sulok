import { db } from "@/db/db";
import { ImportPreviewDialog } from "@/features/settings/components/import-preview-dialog";
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
				<h2 className="font-heading text-xl font-semibold">Data & Backup</h2>
				<p className="mt-1 text-sm text-muted-foreground">
					Your Archive: Securely back up your saved corners or restore them from a previous export.
				</p>
			</div>

			<div className="space-y-8">
				<div className="space-y-4 border-b border-border/50 pb-8">
					<div>
						<p className="flex items-center gap-2 text-sm font-medium">
							<DownloadIcon className="h-4 w-4" /> Export Library
						</p>
						<p className="mt-1 text-xs text-muted-foreground">
							Create a backup of your saved items in JSON, CSV, or TXT format.
						</p>
					</div>
					<div className="grid grid-cols-3 gap-3">
						<button
							type="button"
							onClick={() => handleExport("json")}
							disabled={itemCount === 0}
							className={cn(
								"flex flex-col items-center gap-2 p-3 text-center transition-all sm:items-start sm:gap-3 sm:p-4 sm:text-left",
								"rounded-2xl border border-border/50 bg-card shadow-sm hover:border-border hover:bg-accent hover:shadow",
								"corner-squircle supports-[corner-shape:squircle]:rounded-2xl",
								"focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
							)}
						>
							<div className="rounded-xl bg-background p-2 text-muted-foreground shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-xl">
								<BracesIcon className="h-5 w-5" />
							</div>
							<div>
								<h4 className="text-sm font-medium text-foreground">JSON</h4>
								<p className="mt-0.5 hidden text-xs leading-snug text-muted-foreground sm:block">
									Full backup with complete metadata
								</p>
							</div>
						</button>
						<button
							type="button"
							onClick={() => handleExport("csv")}
							disabled={itemCount === 0}
							className={cn(
								"flex flex-col items-center gap-2 p-3 text-center transition-all sm:items-start sm:gap-3 sm:p-4 sm:text-left",
								"rounded-2xl border border-border/50 bg-card shadow-sm hover:border-border hover:bg-accent hover:shadow",
								"corner-squircle supports-[corner-shape:squircle]:rounded-2xl",
								"focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
							)}
						>
							<div className="rounded-xl bg-background p-2 text-muted-foreground shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-xl">
								<TableIcon className="h-5 w-5" />
							</div>
							<div>
								<h4 className="text-sm font-medium text-foreground">CSV</h4>
								<p className="mt-0.5 hidden text-xs leading-snug text-muted-foreground sm:block">
									Spreadsheet compatible format
								</p>
							</div>
						</button>
						<button
							type="button"
							onClick={() => handleExport("txt")}
							disabled={itemCount === 0}
							className={cn(
								"flex flex-col items-center gap-2 p-3 text-center transition-all sm:items-start sm:gap-3 sm:p-4 sm:text-left",
								"rounded-2xl border border-border/50 bg-card shadow-sm hover:border-border hover:bg-accent hover:shadow",
								"corner-squircle supports-[corner-shape:squircle]:rounded-2xl",
								"focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
							)}
						>
							<div className="rounded-xl bg-background p-2 text-muted-foreground shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-xl">
								<FileTextIcon className="h-5 w-5" />
							</div>
							<div>
								<h4 className="text-sm font-medium text-foreground">TXT</h4>
								<p className="mt-0.5 hidden text-xs leading-snug text-muted-foreground sm:block">
									Simple plain text list of links
								</p>
							</div>
						</button>
					</div>
					{itemCount === 0 && (
						<div className="flex items-start gap-2 rounded-md bg-amber-500/10 p-2.5 text-amber-500">
							<AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
							<p className="text-xs leading-relaxed font-medium">
								You don't have any items to export yet. Add some items first.
							</p>
						</div>
					)}
				</div>

				<div className="space-y-4 border-b border-border/50 pb-8">
					<div>
						<p className="flex items-center gap-2 text-sm font-medium">
							<UploadIcon className="h-4 w-4" /> Restore Library
						</p>
						<p className="mt-1 text-xs text-muted-foreground">
							Restore your items from a previous backup file.
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
							"rounded-2xl border border-border/50 bg-card shadow-sm hover:border-border hover:bg-accent hover:shadow",
							"corner-squircle supports-[corner-shape:squircle]:rounded-2xl",
							"focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
						)}
					>
						<div className="rounded-xl bg-background p-2.5 text-muted-foreground shadow-sm transition-colors corner-squircle group-hover:bg-background supports-[corner-shape:squircle]:rounded-xl">
							<UploadCloudIcon className="h-5 w-5" />
						</div>
						<div>
							<h4 className="text-sm font-medium text-foreground">Select backup file</h4>
							<p className="mt-0.5 text-xs text-muted-foreground">
								Supports .json, .csv, and .txt files
							</p>
						</div>
					</button>
				</div>
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
