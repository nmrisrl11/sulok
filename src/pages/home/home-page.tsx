import { Checkbox } from "@/components/ui/checkbox";
import { type Folder, type Item } from "@/db/db";
import { ExplorerMain } from "@/features/folders/components/explorer/explorer-main";
import { ExplorerSidebar } from "@/features/folders/components/explorer/explorer-sidebar";
import { ExplorerToolbar } from "@/features/folders/components/explorer/explorer-toolbar";
import { cn } from "@/lib/utils";
import { useFolderStore, useItemStore } from "@/stores";
import { memo } from "react";
import { useHomeData } from "./hooks/use-home-management";

const SelectionHeader = memo(function SelectionHeader({
	items,
	hasItems,
	folders,
	hasFolders,
}: {
	items: Item[];
	hasItems: boolean;
	folders: Folder[];
	hasFolders: boolean;
}) {
	const selectedIds = useItemStore((state) => state.selectedIds);
	const selectedFolderIds = useFolderStore((state) => state.selectedFolderIds);
	const selectAllItems = useItemStore((state) => state.selectAll);
	const clearItemSelection = useItemStore((state) => state.clearSelection);
	const selectAllFolders = useFolderStore((state) => state.selectAll);
	const clearFolderSelection = useFolderStore((state) => state.clearSelection);

	if (!hasItems && !hasFolders) return null;

	const isAllSelected =
		(items.length === 0 || items.every((item) => selectedIds.includes(item.id))) &&
		(folders.length === 0 || folders.every((folder) => selectedFolderIds.includes(folder.id)));

	const handleSelectAllChange = (checked: boolean | string) => {
		if (checked === true) {
			selectAllItems(items.map((item) => item.id));
			selectAllFolders(folders.map((folder) => folder.id));
		} else {
			clearItemSelection();
			clearFolderSelection();
		}
	};

	return (
		<div className="mb-2 flex items-center justify-between border-b px-3 py-2">
			<div className="flex items-center gap-3">
				<Checkbox
					id="select-all"
					checked={isAllSelected}
					onCheckedChange={handleSelectAllChange}
					className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
				/>
				<label
					htmlFor="select-all"
					className="cursor-pointer text-xs font-medium text-muted-foreground select-none"
				>
					Name
				</label>
			</div>
			<div className="text-xs font-medium text-muted-foreground">
				{items.length + folders.length} {items.length + folders.length === 1 ? "item" : "items"}
			</div>
		</div>
	);
});

export function HomePage({ className }: { className?: string }) {
	const homeData = useHomeData();

	return (
		<main className={cn("flex flex-col gap-6 md:gap-8", className)}>
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-4 px-2 sm:flex-row sm:items-center sm:justify-between sm:px-0">
					<h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
						Your Corner
					</h2>
					<ExplorerSidebar />
				</div>
				<div className="flex w-full min-w-0 flex-col">
					<ExplorerToolbar
						hasItems={homeData.items.length > 0}
						hasFolders={homeData.folders.length > 0}
					/>
					<SelectionHeader
						items={homeData.items}
						hasItems={homeData.items.length > 0}
						folders={homeData.folders}
						hasFolders={homeData.folders.length > 0}
					/>
					<div className="custom-scrollbar relative mt-2 max-h-[55vh] overflow-y-auto pr-2 pb-4">
						<ExplorerMain
							folders={homeData.folders}
							items={homeData.items}
							isLoading={homeData.isLoading}
						/>
					</div>
				</div>
			</div>
		</main>
	);
}
