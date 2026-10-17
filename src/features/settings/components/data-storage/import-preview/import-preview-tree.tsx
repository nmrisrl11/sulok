import { useVirtualizer } from "@tanstack/react-virtual";
import { memo, useDeferredValue, useState } from "react";
import { ImportPreviewFolderRow } from "./import-preview-folder-row";
import { ImportPreviewInvalidRow } from "./import-preview-invalid-row";
import { ImportPreviewItemRow } from "./import-preview-item-row";
import type { TreeData, TreeNode } from "./types";

export interface ImportPreviewTreeProps {
	flattenedNodes: TreeNode[];
	selectedItemIds: Set<string>;
	getFolderCheckState: (id: string) => "checked" | "unchecked" | "indeterminate";
	treeData: TreeData;
	onToggleItem: (id: string) => void;
	onToggleFolder: (id: string) => void;
	onResetFilter?: () => void;
}

export const ImportPreviewTree = memo(function ImportPreviewTree({
	flattenedNodes,
	selectedItemIds,
	getFolderCheckState,
	treeData,
	onToggleItem,
	onToggleFolder,
	onResetFilter,
}: ImportPreviewTreeProps) {
	const [parentEl, setParentEl] = useState<HTMLDivElement | null>(null);

	// eslint-disable-next-line react/incompatible-library
	const rowVirtualizer = useVirtualizer({
		count: flattenedNodes.length,
		getScrollElement: () => parentEl,
		estimateSize: (index) => (flattenedNodes[index]?.type === "invalid" ? 74 : 52),
		overscan: 5,
	});

	const virtualItems = rowVirtualizer.getVirtualItems();
	const deferredVirtualItems = useDeferredValue(virtualItems);

	if (flattenedNodes.length === 0) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-muted-foreground">
				<p className="text-sm font-medium text-foreground">No entries found for this filter</p>
				{onResetFilter && (
					<p className="mt-1 text-xs">
						<button
							type="button"
							onClick={onResetFilter}
							className="cursor-pointer font-medium text-primary hover:underline"
						>
							Show all entries
						</button>
					</p>
				)}
			</div>
		);
	}

	return (
		<div ref={setParentEl} className="custom-scrollbar flex-1 overflow-y-auto p-4">
			<div className="relative w-full" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
				{deferredVirtualItems.map((virtualRow) => {
					const node = flattenedNodes[virtualRow.index];
					if (!node) return null;

					if (node.type === "folder") {
						const folder = node.data;
						const folderId = node.id;
						const checkState = getFolderCheckState(folderId);
						const descendantItems = treeData.folderDescendantItemIdsMap.get(folderId) || [];
						const descendantEmpty = treeData.folderDescendantEmptyFolderIdsMap.get(folderId) || [];
						const isEmptyFolder = treeData.emptyFolderIds.has(folderId);
						const hasSelectableContent =
							descendantItems.length > 0 ||
							descendantEmpty.length > 0 ||
							(isEmptyFolder && !folder.isDuplicate);
						const directItemCount = treeData.folderDirectItemCountMap.get(folderId) ?? 0;

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
								<ImportPreviewFolderRow
									folder={folder}
									depth={node.depth}
									checkState={checkState}
									hasSelectableContent={hasSelectableContent}
									itemCount={directItemCount}
									onToggle={onToggleFolder}
								/>
							</div>
						);
					} else if (node.type === "invalid") {
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
								<ImportPreviewInvalidRow entry={node.data} depth={node.depth} />
							</div>
						);
					} else {
						const item = node.data;
						const itemId = node.id;
						const isSelected = selectedItemIds.has(itemId);

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
								<ImportPreviewItemRow
									item={item}
									depth={node.depth}
									isSelected={isSelected}
									onToggle={onToggleItem}
								/>
							</div>
						);
					}
				})}
			</div>
		</div>
	);
});
