import { useFolderStore, useItemStore } from "@/stores";

export function useIsSelectionMode() {
	const hasSelectedItems = useItemStore((state) => state.selectedIds.length > 0);
	const hasSelectedFolders = useFolderStore((state) => state.selectedFolderIds.length > 0);

	return hasSelectedItems || hasSelectedFolders;
}
