import { parseImportFile, type ParsedImportData } from "@/features/settings/utils/import-utils";
import { useExtensionInstalled } from "@/hooks/use-extension-installed";
import { useInstallApp } from "@/hooks/use-install-app";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";
import { LoaderIcon, UploadCloudIcon, UploadIcon } from "lucide-react";
import { Suspense, lazy, useRef, useState, type ChangeEvent } from "react";

const ImportPreviewDialog = lazy(() =>
	import("./import-preview-dialog").then((m) => ({ default: m.ImportPreviewDialog })),
);

export function RestoreLibrarySetting() {
	const [isImportPreviewOpen, setIsImportPreviewOpen] = useState(false);
	const [parsedData, setParsedData] = useState<ParsedImportData | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const importIdRef = useRef(0);
	const cleanupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
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

	const isExtensionInstalled = useExtensionInstalled();
	const { isDesktop } = useInstallApp();

	const handleExtensionImport = () => {
		if (isExtensionInstalled) {
			window.postMessage({ type: "SULOK_EXT_TRIGGER_BOOKMARK_IMPORT_FROM_WEB" }, "*");
		} else {
			notify.warning("Sulok Browser Extension is not installed. Please install it first.", {
				id: "ext-not-installed",
			});
		}
	};

	return (
		<div className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:py-6 sm:first:pt-0 sm:last:pb-0">
			<div>
				<p className="flex items-center gap-2 text-sm font-medium text-foreground">
					<UploadIcon className="h-4 w-4" /> Restore Library
				</p>
				<p className="mt-1 w-full text-xs text-muted-foreground sm:max-w-[85%]">
					Bring back your saved corners from a previous backup file or import existing bookmarks
					directly from your browser.
				</p>
			</div>

			<div className="flex flex-col gap-3">
				{isDesktop && (
					<button
						type="button"
						onClick={handleExtensionImport}
						className={cn(
							"group flex w-full items-center justify-start gap-4 p-4 text-left transition-all",
							"rounded-xl border border-border/50 bg-background hover:border-border hover:bg-muted/50",
							"corner-squircle supports-[corner-shape:squircle]:rounded-4xl",
							"focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
						)}
					>
						<div className="rounded-lg border border-border/50 bg-card p-2.5 text-muted-foreground shadow-sm transition-colors corner-squircle supports-[corner-shape:squircle]:rounded-2xl">
							<UploadCloudIcon className="h-5 w-5" />
						</div>
						<div>
							<h3 className="text-sm font-medium text-foreground">Sync Browser Bookmarks</h3>
							<p className="mt-0.5 text-xs text-muted-foreground">
								{isExtensionInstalled === true
									? "Instantly import your current browser's bookmarks"
									: "Requires the Sulok Browser Extension"}
							</p>
						</div>
					</button>
				)}

				<input
					type="file"
					ref={fileInputRef}
					className="hidden"
					accept=".json,.csv,.txt,.html"
					onChange={handleFileSelect}
				/>
				<button
					type="button"
					onClick={() => fileInputRef.current?.click()}
					className={cn(
						"group flex w-full items-center justify-start gap-4 p-4 text-left transition-all",
						"rounded-xl border border-border/50 bg-background hover:border-border hover:bg-muted/50",
						"corner-squircle supports-[corner-shape:squircle]:rounded-4xl",
						"focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
					)}
				>
					<div className="rounded-lg border border-border/50 bg-card p-2.5 text-muted-foreground shadow-sm transition-colors corner-squircle supports-[corner-shape:squircle]:rounded-2xl">
						<UploadIcon className="h-5 w-5" />
					</div>
					<div>
						<h3 className="text-sm font-medium text-foreground">Upload backup file</h3>
						<p className="mt-0.5 text-xs text-muted-foreground">
							Supports .json, .csv, .txt, and .html files
						</p>
					</div>
				</button>
			</div>

			{parsedData && (
				<Suspense
					fallback={
						<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
							<LoaderIcon className="h-6 w-6 animate-spin text-muted-foreground" />
						</div>
					}
				>
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
				</Suspense>
			)}
		</div>
	);
}
