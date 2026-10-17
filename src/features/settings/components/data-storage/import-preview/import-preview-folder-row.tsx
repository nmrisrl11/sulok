import { FolderIcon } from "@/components/icons";
import { Checkbox } from "@/components/ui/checkbox";
import type { ParsedImportFolder } from "@/features/settings/utils/import-utils";
import { cn } from "@/lib/utils";
import { memo } from "react";

export interface ImportPreviewFolderRowProps {
	folder: ParsedImportFolder;
	depth: number;
	checkState: "checked" | "unchecked" | "indeterminate";
	hasSelectableContent: boolean;
	itemCount: number;
	onToggle: (id: string) => void;
}

export const ImportPreviewFolderRow = memo(function ImportPreviewFolderRow({
	folder,
	depth,
	checkState,
	hasSelectableContent,
	itemCount,
	onToggle,
}: ImportPreviewFolderRowProps) {
	const depthPadding = depth * 24;
	const isDuplicate = folder.isDuplicate;
	const isDisabled = !hasSelectableContent && isDuplicate;

	const handleCheckboxChange = () => {
		if (isDisabled || !folder.id) return;
		onToggle(folder.id);
	};

	const handleRowClick = () => {
		if (isDisabled || !folder.id) return;
		onToggle(folder.id);
	};

	return (
		<div style={{ paddingLeft: `${depthPadding}px` }} className="h-full">
			<div
				onClick={!isDisabled ? handleRowClick : undefined}
				className={cn(
					"flex items-center justify-between gap-3 rounded-md border p-2 transition-colors corner-squircle supports-[corner-shape:squircle]:rounded-xl",
					isDuplicate
						? "border-transparent bg-muted/30 opacity-50 grayscale"
						: "cursor-pointer bg-card hover:bg-card/80",
				)}
			>
				<div className="flex min-w-0 flex-1 items-center gap-2.5">
					{hasSelectableContent && (
						<div
							className="flex h-5 w-5 shrink-0 items-center justify-center"
							onClick={(e) => e.stopPropagation()}
						>
							<Checkbox
								checked={
									checkState === "checked"
										? true
										: checkState === "indeterminate"
											? "indeterminate"
											: false
								}
								onCheckedChange={handleCheckboxChange}
								aria-label={`Select folder ${folder.name}`}
								disabled={isDisabled}
							/>
						</div>
					)}
					<div className="flex h-5 w-5 shrink-0 items-center justify-center">
						<FolderIcon className="h-4 w-4 text-muted-foreground" />
					</div>
					<div className="min-w-0 flex-1">
						<p className="truncate text-sm font-medium">{folder.name}</p>
						<p className="truncate font-mono text-[11px] text-muted-foreground">
							{itemCount > 0 ? `${itemCount} ${itemCount === 1 ? "item" : "items"}` : "Folder"}
						</p>
					</div>
				</div>
				{isDuplicate && (
					<span
						className={cn(
							"shrink-0 rounded-sm border px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase",
							folder.inTrash
								? "border-destructive/30 bg-destructive/10 text-destructive"
								: "border-border/60 bg-background/50 text-muted-foreground",
						)}
					>
						{folder.inTrash ? "In Trash" : "Exists"}
					</span>
				)}
			</div>
		</div>
	);
});
