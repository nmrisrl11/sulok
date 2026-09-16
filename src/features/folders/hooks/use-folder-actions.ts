import type { Folder } from "@/db/db";
import { notify } from "@/lib/notify";
import { useConfirmationStore, useFolderStore, useLogoStore } from "@/stores";

export function useFolderActions(folder: Folder) {
	const openEditDialog = useFolderStore((state) => state.openEditDialog);
	const confirm = useConfirmationStore((state) => state.confirm);

	const handleSoftDelete = async () => {
		try {
			await useFolderStore.getState().softDeleteFolders([folder.id]);
			useLogoStore.getState().setTemporaryExpression("unimpressed");
			notify.success("Moved to Recycle Bin", {
				id: "folder-soft-deleted",
				hideReaction: true,
				action: {
					label: "Undo",
					onClick: async () => {
						try {
							await useFolderStore.getState().restoreFolders([folder.id]);
							notify.dismiss("folder-soft-deleted");
							notify.success("Folder restored", { id: "folder-restored" });
						} catch (error) {
							console.error("Failed to restore folder", error);
							notify.dismiss("folder-soft-deleted");
							notify.error("Unable to restore folder", { id: "folder-restore-fail" });
						}
					},
				},
			});
		} catch (error) {
			console.error("Failed to move folder to Recycle Bin", error);
			notify.error("Unable to remove folder", { id: "folder-delete-fail" });
		}
	};

	const handleRestore = async () => {
		try {
			await useFolderStore.getState().restoreFolders([folder.id]);
			notify.success("Folder restored", { id: "folder-restored" });
		} catch (error) {
			console.error("Failed to restore folder", error);
			notify.error("Unable to restore folder", { id: "folder-restore-fail" });
		}
	};

	const handleHardDelete = () => {
		confirm({
			title: "Delete Folder",
			description: `Are you sure you want to permanently delete "${folder.name}"? This action cannot be undone.`,
			confirmText: "Delete Forever",
			onConfirm: async () => {
				try {
					await useFolderStore.getState().hardDeleteFolder(folder.id);
					useLogoStore.getState().setTemporaryExpression("unimpressed");
					notify.success("Folder permanently deleted", {
						id: "folder-deleted",
						hideReaction: true,
					});
				} catch (error) {
					console.error("Failed to delete folder", error);
					notify.error("Unable to remove folder", { id: "folder-delete-fail" });
				}
			},
		});
	};

	const handleToggleFavorite = async () => {
		try {
			const { FolderRepository } = await import("@/db/repositories/folder-repository");
			const isFav = await FolderRepository.toggleFavorite(folder.id);
			notify.success(isFav ? "Added to Favorites" : "Removed from Favorites");
		} catch (error) {
			console.error("Failed to toggle favorite", error);
			notify.error("Failed to update favorite status");
		}
	};

	const handleEdit = () => {
		openEditDialog(folder);
	};

	return {
		handleEdit,
		handleSoftDelete,
		handleRestore,
		handleHardDelete,
		handleToggleFavorite,
	};
}
