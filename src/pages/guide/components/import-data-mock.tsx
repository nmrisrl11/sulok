import { FolderIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "framer-motion";
import {
	CheckCircle2Icon,
	CloudUploadIcon,
	FileCodeIcon,
	FileSpreadsheetIcon,
	FileTextIcon,
	MousePointer2Icon,
	SettingsIcon,
	UploadIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

const MOCK_PREVIEW_ITEMS = [
	{
		icon: <FolderIcon className="h-3.5 w-3.5 text-blue-500" />,
		titleWidth: "w-20",
		subWidth: "w-10",
	},
	{
		icon: <FolderIcon className="h-3.5 w-3.5 text-purple-500" />,
		titleWidth: "w-16",
		subWidth: "w-12",
	},
	{
		icon: <div className="h-3 w-3 rounded-full bg-orange-500" />,
		titleWidth: "w-24",
		subWidth: "w-32",
	},
	{
		icon: <div className="h-3 w-3 rounded-full bg-red-500" />,
		titleWidth: "w-20",
		subWidth: "w-28",
	},
];

const FILE_TYPES = [
	{ label: "JSON", icon: <span className="text-sm font-bold text-yellow-500">{"{}"}</span> },
	{ label: "CSV", icon: <FileSpreadsheetIcon className="h-5 w-5 text-green-600" /> },
	{ label: "TXT", icon: <FileTextIcon className="h-5 w-5 text-blue-600" /> },
	{ label: "HTML", icon: <FileCodeIcon className="h-5 w-5 text-orange-500" /> },
];

const SETTING_OPTIONS = [
	{
		id: "sync",
		icon: CloudUploadIcon,
		opacity: "opacity-40",
		isDummy: true,
		titleWidth: "w-32",
		descWidth: "w-48",
	},
	{
		id: "upload",
		icon: UploadIcon,
		title: "Upload backup file",
		description: "Supports .json, .csv, .txt, and .html files",
		opacity: "opacity-100",
		isDummy: false,
	},
	{
		id: "settings",
		icon: SettingsIcon,
		opacity: "opacity-20",
		isDummy: true,
		titleWidth: "w-28",
		descWidth: "w-40",
	},
];

export function ImportDataMock() {
	const prefersReducedMotion = useReducedMotion() === true;
	const [step, setStep] = useState(0);

	useEffect(() => {
		if (prefersReducedMotion) {
			return;
		}
		let isMounted = true;
		const runLoop = async () => {
			while (isMounted) {
				setStep(0); // Idle
				await new Promise((r) => setTimeout(r, 1000));
				if (!isMounted) break;

				setStep(1); // Move to Upload backup file Option
				await new Promise((r) => setTimeout(r, 800));
				if (!isMounted) break;

				setStep(2); // Click Upload backup file Option
				await new Promise((r) => setTimeout(r, 400));
				if (!isMounted) break;

				setStep(3); // File Picker Opens, move to JSON
				await new Promise((r) => setTimeout(r, 800));
				if (!isMounted) break;

				setStep(4); // Click JSON
				await new Promise((r) => setTimeout(r, 400));
				if (!isMounted) break;

				setStep(5); // Import Preview Opens, move to Import button
				await new Promise((r) => setTimeout(r, 800));
				if (!isMounted) break;

				setStep(6); // Click Import
				await new Promise((r) => setTimeout(r, 1000));
				if (!isMounted) break;

				setStep(7); // Dialog closes, Toast appears
				await new Promise((r) => setTimeout(r, 2500)); // Linger on success toast

				setStep(8); // Toast fades out before restart
				await new Promise((r) => setTimeout(r, 800));
			}
		};
		runLoop();
		return () => {
			isMounted = false;
		};
	}, [prefersReducedMotion]);

	const isFilePickerOpen = prefersReducedMotion || step === 3 || step === 4;
	const isImportPreviewOpen = !prefersReducedMotion && (step === 5 || step === 6);
	const showPing = !prefersReducedMotion && (step === 2 || step === 4 || step === 6);

	const cursorPosition = prefersReducedMotion
		? "top-[172px] left-[25%]" // Just about to click JSON, offset to not obscure text
		: step === 5 || step === 6
			? "top-[245px] left-[73%]" // Import button position
			: step === 3 || step === 4
				? "top-[172px] left-[25%]" // JSON file option in file picker
				: step === 0 || step === 7 || step === 8
					? "top-[240px] left-[88%]" // Idle
					: "top-[145px] left-[50%]"; // Over Upload Backup block

	return (
		<div
			aria-hidden="true"
			className="relative flex h-70 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-muted/20 shadow-inner select-none corner-squircle supports-[corner-shape:squircle]:rounded-3xl supports-[corner-shape:squircle]:corner-squircle sm:w-85"
		>
			{/* Fake App Background (Settings UI) */}
			<div className="absolute inset-0 flex flex-col gap-3 p-4 transition-all duration-500">
				{/* Header Section */}
				<div className="mb-1 flex flex-col gap-1.5">
					<div className="h-3 w-24 rounded bg-foreground/15" />
					<div className="h-2 w-48 rounded bg-foreground/5" />
				</div>

				{/* Settings Options */}
				{SETTING_OPTIONS.map((option) => (
					<div
						key={option.id}
						className={cn(
							"flex items-center gap-3.5 rounded-xl border p-3.5 shadow-sm transition-colors duration-300 corner-squircle supports-[corner-shape:squircle]:rounded-3xl",
							!option.isDummy && step === 2
								? "border-border bg-muted/50"
								: "border-border/50 bg-background",
							option.opacity,
						)}
					>
						<div
							className={cn(
								"flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-card shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-2xl",
								!option.isDummy ? "text-foreground" : "text-muted-foreground",
							)}
						>
							<option.icon className="h-5 w-5" />
						</div>
						<div className={cn("flex flex-col", option.isDummy ? "gap-1.5" : "gap-0.5")}>
							{!option.isDummy ? (
								<>
									<div className="text-sm font-medium">{option.title}</div>
									<div className="text-[10px] text-muted-foreground">{option.description}</div>
								</>
							) : (
								<>
									<div className={cn("h-2 rounded bg-foreground/15", option.titleWidth)} />
									<div className={cn("h-1.5 rounded bg-foreground/5", option.descWidth)} />
								</>
							)}
						</div>
					</div>
				))}
			</div>

			{/* Dialog Backdrop */}
			<div
				className={cn(
					"absolute inset-0 z-10 bg-background/60 backdrop-blur-[2px] transition-opacity duration-500",
					isFilePickerOpen || isImportPreviewOpen
						? "opacity-100 delay-0"
						: "pointer-events-none opacity-0 delay-0",
				)}
			/>

			{/* Mock File Picker (OS Level Style) */}
			<div
				className={cn(
					"absolute z-20 flex w-64 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-lg transition-all duration-300",
					isFilePickerOpen
						? "scale-100 opacity-100 delay-100"
						: "pointer-events-none scale-95 opacity-0 delay-0",
				)}
			>
				{/* File Picker Header */}
				<div className="flex h-8 items-center justify-between border-b border-border/50 bg-muted/40 px-3 text-[10px] font-medium text-muted-foreground">
					<span>Open backup file</span>
					<div className="flex gap-1.5 opacity-80">
						<div className="h-2 w-2 rounded-full bg-red-400" />
						<div className="h-2 w-2 rounded-full bg-amber-400" />
						<div className="h-2 w-2 rounded-full bg-green-400" />
					</div>
				</div>
				{/* File Picker Content */}
				<div className="grid grid-cols-4 gap-2 bg-card p-3">
					{FILE_TYPES.map((file, i) => (
						<div
							key={i}
							className={cn(
								"flex flex-col items-center gap-1.5 rounded-lg border p-2 transition-colors",
								file.label === "JSON" && (prefersReducedMotion || step === 4)
									? "border-blue-500/30 bg-blue-500/10"
									: "border-transparent hover:bg-muted/50",
							)}
						>
							<div className="flex h-8 w-8 items-center justify-center rounded border border-border/50 bg-background shadow-sm">
								{file.icon}
							</div>
							<span className="text-[8px] font-medium text-foreground">{file.label}</span>
						</div>
					))}
				</div>
			</div>

			{/* The Import Preview Dialog */}
			<div
				className={cn(
					"absolute top-4 bottom-4 z-20 flex w-64 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-lg transition-all duration-500",
					isImportPreviewOpen
						? "scale-100 opacity-100 delay-100"
						: "pointer-events-none scale-95 opacity-0 delay-0",
				)}
			>
				{/* Dialog Header */}
				<div className="flex flex-col gap-1 border-b border-border p-3">
					<div className="font-heading text-sm font-bold">Import Preview</div>
					<div className="text-[10px] text-muted-foreground">Review items before importing.</div>
				</div>

				{/* Dialog Content */}
				<div className="flex flex-1 flex-col gap-3 overflow-hidden bg-muted/10 p-3">
					{/* Stats */}
					<div className="flex gap-4">
						<div className="flex flex-col">
							<div className="text-sm font-bold">47</div>
							<div className="text-[8px] font-medium tracking-wider text-muted-foreground uppercase">
								To Import
							</div>
						</div>
						<div className="flex flex-col">
							<div className="text-sm font-bold text-muted-foreground">0</div>
							<div className="text-[8px] font-medium tracking-wider text-muted-foreground uppercase">
								Duplicates
							</div>
						</div>
					</div>

					{/* Items List */}
					<div className="flex flex-col gap-1.5">
						{MOCK_PREVIEW_ITEMS.map((item, i) => (
							<div
								key={i}
								className="flex items-center gap-2 rounded-xl border border-border bg-card p-1.5 shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-2xl"
							>
								{item.icon}
								<div className="flex flex-col gap-1">
									<div className={cn("h-1.5 rounded bg-foreground/15", item.titleWidth)} />
									<div className={cn("h-1 rounded bg-foreground/5", item.subWidth)} />
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Dialog Footer */}
				<div className="flex items-center justify-end gap-2 border-t border-border bg-muted/20 p-2">
					<div className="rounded-md bg-transparent px-3 py-1.5 text-[9px] font-medium text-muted-foreground">
						Cancel
					</div>
					<div
						className={cn(
							"rounded-md px-3 py-1.5 text-[9px] font-medium shadow-sm transition-colors duration-300",
							step === 6
								? "bg-primary/80 text-primary-foreground"
								: "bg-primary text-primary-foreground",
						)}
					>
						Import 47 entries
					</div>
				</div>
			</div>

			{/* Fake Cursor */}
			<div
				className={cn(
					"absolute z-30 h-5 w-5 drop-shadow-md transition-all ease-[cubic-bezier(0.2,0.8,0.2,1)]",
					cursorPosition,
					prefersReducedMotion ? "delay-0 duration-0" : "duration-700",
				)}
			>
				<MousePointer2Icon
					className="h-full w-full text-foreground"
					style={{ fill: "currentColor" }}
				/>
				<div
					key={step} // Force re-mount of ping animation when step changes
					className={cn(
						"absolute top-0 left-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40",
						showPing ? "animate-ping opacity-100" : "opacity-0",
					)}
					style={
						showPing
							? {
									animationIterationCount: 1,
									animationFillMode: "forwards",
									animationDuration: "500ms",
								}
							: {}
					}
				/>
			</div>

			{/* Bottom Centered Success Toast */}
			<div
				className={cn(
					"absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
					!prefersReducedMotion && step === 7
						? "translate-y-0 scale-100 opacity-100 delay-300"
						: "translate-y-4 scale-95 opacity-0",
				)}
			>
				<div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-green-600 shadow-lg dark:border dark:border-border">
					<CheckCircle2Icon className="h-3.5 w-3.5" />
					<span className="whitespace-nowrap">Successfully imported 47 entries</span>
				</div>
			</div>
		</div>
	);
}
