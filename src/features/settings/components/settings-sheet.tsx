import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { db } from "@/db/db";
import { notify } from "@/lib/notify";
import { useLiveQuery } from "dexie-react-hooks";
import {
	AlertCircleIcon,
	DownloadIcon,
	MusicIcon,
	PaletteIcon,
	SettingsIcon,
	SmileIcon,
	UploadIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { exportData } from "../utils/export-utils";
import { parseImportFile, type ParsedImportData } from "../utils/import-utils";
import { ImportPreviewDialog } from "./import-preview-dialog";

export function SettingsSheet({ children }: { children: React.ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);
	const [isImportPreviewOpen, setIsImportPreviewOpen] = useState(false);
	const [parsedData, setParsedData] = useState<ParsedImportData | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const itemCount = useLiveQuery(() => db.items.count()) ?? 0;

	const handleExport = (format: "json" | "csv" | "txt") => {
		exportData(format).catch((error) => {
			notify.error(error instanceof Error ? error.message : "Failed to export data");
		});
	};

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			const data = await parseImportFile(file);
			setParsedData(data);
			setIsImportPreviewOpen(true);
		} catch (error: unknown) {
			if (error instanceof Error) {
				notify.error(error.message);
			} else {
				notify.error("Failed to parse file");
			}
		}

		// Reset input so the same file can be selected again
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<>
			<Sheet open={isOpen} onOpenChange={setIsOpen}>
				<SheetTrigger asChild>{children}</SheetTrigger>
				<SheetContent className="w-full sm:max-w-md overflow-y-auto custom-scrollbar">
					<SheetHeader className="mb-6 px-4 pt-4 pb-0">
						<SheetTitle className="font-heading text-2xl flex items-center gap-2">
							<SettingsIcon className="w-6 h-6 text-primary" />
							Settings
						</SheetTitle>
						<SheetDescription>Customize your experience and manage your data.</SheetDescription>
					</SheetHeader>

					<div className="space-y-6 pb-10 px-4">
						{/* Data Management */}
						<section className="space-y-3">
							<h3 className="font-heading text-base flex items-center gap-2">
								<DownloadIcon className="w-4 h-4 text-muted-foreground" />
								Data & Storage
							</h3>

							<div className="space-y-2">
								<div className="bg-card border rounded-lg p-3 space-y-2">
									<p className="text-sm font-medium">Export Data</p>
									<p className="text-xs text-muted-foreground mb-2">
										Create a backup of your saved items in JSON, CSV, or TXT format.
									</p>
									<div className="flex gap-2">
										<Button
											size="sm"
											variant="secondary"
											className="flex-1"
											onClick={() => handleExport("json")}
											disabled={itemCount === 0}
										>
											JSON
										</Button>
										<Button
											size="sm"
											variant="secondary"
											className="flex-1"
											onClick={() => handleExport("csv")}
											disabled={itemCount === 0}
										>
											CSV
										</Button>
										<Button
											size="sm"
											variant="secondary"
											className="flex-1"
											onClick={() => handleExport("txt")}
											disabled={itemCount === 0}
										>
											TXT
										</Button>
									</div>
									{itemCount === 0 && (
										<div className="flex items-start gap-2 bg-amber-500/10 text-amber-500 p-2.5 rounded-md mt-3">
											<AlertCircleIcon className="w-4 h-4 shrink-0 mt-0.5" />
											<p className="text-xs font-medium leading-relaxed">
												You don't have any items to export yet. Add some items first.
											</p>
										</div>
									)}
								</div>

								<div className="bg-card border rounded-lg p-3 space-y-2">
									<p className="text-sm font-medium">Import Data</p>
									<p className="text-xs text-muted-foreground mb-2">
										Restore your items from a previous backup file.
									</p>
									<input
										type="file"
										ref={fileInputRef}
										className="hidden"
										accept=".json,.csv,.txt"
										onChange={handleFileSelect}
									/>
									<Button
										size="sm"
										variant="outline"
										className="w-full flex items-center gap-2"
										onClick={() => fileInputRef.current?.click()}
									>
										<UploadIcon className="w-4 h-4" />
										Choose File
									</Button>
								</div>
							</div>
						</section>

						{/* Customization Placeholders */}
						<section className="space-y-3 opacity-50 pointer-events-none">
							<h3 className="font-heading text-base flex items-center gap-2">
								<PaletteIcon className="w-4 h-4 text-muted-foreground" />
								Personalization
								<span className="text-[9px] uppercase tracking-wider font-bold bg-muted px-1.5 py-0.5 rounded ml-auto text-muted-foreground">
									Coming Soon
								</span>
							</h3>
							<div className="bg-card border rounded-lg p-3 space-y-1.5">
								<p className="text-sm font-medium flex items-center gap-2">
									<MusicIcon className="w-4 h-4" /> Sound FX
								</p>
								<p className="text-xs text-muted-foreground">
									Toggle UI sound effects and adjust volume.
								</p>
							</div>
							<div className="bg-card border rounded-lg p-3 space-y-1.5">
								<p className="text-sm font-medium flex items-center gap-2">
									<SmileIcon className="w-4 h-4" /> Sulo Customization
								</p>
								<p className="text-xs text-muted-foreground">
									Customize Sulo's behavior, expressions, and whispers.
								</p>
							</div>
						</section>
					</div>
				</SheetContent>
			</Sheet>

			{parsedData && (
				<ImportPreviewDialog
					isOpen={isImportPreviewOpen}
					onClose={() => setIsImportPreviewOpen(false)}
					data={parsedData}
				/>
			)}
		</>
	);
}
