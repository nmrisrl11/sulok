import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircleIcon, InfoIcon } from "lucide-react";
import { useCallback, useState } from "react";
import {
	executeImport,
	ImportPreviewStatCard,
	ImportPreviewToolbar,
	ImportPreviewTree,
	useImportFilter,
	useImportSelection,
	useImportTree,
	type ImportFilterStatus,
	type ImportPreviewDialogProps,
} from "./import-preview";

export function ImportPreviewDialog({
	isOpen,
	onClose,
	data,
	onImportingChange,
}: ImportPreviewDialogProps) {
	const [isImporting, setIsImporting] = useState(false);

	const treeData = useImportTree(data);

	const {
		selectedItemIds,
		itemsToImport,
		foldersToImport,
		totalToImport,
		totalSelectable,
		isAllSelected,
		isSomeSelected,
		getFolderCheckState,
		handleToggleItem,
		handleToggleFolder,
		handleToggleSelectAll,
	} = useImportSelection(treeData, data);

	const {
		activeFilter,
		setActiveFilter,
		filteredNodes,
		activeDuplicateCount,
		trashCount,
		invalidCount,
	} = useImportFilter(treeData, data, selectedItemIds, foldersToImport);

	const handleFilterToggle = useCallback(
		(filter: ImportFilterStatus) => {
			setActiveFilter((prev) => (prev === filter ? "all" : filter));
		},
		[setActiveFilter],
	);

	const handleConfirm = async () => {
		if (totalToImport === 0) {
			onClose();
			return;
		}

		setIsImporting(true);
		onImportingChange?.(true);
		try {
			await executeImport({
				foldersToImport,
				itemsToImport,
				onSuccess: () => onClose(true),
			});
		} finally {
			setIsImporting(false);
			onImportingChange?.(false);
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

					<div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
						<ImportPreviewStatCard
							filter="to-import"
							activeFilter={activeFilter}
							count={totalToImport}
							label="To Import"
							onClick={() => handleFilterToggle("to-import")}
							variant="primary"
						/>

						<ImportPreviewStatCard
							filter="duplicates"
							activeFilter={activeFilter}
							count={activeDuplicateCount}
							label="Duplicates"
							onClick={() => handleFilterToggle("duplicates")}
							variant="primary"
						/>

						{trashCount > 0 && (
							<ImportPreviewStatCard
								filter="trash"
								activeFilter={activeFilter}
								count={trashCount}
								label="In Trash"
								onClick={() => handleFilterToggle("trash")}
								variant="destructive"
							/>
						)}

						<ImportPreviewStatCard
							filter="invalid"
							activeFilter={activeFilter}
							count={invalidCount}
							label="Invalid"
							onClick={() => handleFilterToggle("invalid")}
							variant="destructive"
						/>
					</div>

					{(data.duplicateCount > 0 || data.invalidCount > 0) && (
						<div className="mt-4 space-y-1.5 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
							{data.duplicateCount > 0 && (
								<p className="flex items-center gap-1.5">
									<InfoIcon className="h-4 w-4 shrink-0" />
									{data.trashCount === data.duplicateCount
										? `${data.duplicateCount} ${data.duplicateCount === 1 ? "entry is" : "entries are"} in your Recycle Bin and will be skipped.`
										: data.trashCount && data.trashCount > 0
											? `${data.duplicateCount} ${data.duplicateCount === 1 ? "entry already exists" : "entries already exist"} (${data.trashCount} in Recycle Bin) and will be skipped.`
											: `${data.duplicateCount} ${data.duplicateCount === 1 ? "entry already exists" : "entries already exist"} in your library and will be skipped.`}
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

				<ImportPreviewToolbar
					activeFilter={activeFilter}
					setActiveFilter={setActiveFilter}
					isAllSelected={isAllSelected}
					isSomeSelected={isSomeSelected}
					totalSelectable={totalSelectable}
					totalToImport={totalToImport}
					activeDuplicateCount={activeDuplicateCount}
					trashCount={trashCount}
					invalidCount={invalidCount}
					onToggleSelectAll={handleToggleSelectAll}
				/>

				<ImportPreviewTree
					flattenedNodes={filteredNodes}
					selectedItemIds={selectedItemIds}
					getFolderCheckState={getFolderCheckState}
					treeData={treeData}
					onToggleItem={handleToggleItem}
					onToggleFolder={handleToggleFolder}
					onResetFilter={() => setActiveFilter("all")}
				/>

				<DialogFooter className="m-0 border-t p-4">
					<Button variant="ghost" onClick={() => onClose()} disabled={isImporting}>
						Cancel
					</Button>
					<Button onClick={handleConfirm} disabled={isImporting || totalToImport === 0}>
						{isImporting
							? "Importing..."
							: `Import ${totalToImport} ${totalToImport === 1 ? "entry" : "entries"}`}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
