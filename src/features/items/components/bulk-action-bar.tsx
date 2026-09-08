import { Button } from "@/components/ui/button";
import { APP_INFO } from "@/constants/app-info";
import { notify } from "@/lib/notify";
import { useConfirmationStore } from "@/stores/confirmation-store";
import { useItemStore } from "@/stores/item-store";
import { useLogoStore } from "@/stores/logo-store";
import { Trash2Icon } from "lucide-react";

export function BulkActionBar() {
	const { selectedIds, clearSelection, deleteSelectedItems } = useItemStore();
	const confirm = useConfirmationStore((state) => state.confirm);

	if (selectedIds.length === 0) return null;

	const handleDeleteSelected = () => {
		confirm({
			title: "Delete Items",
			description: `Are you sure you want to delete ${selectedIds.length} items from your ${APP_INFO.name}? This action cannot be undone.`,
			confirmText: "Delete",
			onConfirm: async () => {
				try {
					await deleteSelectedItems();
					useLogoStore.getState().setTemporaryExpression("unimpressed");
					notify.success(`Removed ${selectedIds.length} items from your corner`, {
						id: "items-bulk-deleted",
						hideReaction: true,
					});
				} catch (error) {
					console.error("Failed to delete items", error);
					notify.error("Unable to remove links", { id: "items-bulk-delete-fail" });
				}
			},
		});
	};

	return (
		<div className="mx-auto flex w-fit animate-in items-center gap-4 rounded-full border border-border bg-card/80 px-4 py-2 text-card-foreground shadow-lg backdrop-blur-md duration-300 slide-in-from-bottom-10 corner-squircle fade-in supports-[corner-shape:squircle]:rounded-2xl">
			<span className="px-2 text-sm font-medium whitespace-nowrap">
				{selectedIds.length} selected
			</span>
			<div className="h-6 w-px bg-border" />
			<div className="flex items-center gap-1">
				<Button
					variant="ghost"
					size="sm"
					onClick={handleDeleteSelected}
					className="h-8 gap-2 rounded-full! hover:bg-destructive/10 hover:text-destructive"
				>
					<Trash2Icon className="h-4 w-4" />
					Delete Selected
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={clearSelection}
					className="h-8 rounded-full! text-muted-foreground"
				>
					Clear
				</Button>
			</div>
		</div>
	);
}
