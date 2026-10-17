import type { ParsedInvalidEntry } from "@/features/settings/utils/import-utils";
import { AlertCircleIcon } from "lucide-react";
import { memo } from "react";

export interface ImportPreviewInvalidRowProps {
	entry: ParsedInvalidEntry;
	depth: number;
}

export const ImportPreviewInvalidRow = memo(function ImportPreviewInvalidRow({
	entry,
	depth,
}: ImportPreviewInvalidRowProps) {
	const depthPadding = depth * 24;

	return (
		<div style={{ paddingLeft: `${depthPadding}px` }} className="h-full">
			<div className="flex items-center justify-between gap-3 rounded-md border border-destructive/25 bg-destructive/5 p-2 transition-colors corner-squircle supports-[corner-shape:squircle]:rounded-xl">
				<div className="flex min-w-0 flex-1 items-center gap-2.5">
					<div className="flex h-5 w-5 shrink-0 items-center justify-center text-destructive">
						<AlertCircleIcon className="h-4 w-4" />
					</div>
					<div className="min-w-0 flex-1">
						<p className="truncate text-sm font-medium text-foreground">
							{entry.title ||
								entry.name ||
								(entry.type === "folder" ? "Unnamed Folder" : "Untitled item")}
						</p>
						<p
							className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground"
							title={entry.url || undefined}
						>
							{entry.type === "folder" ? "Folder" : entry.url || "No URL provided"}
						</p>
						<p className="mt-0.5 truncate font-mono text-[11px] font-semibold text-destructive">
							{entry.reason}
						</p>
					</div>
				</div>
				<span className="shrink-0 rounded-sm border border-destructive/30 bg-destructive/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-destructive uppercase">
					Invalid
				</span>
			</div>
		</div>
	);
});
