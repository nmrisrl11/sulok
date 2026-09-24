import { FolderIcon } from "@/components/icons";
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
import { FolderRepository } from "@/db/repositories/folder-repository";
import { ItemRepository } from "@/db/repositories/item-repository";
import type {
	ParsedImportData,
	ParsedImportFolder,
	ParsedImportItem,
} from "@/features/settings/utils/import-utils";
import { notify } from "@/lib/notify";
import { useVirtualizer } from "@tanstack/react-virtual";
import { AlertCircleIcon, InfoIcon } from "lucide-react";
import { memo, useDeferredValue, useMemo, useState } from "react";

interface ImportPreviewDialogProps {
	isOpen: boolean;
	onClose: (success?: boolean) => void;
	data: ParsedImportData;
}

type TreeNode =
	| {
			type: "folder";
			id: string;
			depth: number;
			data: ParsedImportFolder;
	  }
	| {
			type: "item";
			id: string;
			depth: number;
			data: ParsedImportItem;
	  };

const ImportPreviewTree = memo(function ImportPreviewTree({
	flattenedNodes,
}: {
	flattenedNodes: TreeNode[];
}) {
	const [parentEl, setParentEl] = useState<HTMLDivElement | null>(null);

	// eslint-disable-next-line react/incompatible-library
	const rowVirtualizer = useVirtualizer({
		count: flattenedNodes.length,
		getScrollElement: () => parentEl,
		estimateSize: () => 52,
		overscan: 5,
	});

	const virtualItems = rowVirtualizer.getVirtualItems();
	const deferredVirtualItems = useDeferredValue(virtualItems);

	return (
		<div ref={setParentEl} className="custom-scrollbar flex-1 overflow-y-auto p-4">
			<div className="relative w-full" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
				{deferredVirtualItems.map((virtualRow) => {
					const node = flattenedNodes[virtualRow.index];
					if (!node) return null;

					const depthPadding = node.depth * 24;

					if (node.type === "folder") {
						const folder = node.data;
						return (
							<div
								key={virtualRow.key}
								data-index={virtualRow.index}
								ref={rowVirtualizer.measureElement}
								className="absolute top-0 left-0 w-full pb-1"
								style={{
									transform: `translate3d(0, ${virtualRow.start}px, 0)`,
									willChange: "transform",
								}}
							>
								<div style={{ paddingLeft: `${depthPadding}px` }} className="h-full">
									<div
										className={`flex items-center justify-between gap-3 rounded-md border p-2 transition-colors corner-squircle supports-[corner-shape:squircle]:rounded-xl ${folder.isDuplicate ? "border-transparent bg-muted/30 opacity-50 grayscale" : "bg-card hover:bg-card/80"}`}
									>
										<div className="flex min-w-0 flex-1 items-center gap-3">
											<div className="flex h-5 w-5 shrink-0 items-center justify-center">
												<FolderIcon className="h-4 w-4 text-muted-foreground" />
											</div>
											<div className="min-w-0 flex-1">
												<p className="truncate text-sm font-medium">{folder.name}</p>
												<p className="truncate font-mono text-[11px] text-muted-foreground">
													Folder
												</p>
											</div>
										</div>
										{folder.isDuplicate && (
											<span className="shrink-0 rounded-sm border bg-background/50 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
												Exists
											</span>
										)}
									</div>
								</div>
							</div>
						);
					} else {
						const item = node.data;
						let hostname = item.url;
						try {
							hostname = new URL(item.url).hostname;
						} catch {
							// fallback
						}

						return (
							<div
								key={virtualRow.key}
								data-index={virtualRow.index}
								ref={rowVirtualizer.measureElement}
								className="absolute top-0 left-0 w-full pb-1"
								style={{
									transform: `translate3d(0, ${virtualRow.start}px, 0)`,
									willChange: "transform",
								}}
							>
								<div style={{ paddingLeft: `${depthPadding}px` }} className="h-full">
									<div
										className={`flex items-center justify-between gap-3 rounded-md border p-2 transition-colors corner-squircle supports-[corner-shape:squircle]:rounded-xl ${item.isDuplicate ? "border-transparent bg-muted/30 opacity-50 grayscale" : "bg-card hover:bg-card/80"}`}
									>
										<div className="flex min-w-0 flex-1 items-center gap-3">
											<SiteFavicon
												url={item.url}
												logo={item.logo}
												className="h-5 w-5 shrink-0"
												size={64}
											/>
											<div className="min-w-0 flex-1">
												<p className="truncate text-sm font-medium">{item.title || hostname}</p>
												<p className="truncate font-mono text-[11px] text-muted-foreground">
													{item.url}
												</p>
											</div>
										</div>
										{item.isDuplicate && (
											<span className="shrink-0 rounded-sm border bg-background/50 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
												Exists
											</span>
										)}
									</div>
								</div>
							</div>
						);
					}
				})}
			</div>
		</div>
	);
});

export function ImportPreviewDialog({ isOpen, onClose, data }: ImportPreviewDialogProps) {
	const [isImporting, setIsImporting] = useState(false);

	const itemsToImport = data.validItems.filter((item) => !item.isDuplicate);
	const foldersToImport = data.validFolders?.filter((folder) => !folder.isDuplicate) || [];
	const totalToImport = itemsToImport.length + foldersToImport.length;

	const flattenedNodes = useMemo(() => {
		const nodes: TreeNode[] = [];
		const foldersByParent = new Map<string, typeof data.validFolders>();
		const itemsByFolder = new Map<string | null, typeof data.validItems>();
		const importedFolderIds = new Set(data.validFolders?.map((f) => f.id) || []);

		for (const folder of data.validFolders || []) {
			const pId =
				folder.parentId && importedFolderIds.has(folder.parentId) ? folder.parentId : "root";
			if (!foldersByParent.has(pId)) foldersByParent.set(pId, []);
			foldersByParent.get(pId)!.push(folder);
		}

		for (const item of data.validItems) {
			const folderId = item.folderId && importedFolderIds.has(item.folderId) ? item.folderId : null;
			if (!itemsByFolder.has(folderId)) itemsByFolder.set(folderId, []);
			itemsByFolder.get(folderId)!.push(item);
		}

		let counter = 0;
		function traverse(parentId: string | null, depth: number) {
			const folders = foldersByParent.get(parentId || "root") || [];
			for (const f of folders) {
				nodes.push({ type: "folder", id: f.id || `temp-f-${counter++}`, depth, data: f });
				traverse(f.id || null, depth + 1);
			}

			const items = itemsByFolder.get(parentId) || [];
			for (const item of items) {
				nodes.push({ type: "item", id: item.id || `temp-i-${counter++}`, depth, data: item });
			}
		}

		traverse(null, 0);
		return nodes;
	}, [data.validFolders, data.validItems]);

	const handleConfirm = async () => {
		if (totalToImport === 0) {
			onClose();
			return;
		}

		setIsImporting(true);
		try {
			// Import folders sequentially to maintain ID mapping
			const idMap = new Map<string, string>();
			const folderResults: PromiseSettledResult<string>[] = [];

			for (const folder of foldersToImport) {
				try {
					const { isDuplicate: _isDuplicate, parentId, ...folderData } = folder;
					const resolvedParentId =
						parentId && idMap.has(parentId) ? (idMap.get(parentId) ?? null) : null;
					const newId = await FolderRepository.importFolder({
						...folderData,
						parentId: resolvedParentId,
					});
					if (folder.id) {
						idMap.set(folder.id, newId);
					}
					folderResults.push({ status: "fulfilled", value: newId });
				} catch (error) {
					folderResults.push({ status: "rejected", reason: error });
				}
			}

			const itemPromises = itemsToImport.map((item) => {
				const { isDuplicate: _isDuplicate, folderId, ...itemData } = item;
				const resolvedFolderId =
					folderId && idMap.has(folderId) ? (idMap.get(folderId) ?? undefined) : undefined;
				return ItemRepository.importItem({ ...itemData, folderId: resolvedFolderId });
			});
			const itemResults = await Promise.allSettled(itemPromises);

			const allResults = [...folderResults, ...itemResults];
			const successCount = allResults.filter((r) => r.status === "fulfilled").length;
			const failCount = allResults.length - successCount;

			if (failCount === 0) {
				notify.success(`Successfully imported ${successCount} entries`);
				onClose(true);
			} else if (successCount > 0) {
				notify.warning(`Imported ${successCount} entries, but ${failCount} failed.`);
				onClose(true);
			} else {
				notify.error(`Failed to import all ${failCount} entries.`);
			}
		} catch {
			notify.error("An error occurred during import.");
		} finally {
			setIsImporting(false);
		}
	};

	const totalInFile = (data.validFolders?.length || 0) + data.validItems.length + data.invalidCount;

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && !isImporting && onClose()}>
			<DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-xl">
				<div className="border-b p-6 pb-4">
					<DialogHeader>
						<DialogTitle className="font-heading text-xl">Import Preview</DialogTitle>
						<DialogDescription>
							We found {totalInFile} items in the file. Review them before importing.
						</DialogDescription>
					</DialogHeader>

					<div className="mt-6 flex items-center gap-6">
						<div className="flex flex-col">
							<span className="font-mono text-xl font-semibold text-foreground">
								{totalToImport}
							</span>
							<span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
								To Import
							</span>
						</div>
						<div className="flex flex-col">
							<span className="font-mono text-xl font-medium text-muted-foreground">
								{data.duplicateCount}
							</span>
							<span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
								Duplicates
							</span>
						</div>
						<div className="flex flex-col">
							<span className="font-mono text-xl font-medium text-muted-foreground">
								{data.invalidCount}
							</span>
							<span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
								Invalid
							</span>
						</div>
					</div>

					{(data.duplicateCount > 0 || data.invalidCount > 0) && (
						<div className="mt-4 space-y-1.5 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
							{data.duplicateCount > 0 && (
								<p className="flex items-center gap-1.5">
									<InfoIcon className="h-4 w-4 shrink-0" />
									{data.duplicateCount} {data.duplicateCount === 1 ? "entry" : "entries"} already
									exist in your library and will be skipped.
								</p>
							)}
							{data.invalidCount > 0 && (
								<p className="flex items-center gap-1.5">
									<AlertCircleIcon className="h-4 w-4 shrink-0" />
									{data.invalidCount} {data.invalidCount === 1 ? "entry has" : "entries have"}{" "}
									missing or invalid data and will be skipped.
								</p>
							)}
						</div>
					)}
				</div>

				<ImportPreviewTree flattenedNodes={flattenedNodes} />

				<DialogFooter className="m-0 border-t p-4">
					<Button variant="ghost" onClick={() => onClose()} disabled={isImporting}>
						Cancel
					</Button>
					<Button onClick={handleConfirm} disabled={isImporting || totalToImport === 0}>
						{isImporting ? "Importing..." : `Import ${totalToImport} entries`}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
