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
		<div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
			<div>
				<h2 className="font-heading text-xl font-semibold">Data & Backup</h2>
				<p className="text-sm text-muted-foreground mt-1">
					Your Archive: Securely back up your saved corners or restore them from a previous export.
				</p>
			</div>

			<div className="space-y-8">
				<div className="space-y-4 pb-8 border-b border-border/50">
					<div>
						<p className="text-sm font-medium flex items-center gap-2">
							<DownloadIcon className="w-4 h-4" /> Export Library
						</p>
						<p className="text-xs text-muted-foreground mt-1">
							Create a backup of your saved items in JSON, CSV, or TXT format.
						</p>
					</div>
					<div className="grid grid-cols-3 gap-3">
						<button
							type="button"
							onClick={() => handleExport("json")}
							disabled={itemCount === 0}
							className={cn(
								"flex flex-col items-center sm:items-start gap-2 sm:gap-3 p-3 sm:p-4 text-center sm:text-left transition-all",
								"bg-card hover:bg-accent border border-border/50 hover:border-border rounded-2xl shadow-sm hover:shadow",
								"corner-squircle supports-[corner-shape:squircle]:rounded-2xl",
								"disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
							)}
						>
							<div className="p-2 bg-background rounded-xl corner-squircle supports-[corner-shape:squircle]:rounded-xl text-muted-foreground shadow-sm">
								<BracesIcon className="w-5 h-5" />
							</div>
							<div>
								<h4 className="font-medium text-sm text-foreground">JSON</h4>
								<p className="text-xs text-muted-foreground mt-0.5 leading-snug hidden sm:block">
									Full backup with complete metadata
								</p>
							</div>
						</button>
						<button
							type="button"
							onClick={() => handleExport("csv")}
							disabled={itemCount === 0}
							className={cn(
								"flex flex-col items-center sm:items-start gap-2 sm:gap-3 p-3 sm:p-4 text-center sm:text-left transition-all",
								"bg-card hover:bg-accent border border-border/50 hover:border-border rounded-2xl shadow-sm hover:shadow",
								"corner-squircle supports-[corner-shape:squircle]:rounded-2xl",
								"disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
							)}
						>
							<div className="p-2 bg-background rounded-xl corner-squircle supports-[corner-shape:squircle]:rounded-xl text-muted-foreground shadow-sm">
								<TableIcon className="w-5 h-5" />
							</div>
							<div>
								<h4 className="font-medium text-sm text-foreground">CSV</h4>
								<p className="text-xs text-muted-foreground mt-0.5 leading-snug hidden sm:block">
									Spreadsheet compatible format
								</p>
							</div>
						</button>
						<button
							type="button"
							onClick={() => handleExport("txt")}
							disabled={itemCount === 0}
							className={cn(
								"flex flex-col items-center sm:items-start gap-2 sm:gap-3 p-3 sm:p-4 text-center sm:text-left transition-all",
								"bg-card hover:bg-accent border border-border/50 hover:border-border rounded-2xl shadow-sm hover:shadow",
								"corner-squircle supports-[corner-shape:squircle]:rounded-2xl",
								"disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
							)}
						>
							<div className="p-2 bg-background rounded-xl corner-squircle supports-[corner-shape:squircle]:rounded-xl text-muted-foreground shadow-sm">
								<FileTextIcon className="w-5 h-5" />
							</div>
							<div>
								<h4 className="font-medium text-sm text-foreground">TXT</h4>
								<p className="text-xs text-muted-foreground mt-0.5 leading-snug hidden sm:block">
									Simple plain text list of links
								</p>
							</div>
						</button>
					</div>
					{itemCount === 0 && (
						<div className="flex items-start gap-2 bg-amber-500/10 text-amber-500 p-2.5 rounded-md">
							<AlertCircleIcon className="w-4 h-4 shrink-0 mt-0.5" />
							<p className="text-xs font-medium leading-relaxed">
								You don't have any items to export yet. Add some items first.
							</p>
						</div>
					)}
				</div>

				<div className="space-y-4 pb-8 border-b border-border/50">
					<div>
						<p className="text-sm font-medium flex items-center gap-2">
							<UploadIcon className="w-4 h-4" /> Restore Library
						</p>
						<p className="text-xs text-muted-foreground mt-1">
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
							"w-full group flex items-center justify-start gap-4 p-4 text-left transition-all",
							"bg-card hover:bg-accent border border-border/50 hover:border-border rounded-2xl shadow-sm hover:shadow",
							"corner-squircle supports-[corner-shape:squircle]:rounded-2xl",
							"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
						)}
					>
						<div className="p-2.5 bg-background group-hover:bg-background rounded-xl corner-squircle supports-[corner-shape:squircle]:rounded-xl text-muted-foreground shadow-sm transition-colors">
							<UploadCloudIcon className="w-5 h-5" />
						</div>
						<div>
							<h4 className="font-medium text-sm text-foreground">Select backup file</h4>
							<p className="text-xs text-muted-foreground mt-0.5">
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
