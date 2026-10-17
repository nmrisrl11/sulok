import { NoteIcon } from "@/components/icons";
import { SiteFavicon } from "@/components/site-favicon";
import { Checkbox } from "@/components/ui/checkbox";
import type { ParsedImportItem } from "@/features/settings/utils/import-utils";
import { cn } from "@/lib/utils";
import { memo } from "react";

export interface ImportPreviewItemRowProps {
	item: ParsedImportItem;
	depth: number;
	isSelected: boolean;
	onToggle: (id: string) => void;
}

export const ImportPreviewItemRow = memo(function ImportPreviewItemRow({
	item,
	depth,
	isSelected,
	onToggle,
}: ImportPreviewItemRowProps) {
	const depthPadding = depth * 24;
	const isDuplicate = item.isDuplicate;

	let hostname = item.url;
	try {
		hostname = new URL(item.url).hostname;
	} catch {
		// fallback
	}

	const handleCheckboxChange = () => {
		if (isDuplicate || !item.id) return;
		onToggle(item.id);
	};

	const handleRowClick = () => {
		if (isDuplicate || !item.id) return;
		onToggle(item.id);
	};

	return (
		<div style={{ paddingLeft: `${depthPadding}px` }} className="h-full">
			<div
				onClick={!isDuplicate ? handleRowClick : undefined}
				className={cn(
					"flex items-center justify-between gap-3 rounded-md border p-2 transition-colors corner-squircle supports-[corner-shape:squircle]:rounded-xl",
					isDuplicate
						? "border-transparent bg-muted/30 opacity-50 grayscale"
						: "cursor-pointer bg-card hover:bg-card/80",
				)}
			>
				<div className="flex min-w-0 flex-1 items-center gap-2.5">
					{!isDuplicate && (
						<div
							className="flex h-5 w-5 shrink-0 items-center justify-center"
							onClick={(e) => e.stopPropagation()}
						>
							<Checkbox
								checked={isSelected}
								onCheckedChange={handleCheckboxChange}
								aria-label={`Select ${item.title || hostname}`}
							/>
						</div>
					)}
					<SiteFavicon
						url={item.url}
						logo={item.logo}
						className="h-5 w-5 shrink-0"
						size={64}
						bypassCache={true}
					/>
					<div className="min-w-0 flex-1">
						<p className="truncate text-sm font-medium">{item.title || hostname}</p>
						<div className="mt-0.5 flex items-center gap-1.5 truncate">
							<span className="truncate font-mono text-[11px] text-muted-foreground">
								{item.url}
							</span>
							{!!item.note && (
								<div
									className="flex shrink-0 items-center gap-1 rounded-sm border border-border/50 bg-secondary/80 px-1.5 py-0.5 text-secondary-foreground corner-squircle supports-[corner-shape:squircle]:rounded-full"
									title="Contains a note"
								>
									<NoteIcon className="size-2.5" />
									<span className="text-[9px] leading-none font-medium tracking-widest uppercase opacity-80">
										Note
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
				{isDuplicate && (
					<span
						className={cn(
							"shrink-0 rounded-sm border px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase",
							item.inTrash
								? "border-destructive/30 bg-destructive/10 text-destructive"
								: "border-border/60 bg-background/50 text-muted-foreground",
						)}
					>
						{item.inTrash ? "In Trash" : "Exists"}
					</span>
				)}
			</div>
		</div>
	);
});
