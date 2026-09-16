import { APP_INFO } from "@/constants/app-info";
import { BulkRepository } from "@/db/repositories/bulk-repository";
import { notify } from "@/lib/notify";
import { useConfirmationStore, useFolderStore, useItemStore, useLogoStore } from "@/stores";
import { useLiveQuery } from "dexie-react-hooks";

export function useBulkActions() {
	const selectedIds = useItemStore((state) => state.selectedIds);
	const clearSelection = useItemStore((state) => state.clearSelection);
	const selectedFolderIds = useFolderStore((state) => state.selectedFolderIds);
	const clearFolderSelection = useFolderStore((state) => state.clearSelection);
	const confirm = useConfirmationStore((state) => state.confirm);

	const allFavorited =
		useLiveQuery(
			() => BulkRepository.areAllSelectedFavorited(selectedIds, selectedFolderIds),
			[selectedIds, selectedFolderIds],
		) ?? false;

	const totalSelected = selectedIds.length + selectedFolderIds.length;

	const handleSoftDeleteSelected = async () => {
		try {
			const { BulkRepository } = await import("@/db/repositories/bulk-repository");
			await BulkRepository.softDelete(selectedIds, selectedFolderIds);
			clearSelection();
			clearFolderSelection();
			useLogoStore.getState().setTemporaryExpression("unimpressed");
			notify.success(`Moved ${totalSelected} items to Recycle Bin`, {
				id: "bulk-soft-deleted",
				hideReaction: true,
				action: {
					label: "Undo",
					onClick: async () => {
						try {
							const { BulkRepository } = await import("@/db/repositories/bulk-repository");
							await BulkRepository.restore(selectedIds, selectedFolderIds);
							notify.dismiss("bulk-soft-deleted");
							notify.success("Selection restored", { id: "bulk-restored" });
						} catch (error) {
							console.error("Failed to restore selection", error);
							notify.dismiss("bulk-soft-deleted");
							notify.error("Unable to restore items", { id: "bulk-restore-fail" });
						}
					},
				},
			});
		} catch (error) {
			console.error("Failed to move items to Recycle Bin", error);
			notify.error("Unable to remove items", { id: "bulk-delete-fail" });
		}
	};

	const handleBulkFavorite = async (isFavorite: boolean) => {
		try {
			const { BulkRepository } = await import("@/db/repositories/bulk-repository");
			await BulkRepository.setFavoriteStatus(selectedIds, selectedFolderIds, isFavorite);
			clearSelection();
			clearFolderSelection();
			notify.success(
				isFavorite
					? `Added ${totalSelected} items to Favorites`
					: `Removed ${totalSelected} items from Favorites`,
				{ id: "bulk-favorite" },
			);
		} catch (error) {
			console.error("Failed to update favorite status", error);
			notify.error("Unable to update favorites", { id: "bulk-favorite-fail" });
		}
	};

	const handleRestoreSelected = async () => {
		try {
			const { BulkRepository } = await import("@/db/repositories/bulk-repository");
			await BulkRepository.restore(selectedIds, selectedFolderIds);
			clearSelection();
			clearFolderSelection();
			notify.success(`Restored ${totalSelected} items`, { id: "bulk-restored" });
		} catch (error) {
			console.error("Failed to restore items", error);
			notify.error("Unable to restore items", { id: "bulk-restore-fail" });
		}
	};

	const handleHardDeleteSelected = () => {
		confirm({
			title: "Delete Items",
			description: `Are you sure you want to permanently delete ${totalSelected} items from your ${APP_INFO.name}? This action cannot be undone.`,
			confirmText: "Delete Forever",
			onConfirm: async () => {
				try {
					const { BulkRepository } = await import("@/db/repositories/bulk-repository");
					await BulkRepository.hardDelete(selectedIds, selectedFolderIds);
					clearSelection();
					clearFolderSelection();
					useLogoStore.getState().setTemporaryExpression("unimpressed");
					notify.success(`Removed ${totalSelected} items from your corner`, {
						id: "bulk-deleted",
						hideReaction: true,
					});
				} catch (error) {
					console.error("Failed to delete items", error);
					notify.error("Unable to remove items", { id: "bulk-delete-fail" });
				}
			},
		});
	};

	return {
		allFavorited,
		totalSelected,
		selectedIds,
		selectedFolderIds,
		clearSelection,
		clearFolderSelection,
		handleSoftDeleteSelected,
		handleBulkFavorite,
		handleRestoreSelected,
		handleHardDeleteSelected,
	};
}
