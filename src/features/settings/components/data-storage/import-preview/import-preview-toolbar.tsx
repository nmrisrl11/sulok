import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { AlertCircleIcon, InfoIcon } from "lucide-react";
import { memo } from "react";
import type { ImportFilterStatus } from "./types";

interface ImportPreviewToolbarProps {
	activeFilter: ImportFilterStatus;
	setActiveFilter: (filter: ImportFilterStatus) => void;
	isAllSelected: boolean;
	isSomeSelected: boolean;
	totalSelectable: number;
	totalToImport: number;
	activeDuplicateCount: number;
	trashCount: number;
	invalidCount: number;
	onToggleSelectAll: () => void;
}

export const ImportPreviewToolbar = memo(function ImportPreviewToolbar({
	activeFilter,
	setActiveFilter,
	isAllSelected,
	isSomeSelected,
	totalSelectable,
	totalToImport,
	activeDuplicateCount,
	trashCount,
	invalidCount,
	onToggleSelectAll,
}: ImportPreviewToolbarProps) {
	return (
		<div className="flex items-center justify-between border-b bg-muted/20 px-6 py-2.5 text-xs text-muted-foreground">
			{activeFilter === "all" || activeFilter === "to-import" ? (
				<>
					<div className="flex items-center gap-2.5">
						<Checkbox
							id="import-select-all"
							checked={isAllSelected ? true : isSomeSelected ? "indeterminate" : false}
							disabled={totalSelectable === 0}
							onCheckedChange={onToggleSelectAll}
							aria-label="Select all entries"
						/>
						<label
							htmlFor="import-select-all"
							className={cn(
								"font-medium select-none",
								totalSelectable > 0 ? "cursor-pointer text-foreground" : "text-muted-foreground",
							)}
						>
							Select all
						</label>
						{activeFilter === "to-import" && (
							<span className="ml-1.5 inline-flex items-center gap-1 rounded-sm border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
								Filtered: To Import
								<button
									type="button"
									onClick={() => setActiveFilter("all")}
									className="cursor-pointer hover:opacity-75"
									aria-label="Clear filter"
								>
									×
								</button>
							</span>
						)}
					</div>
					<div className="font-mono text-[11px]">
						<span className="font-semibold text-foreground">{totalToImport}</span>
						<span className="text-muted-foreground"> of {totalSelectable} selected</span>
					</div>
				</>
			) : (
				<>
					<div
						className={cn(
							"flex items-center gap-2 font-medium",
							activeFilter === "duplicates" ? "text-foreground" : "text-destructive",
						)}
					>
						{activeFilter === "invalid" ? (
							<AlertCircleIcon className="size-3.5 shrink-0" />
						) : (
							<InfoIcon
								className={cn(
									"size-3.5 shrink-0",
									activeFilter === "duplicates" && "text-muted-foreground",
								)}
							/>
						)}
						<span>
							{activeFilter === "duplicates"
								? `Showing ${activeDuplicateCount} duplicate ${activeDuplicateCount === 1 ? "entry" : "entries"} (already in library)`
								: activeFilter === "trash"
									? `Showing ${trashCount} ${trashCount === 1 ? "entry" : "entries"} in Recycle Bin (will be skipped)`
									: `Showing ${invalidCount} invalid ${invalidCount === 1 ? "entry" : "entries"} (will be skipped)`}
						</span>
					</div>
					<button
						type="button"
						onClick={() => setActiveFilter("all")}
						className="cursor-pointer text-[11px] font-medium text-primary hover:underline"
					>
						Show all
					</button>
				</>
			)}
		</div>
	);
});
