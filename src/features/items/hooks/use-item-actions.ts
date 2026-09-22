import { APP_INFO } from "@/constants/app-info";
import { useRef } from "react";
import type { Item } from "@/db/db";
import { useCopyToClipboard } from "@/hooks";
import { notify } from "@/lib/notify";
import { useConfirmationStore, useItemStore, useLogoStore } from "@/stores";

export function useItemActions(item: Item) {
	const openEditDialog = useItemStore((state) => state.openEditDialog);
	const confirm = useConfirmationStore((state) => state.confirm);
	const { isCopied, copyToClipboard } = useCopyToClipboard();

	const handleSoftDelete = async () => {
		try {
			await useItemStore.getState().softDeleteItems([item.id]);
			useLogoStore.getState().setTemporaryExpression("unimpressed");
			notify.success("Moved to Recycle Bin", {
				id: "item-soft-deleted",
				hideReaction: true,
				action: {
					label: "Undo",
					onClick: async () => {
						try {
							await useItemStore.getState().restoreItems([item.id]);
							notify.dismiss("item-soft-deleted");
							notify.success("Link restored", { id: "item-restored" });
						} catch (error) {
							console.error("Failed to restore item", error);
							notify.dismiss("item-soft-deleted");
							notify.error("Unable to restore link", { id: "item-restore-fail" });
						}
					},
				},
			});
		} catch (error) {
			console.error("Failed to move item to Recycle Bin", error);
			notify.error("Unable to remove link", { id: "item-delete-fail" });
		}
	};

	const handleRestore = async () => {
		try {
			await useItemStore.getState().restoreItems([item.id]);
			notify.success("Link restored", { id: "item-restored" });
		} catch (error) {
			console.error("Failed to restore item", error);
			notify.error("Unable to restore link", { id: "item-restore-fail" });
		}
	};

	const handleHardDelete = () => {
		confirm({
			title: "Delete Item",
			description: `Are you sure you want to permanently delete this item from your ${APP_INFO.name}? This action cannot be undone.`,
			confirmText: "Delete Forever",
			onConfirm: async () => {
				try {
					await useItemStore.getState().hardDeleteItem(item.id);
					useLogoStore.getState().setTemporaryExpression("unimpressed");
					notify.success("Removed from your corner", { id: "item-deleted", hideReaction: true });
				} catch (error) {
					console.error("Failed to delete item", error);
					notify.error("Unable to remove link", { id: "item-delete-fail" });
				}
			},
		});
	};

	const handleOpenLink = () => {
		window.open(item.url, "_blank", "noopener,noreferrer");
	};

	const isTogglingFavorite = useRef(false);

	const handleToggleFavorite = async () => {
		if (isTogglingFavorite.current) return;
		isTogglingFavorite.current = true;
		try {
			const { ItemRepository } = await import("@/db/repositories/item-repository");
			const isFav = await ItemRepository.toggleFavorite(item.id);
			notify.success(isFav ? "Added to Favorites" : "Removed from Favorites", {
				id: `item-fav-${item.id}`,
			});
		} catch (error) {
			console.error("Failed to toggle favorite", error);
			notify.error("Failed to update favorite status", { id: `item-fav-fail-${item.id}` });
		} finally {
			isTogglingFavorite.current = false;
		}
	};

	const handleEdit = () => {
		openEditDialog(item);
	};

	const handleCopy = () => {
		copyToClipboard(item.url);
	};

	return {
		isCopied,
		handleCopy,
		handleEdit,
		handleSoftDelete,
		handleRestore,
		handleHardDelete,
		handleOpenLink,
		handleToggleFavorite,
	};
}
