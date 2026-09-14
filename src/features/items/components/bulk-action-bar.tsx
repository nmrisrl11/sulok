import { Button } from "@/components/ui/button";
import { APP_INFO } from "@/constants/app-info";
import { notify } from "@/lib/notify";
import { useConfirmationStore } from "@/stores/confirmation-store";
import { useFolderStore } from "@/stores/folder-store";
import { useItemStore } from "@/stores/item-store";
import { useLogoStore } from "@/stores/logo-store";
import { useMoveStore } from "@/stores/move-store";
import { FolderInputIcon, RotateCcwIcon, Trash2Icon } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

export function BulkActionBar() {
	const { selectedIds, clearSelection } = useItemStore();
	const { selectedFolderIds, clearSelection: clearFolderSelection } = useFolderStore();
	const confirm = useConfirmationStore((state) => state.confirm);
	const [view] = useQueryState("view", parseAsString.withDefault("all"));

	const totalSelected = selectedIds.length + selectedFolderIds.length;

	if (totalSelected === 0) return null;

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
						const { BulkRepository } = await import("@/db/repositories/bulk-repository");
						await BulkRepository.restore(selectedIds, selectedFolderIds);
					},
				},
			});
		} catch (error) {
			console.error("Failed to move items to Recycle Bin", error);
			notify.error("Unable to remove items", { id: "bulk-delete-fail" });
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

	return (
		<div className="mx-auto flex w-fit animate-in items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-2 text-card-foreground shadow-lg backdrop-blur-md duration-300 slide-in-from-bottom-10 corner-squircle fade-in supports-[corner-shape:squircle]:rounded-2xl sm:gap-4 sm:px-4">
			<span className="px-1 text-xs font-medium whitespace-nowrap sm:px-2 sm:text-sm">
				{totalSelected} selected
			</span>
			<div className="h-6 w-px shrink-0 bg-border" />
			<div className="flex items-center gap-1">
				{view === "trash" ? (
					<>
						<Button
							variant="ghost"
							size="sm"
							onClick={handleRestoreSelected}
							className="h-8 gap-2 rounded-full! hover:bg-muted"
						>
							<RotateCcwIcon className="h-4 w-4 text-muted-foreground" />
							<span className="hidden sm:inline">Restore Selected</span>
							<span className="sr-only sm:hidden">Restore Selected</span>
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={handleHardDeleteSelected}
							className="h-8 gap-2 rounded-full! hover:bg-destructive/10 hover:text-destructive"
						>
							<Trash2Icon className="h-4 w-4" />
							<span className="hidden sm:inline">Delete Forever</span>
							<span className="sr-only sm:hidden">Delete Forever</span>
						</Button>
					</>
				) : (
					<Button
						variant="ghost"
						size="sm"
						onClick={handleSoftDeleteSelected}
						className="h-8 gap-2 rounded-full! hover:bg-destructive/10 hover:text-destructive"
					>
						<Trash2Icon className="h-4 w-4" />
						<span className="hidden sm:inline">Delete Selected</span>
						<span className="sr-only sm:hidden">Delete Selected</span>
					</Button>
				)}
				{view !== "trash" && (
					<Button
						variant="ghost"
						size="sm"
						onClick={() =>
							useMoveStore
								.getState()
								.openMoveDialog({ itemIds: selectedIds, folderIds: selectedFolderIds })
						}
						className="h-8 gap-2 rounded-full! hover:bg-muted"
					>
						<FolderInputIcon className="h-4 w-4" />
						<span className="hidden sm:inline">Move Selected</span>
						<span className="sr-only sm:hidden">Move Selected</span>
					</Button>
				)}
				<Button
					variant="ghost"
					size="sm"
					onClick={() => {
						clearSelection();
						clearFolderSelection();
					}}
					className="h-8 rounded-full! text-muted-foreground"
				>
					Clear
				</Button>
			</div>
		</div>
	);
}
