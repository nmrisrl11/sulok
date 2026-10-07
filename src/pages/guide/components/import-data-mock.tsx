import { cn } from "@/lib/utils";
import {
	FileCodeIcon,
	FileJsonIcon,
	FileSpreadsheetIcon,
	FileTextIcon,
	UploadCloudIcon,
	UploadIcon,
} from "lucide-react";

export function ImportDataMock() {
	return (
		<div className="group relative flex h-60 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-muted/20 shadow-inner select-none corner-squircle supports-[corner-shape:squircle]:rounded-3xl supports-[corner-shape:squircle]:corner-squircle sm:w-85">
			{/* Accurate UI */}
			<div className="relative z-10 flex w-full flex-col gap-4 p-5 sm:p-6">
				{/* Buttons section */}
				<div className="flex flex-col gap-3">
					<div
						className={cn(
							"flex w-full items-center justify-start gap-3 p-3 text-left transition-all duration-300 sm:gap-4 sm:p-4",
							"rounded-xl border border-border/50 bg-background shadow-sm hover:border-border hover:bg-muted/50",
							"corner-squircle supports-[corner-shape:squircle]:rounded-3xl",
						)}
					>
						<div className="rounded-lg border border-border/50 bg-card p-2 text-muted-foreground shadow-sm transition-all duration-500 corner-squircle group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:text-primary supports-[corner-shape:squircle]:rounded-xl">
							<UploadCloudIcon className="h-4 w-4 sm:h-5 sm:w-5" />
						</div>
						<div>
							<h3 className="text-sm font-medium text-foreground">Sync Browser Bookmarks</h3>
							<p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
								Instantly import your browser's bookmarks
							</p>
						</div>
					</div>

					<div
						className={cn(
							"relative flex w-full items-center justify-start gap-3 p-3 text-left transition-all duration-300 sm:gap-4 sm:p-4",
							"rounded-xl border border-border/50 bg-background shadow-sm hover:border-border hover:bg-muted/50",
							"corner-squircle supports-[corner-shape:squircle]:rounded-3xl",
						)}
					>
						<div className="relative z-10 rounded-lg border border-border/50 bg-card p-2 text-muted-foreground shadow-sm transition-all duration-500 corner-squircle group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:text-primary supports-[corner-shape:squircle]:rounded-xl">
							<UploadIcon className="h-4 w-4 sm:h-5 sm:w-5" />
						</div>
						<div className="z-10">
							<h3 className="text-sm font-medium text-foreground">Upload backup file</h3>
							<p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
								Supports .json, .csv, .txt, and .html files
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Floating Files Animation (they fly into the second button's icon) */}
			{/* Target is around top-40, left-10 */}

			{/* HTML */}
			<div className="absolute top-2 left-4 z-20 flex h-8 w-8 -rotate-12 items-center justify-center rounded-lg border border-border bg-card shadow-lg transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] corner-squircle group-hover:top-34 group-hover:left-8.5 group-hover:scale-50 group-hover:rotate-0 group-hover:opacity-0 supports-[corner-shape:squircle]:rounded-lg">
				<FileCodeIcon className="h-4 w-4 text-orange-500" />
			</div>

			{/* CSV */}
			<div className="absolute bottom-2 left-4 z-20 flex h-8 w-8 rotate-6 items-center justify-center rounded-lg border border-border bg-card shadow-lg transition-all delay-75 duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] corner-squircle group-hover:top-34 group-hover:left-8.5 group-hover:scale-50 group-hover:rotate-0 group-hover:opacity-0 supports-[corner-shape:squircle]:rounded-lg">
				<FileSpreadsheetIcon className="h-4 w-4 text-green-500" />
			</div>

			{/* JSON */}
			<div className="absolute top-8 right-4 z-20 flex h-8 w-8 rotate-12 items-center justify-center rounded-lg border border-border bg-card shadow-lg transition-all delay-150 duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] corner-squircle group-hover:top-34 group-hover:left-8.5 group-hover:scale-50 group-hover:rotate-0 group-hover:opacity-0 supports-[corner-shape:squircle]:rounded-lg">
				<FileJsonIcon className="h-4 w-4 text-yellow-500" />
			</div>

			{/* TXT */}
			<div className="absolute right-6 bottom-8 z-20 flex h-8 w-8 -rotate-6 items-center justify-center rounded-lg border border-border bg-card shadow-lg transition-all delay-200 duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] corner-squircle group-hover:top-34 group-hover:left-8.5 group-hover:scale-50 group-hover:rotate-0 group-hover:opacity-0 supports-[corner-shape:squircle]:rounded-lg">
				<FileTextIcon className="h-4 w-4 text-blue-500" />
			</div>
		</div>
	);
}
