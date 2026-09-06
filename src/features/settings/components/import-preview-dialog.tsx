import { SiteFavicon } from "@/components/site-favicon";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ItemRepository } from "@/db/repositories/item-repository";
import { notify } from "@/lib/notify";
import { AlertCircleIcon, InfoIcon } from "lucide-react";
import { useState } from "react";
import type { ParsedImportData } from "../utils/import-utils";

interface ImportPreviewDialogProps {
	isOpen: boolean;
	onClose: (success?: boolean) => void;
	data: ParsedImportData;
}

export function ImportPreviewDialog({ isOpen, onClose, data }: ImportPreviewDialogProps) {
	const [isImporting, setIsImporting] = useState(false);

	const itemsToImport = data.validItems.filter((item) => !item.isDuplicate);

	const handleConfirm = async () => {
		if (itemsToImport.length === 0) {
			onClose();
			return;
		}

		setIsImporting(true);
		try {
			const importPromises = itemsToImport.map((item) =>
				ItemRepository.save({
					url: item.url,
					title: item.title,
					description: item.description,
				}),
			);
			const results = await Promise.allSettled(importPromises);

			const successCount = results.filter((r) => r.status === "fulfilled").length;
			const failCount = results.length - successCount;

			if (failCount === 0) {
				notify.success(`Successfully imported ${successCount} items`);
				onClose(true);
			} else if (successCount > 0) {
				notify.warning(`Imported ${successCount} items, but ${failCount} failed.`);
				onClose(true);
			} else {
				notify.error(`Failed to import all ${failCount} items.`);
			}
		} catch {
			notify.error("An error occurred during import.");
		} finally {
			setIsImporting(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && !isImporting && onClose()}>
			<DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col gap-0 p-0">
				<div className="p-6 pb-4 border-b">
					<DialogHeader>
						<DialogTitle className="font-heading text-xl">Import Preview</DialogTitle>
						<DialogDescription>
							We found {data.validItems.length + data.invalidCount} items in the file. Review them
							before importing.
						</DialogDescription>
					</DialogHeader>

					<div className="flex items-center gap-6 mt-6">
						<div className="flex flex-col">
							<span className="font-mono text-xl font-semibold text-foreground">
								{itemsToImport.length}
							</span>
							<span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
								To Import
							</span>
						</div>
						<div className="flex flex-col">
							<span className="font-mono text-xl font-medium text-muted-foreground">
								{data.duplicateCount}
							</span>
							<span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
								Duplicates
							</span>
						</div>
						<div className="flex flex-col">
							<span className="font-mono text-xl font-medium text-muted-foreground">
								{data.invalidCount}
							</span>
							<span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
								Invalid
							</span>
						</div>
					</div>
				</div>

				<div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-4">
					{(data.duplicateCount > 0 || data.invalidCount > 0) && (
						<div className="text-xs text-muted-foreground space-y-1.5 pb-2">
							{data.duplicateCount > 0 && (
								<p className="flex items-center gap-1.5">
									<InfoIcon className="w-4 h-4" />
									{data.duplicateCount} {data.duplicateCount === 1 ? "item" : "items"} already exist
									in your library and will be skipped.
								</p>
							)}
							{data.invalidCount > 0 && (
								<p className="flex items-center gap-1.5">
									<AlertCircleIcon className="w-4 h-4" />
									{data.invalidCount} {data.invalidCount === 1 ? "item has" : "items have"} missing
									or invalid URLs and will be skipped.
								</p>
							)}
						</div>
					)}

					<div className="space-y-1">
						{data.validItems.slice(0, 100).map((item, index) => {
							let hostname = item.url;
							try {
								hostname = new URL(item.url).hostname;
							} catch {
								// fallback
							}

							return (
								<div
									key={index}
									className={`flex items-center justify-between gap-3 p-2 rounded-md supports-[corner-shape:squircle]:rounded-xl corner-squircle transition-colors border ${item.isDuplicate ? "opacity-50 grayscale bg-muted/30 border-transparent" : "bg-card hover:bg-card/80"}`}
								>
									<div className="flex items-center gap-3 min-w-0 flex-1">
										<SiteFavicon url={item.url} className="w-5 h-5 shrink-0" size={64} />
										<div className="flex-1 min-w-0">
											<p className="truncate text-sm font-medium">{item.title || hostname}</p>
											<p className="truncate text-[11px] text-muted-foreground font-mono">
												{item.url}
											</p>
										</div>
									</div>
									{item.isDuplicate && (
										<span className="shrink-0 text-[10px] font-bold tracking-wider uppercase text-muted-foreground bg-background/50 border px-1.5 py-0.5 rounded-sm">
											Exists
										</span>
									)}
								</div>
							);
						})}
						{data.validItems.length > 100 && (
							<div className="text-center text-xs text-muted-foreground italic py-4">
								+ {data.validItems.length - 100} more items
							</div>
						)}
					</div>
				</div>

				<DialogFooter className="p-4 border-t m-0">
					<Button variant="ghost" onClick={() => onClose()} disabled={isImporting}>
						Cancel
					</Button>
					<Button onClick={handleConfirm} disabled={isImporting || itemsToImport.length === 0}>
						{isImporting ? "Importing..." : `Import ${itemsToImport.length} items`}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
