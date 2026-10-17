import { parseImportFile, type ParsedImportData } from "@/features/settings/utils/import-utils";
import { isExternalFileDrag, isSupportedBackupFile } from "@/lib/external-link-drag";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";
import { FileBracesIcon, FileCodeIcon, FileSpreadsheetIcon, FileTextIcon } from "lucide-react";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";

const ImportPreviewDialog = lazy(() =>
	import("@/features/settings/components/data-storage/import-preview-dialog").then((m) => ({
		default: m.ImportPreviewDialog,
	})),
);

const PEEKING_FILES = [
	{
		ext: "HTML",
		icon: FileCodeIcon,
		rotation: "-rotate-12",
		translate: "-translate-y-1",
		zIndex: "z-1",
		color: "text-orange-500",
		badgeColor: "bg-orange-500",
	},
	{
		ext: "JSON",
		icon: FileBracesIcon,
		rotation: "-rotate-3",
		translate: "-translate-y-2",
		zIndex: "z-2",
		color: "text-yellow-500",
		badgeColor: "bg-yellow-500",
	},
	{
		ext: "CSV",
		icon: FileSpreadsheetIcon,
		rotation: "rotate-3",
		translate: "-translate-y-2",
		zIndex: "z-3",
		color: "text-green-500",
		badgeColor: "bg-green-500",
	},
	{
		ext: "TXT",
		icon: FileTextIcon,
		rotation: "rotate-12",
		translate: "-translate-y-1",
		zIndex: "z-4",
		color: "text-blue-500",
		badgeColor: "bg-blue-500",
	},
];

function PeekingFolderIllustration() {
	return (
		<div className="relative mb-4 flex h-20 w-24 items-center justify-center select-none sm:h-24 sm:w-28">
			{/* Soft ambient halo behind folder */}
			<div className="pointer-events-none absolute -inset-1 -z-10 rounded-full bg-(--folder-color-back,#56b2e3) opacity-20 blur-xl" />

			{/* Folder Back Wall (matches authentic FolderIcon theme variable) */}
			<svg
				viewBox="0 0 64 64"
				xmlns="http://www.w3.org/2000/svg"
				className="absolute inset-0 h-full w-full drop-shadow-xs"
			>
				<path
					d="m59.61 10.69h-29.43c-1.2 0-2.35-.49-3.18-1.36l-3.76-3.94c-.83-.87-1.98-1.36-3.18-1.36h-15.67c-2.43 0-4.39 1.96-4.39 4.38v41.88c0 2.42 1.96 4.39 4.39 4.39h55.22c2.42 0 4.39-1.96 4.39-4.39v-35.21c0-2.42-1.96-4.39-4.39-4.39z"
					fill="var(--folder-color-back, #56b2e3)"
				/>
			</svg>

			{/* Option 1: Folder Interior Pocket Cavity Depth */}
			<div className="pointer-events-none absolute inset-x-2.5 top-5 bottom-3.5 rounded-b-md bg-black/10 blur-[0.5px]" />

			{/* Option 2: 4 Tactile Peeking Document Cards */}
			<div className="absolute inset-x-2 top-0 z-1 flex items-end justify-center -space-x-1 sm:inset-x-2.5 sm:top-0.5 sm:-space-x-1.5">
				{PEEKING_FILES.map(
					({ ext, icon: Icon, rotation, translate, zIndex, color, badgeColor }) => (
						<div
							key={ext}
							className={cn(
								"relative flex h-9.5 w-6.5 flex-col items-center justify-between overflow-hidden rounded-[3.5px] border border-black/5 bg-(--folder-color-paper,#ffffff) p-0.5 shadow-[0_3px_8px_-2px_rgba(0,0,0,0.18)] transition-transform duration-200 sm:h-11 sm:w-7.5 sm:p-1 dark:border-white/10",
								rotation,
								translate,
								zIndex,
							)}
						>
							<Icon className={cn("mt-0.5 h-3.5 w-3.5 sm:mt-0.5 sm:h-4 sm:w-4", color)} />

							{/* Text lines */}
							<div className="my-0.5 flex w-full flex-col gap-[1.5px] px-0.5 opacity-35">
								<div className="h-px w-3/4 rounded-full bg-foreground" />
								<div className="h-px w-1/2 rounded-full bg-foreground" />
							</div>

							<span
								className={cn(
									"w-full rounded-xs text-center font-mono text-[6.5px] font-bold tracking-tight text-white sm:text-[7.5px]",
									badgeColor,
								)}
							>
								{ext}
							</span>
						</div>
					),
				)}
			</div>

			{/* Folder Front Flap with Scooped Ergonomic Lip & Top Highlight */}
			<svg
				viewBox="0 0 64 64"
				xmlns="http://www.w3.org/2000/svg"
				className="pointer-events-none absolute inset-0 z-10 h-full w-full drop-shadow-xs"
			>
				{/* Front Flap Body with Ergonomic Center Scoop */}
				<path
					d="m59.61 20.42h-13.61c-4 0-7 2.6-14 2.6s-10-2.6-14-2.6h-13.61c-2.43 0-4.39 1.96-4.39 4.39v30.78c0 2.42 1.96 4.39 4.39 4.39h55.22c2.42 0 4.39-1.96 4.39-4.39v-30.78c0-2.43-1.96-4.39-4.39-4.39z"
					fill="var(--folder-color-front, #98cfef)"
				/>
				{/* Subtle Top Lip Highlight */}
				<path
					d="m4.39 20.42h13.61c4 0 7 2.6 14 2.6s10-2.6 14-2.6h13.61"
					stroke="rgba(255, 255, 255, 0.45)"
					strokeWidth="0.75"
					fill="none"
				/>
			</svg>
		</div>
	);
}

/**
 * Global manager that listens for file drag-and-drop events anywhere on the Sulok window.
 * When a bookmark or backup file (.html, .json, .csv, .txt) is dropped, it automatically
 * parses the file and triggers the ImportPreviewDialog.
 */
export function FileDropManager() {
	const [isDraggingFile, setIsDraggingFile] = useState(false);
	const [isImportPreviewOpen, setIsImportPreviewOpen] = useState(false);
	const [isImporting, setIsImporting] = useState(false);
	const [parsedData, setParsedData] = useState<ParsedImportData | null>(null);

	const dragCounterRef = useRef(0);
	const importIdRef = useRef(0);
	const cleanupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const isImportPreviewOpenRef = useRef(false);
	const isImportingRef = useRef(false);

	useEffect(() => {
		isImportPreviewOpenRef.current = isImportPreviewOpen;
	}, [isImportPreviewOpen]);

	useEffect(() => {
		isImportingRef.current = isImporting;
	}, [isImporting]);

	const handleCloseDialog = useCallback(() => {
		setIsImportPreviewOpen(false);
		setIsImporting(false);
		isImportPreviewOpenRef.current = false;
		isImportingRef.current = false;
		if (cleanupTimerRef.current) {
			clearTimeout(cleanupTimerRef.current);
		}
		// Allow exit animation to finish before clearing parsed data
		cleanupTimerRef.current = setTimeout(() => {
			setParsedData(null);
		}, 300);
	}, []);

	const processDroppedFile = useCallback(async (file: File) => {
		if (isImportPreviewOpenRef.current) {
			return;
		}

		if (!isSupportedBackupFile(file)) {
			notify.warning("Unsupported file format", {
				description: "Please drop a bookmark or backup file (.html, .json, .csv, or .txt).",
				id: `file-unsupported-${file.name}`,
			});
			return;
		}

		const currentId = ++importIdRef.current;
		if (cleanupTimerRef.current) {
			clearTimeout(cleanupTimerRef.current);
			cleanupTimerRef.current = null;
		}

		const readingToastId = `reading-file-${file.name}`;
		notify.info(`Reading ${file.name}...`, { id: readingToastId, hideReaction: true });

		try {
			const result = await parseImportFile(file);
			notify.dismiss(readingToastId);
			const isAnyModalOpen = Boolean(
				document.querySelector(
					'[role="dialog"], [role="alertdialog"], [data-slot="dialog-content"]',
				),
			);
			if (currentId !== importIdRef.current || isImportPreviewOpenRef.current || isAnyModalOpen)
				return;

			if (
				result.validFolders.length === 0 &&
				result.validItems.length === 0 &&
				result.invalidCount === 0
			) {
				notify.warning("No bookmarks found", {
					description: `No folders or links were found in ${file.name}.`,
					id: `file-empty-${file.name}`,
				});
				return;
			}

			if (cleanupTimerRef.current) {
				clearTimeout(cleanupTimerRef.current);
				cleanupTimerRef.current = null;
			}

			isImportPreviewOpenRef.current = true;
			setParsedData(result);
			setIsImportPreviewOpen(true);
		} catch (error) {
			notify.dismiss(readingToastId);
			if (currentId !== importIdRef.current) return;

			const message = error instanceof Error ? error.message : "Failed to parse file";
			notify.error("Import failed", {
				description: message,
				id: `file-parse-error-${file.name}`,
			});
		}
	}, []);

	useEffect(() => {
		const isDropBlocked = () => {
			return (
				isImportPreviewOpenRef.current ||
				Boolean(
					document.querySelector(
						'[role="dialog"], [role="alertdialog"], [data-slot="dialog-content"]',
					),
				)
			);
		};

		const handleDragEnter = (e: DragEvent) => {
			if (!isExternalFileDrag(e)) return;
			e.preventDefault();
			if (isDropBlocked()) {
				dragCounterRef.current = 0;
				setIsDraggingFile(false);
				return;
			}
			dragCounterRef.current++;
			if (dragCounterRef.current === 1) {
				setIsDraggingFile(true);
			}
		};

		const handleDragOver = (e: DragEvent) => {
			if (!isExternalFileDrag(e)) return;
			e.preventDefault();
			if (isDropBlocked()) {
				dragCounterRef.current = 0;
				setIsDraggingFile(false);
				if (e.dataTransfer) {
					e.dataTransfer.dropEffect = "none";
				}
				return;
			}
			if (e.dataTransfer) {
				e.dataTransfer.dropEffect = "copy";
			}
		};

		const handleDragLeave = (e: DragEvent) => {
			if (!isExternalFileDrag(e)) return;
			e.preventDefault();
			if (isDropBlocked()) return;
			dragCounterRef.current--;

			if (
				dragCounterRef.current <= 0 ||
				e.clientX <= 0 ||
				e.clientY <= 0 ||
				e.clientX >= window.innerWidth ||
				e.clientY >= window.innerHeight
			) {
				dragCounterRef.current = 0;
				setIsDraggingFile(false);
			}
		};

		const handleDrop = async (e: DragEvent) => {
			if (!isExternalFileDrag(e)) return;
			e.preventDefault();
			dragCounterRef.current = 0;
			setIsDraggingFile(false);

			if (isImportPreviewOpenRef.current) {
				if (isImportingRef.current) {
					notify.warning("Import in progress", {
						description:
							"Please wait for the current import to finish before importing another file.",
						id: "import-in-progress-blocked",
					});
				} else {
					notify.warning("Preview already open", {
						description: "Please import or close the current preview before dropping another file.",
						id: "import-preview-active-blocked",
					});
				}
				return;
			}

			if (
				document.querySelector(
					'[role="dialog"], [role="alertdialog"], [data-slot="dialog-content"]',
				)
			) {
				notify.warning("Action in progress", {
					description: "Please close the open dialog before importing a file.",
					id: "modal-open-drop-blocked",
				});
				return;
			}

			const file = e.dataTransfer?.files?.[0];
			if (!file) return;

			await processDroppedFile(file);
		};

		const handleDragEnd = () => {
			dragCounterRef.current = 0;
			setIsDraggingFile(false);
		};

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				dragCounterRef.current = 0;
				setIsDraggingFile(false);
			}
		};

		window.addEventListener("dragenter", handleDragEnter);
		window.addEventListener("dragover", handleDragOver);
		window.addEventListener("dragleave", handleDragLeave);
		window.addEventListener("drop", handleDrop);
		window.addEventListener("dragend", handleDragEnd);
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("dragenter", handleDragEnter);
			window.removeEventListener("dragover", handleDragOver);
			window.removeEventListener("dragleave", handleDragLeave);
			window.removeEventListener("drop", handleDrop);
			window.removeEventListener("dragend", handleDragEnd);
			window.removeEventListener("keydown", handleKeyDown);
			if (cleanupTimerRef.current) {
				clearTimeout(cleanupTimerRef.current);
			}
		};
	}, [processDroppedFile]);

	return (
		<>
			{isDraggingFile && (
				<div
					data-testid="file-drop-overlay"
					className="fixed inset-0 z-100 flex animate-in items-center justify-center p-4 backdrop-blur-md duration-200 select-none fade-in sm:p-6 md:p-8"
				>
					<div className="flex h-full w-full items-center justify-center rounded-3xl border-2 border-dashed bg-background/85 p-4 text-center sm:p-6">
						<div className="relative flex w-full max-w-xs animate-in flex-col items-center justify-center rounded-2xl border border-border/70 bg-card/95 p-6 shadow-lg backdrop-blur-xl duration-200 zoom-in-95 corner-squircle supports-[corner-shape:squircle]:rounded-[3rem] sm:max-w-sm sm:p-7">
							<PeekingFolderIllustration />
							<h2 className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl">
								Import your saved corners
							</h2>
							<p className="mt-1.5 max-w-70 text-xs leading-relaxed text-balance text-muted-foreground sm:max-w-xs sm:text-sm">
								Release your bookmark or backup file to preview and add them to your library.
							</p>
						</div>
					</div>
				</div>
			)}

			{parsedData && (
				<Suspense fallback={null}>
					<ImportPreviewDialog
						isOpen={isImportPreviewOpen}
						onClose={handleCloseDialog}
						data={parsedData}
						onImportingChange={setIsImporting}
					/>
				</Suspense>
			)}
		</>
	);
}
