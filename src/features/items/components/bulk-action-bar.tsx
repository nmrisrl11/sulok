import { Button } from "@/components/ui/button";
import { useConfirmationStore } from "@/stores/confirmation-store";
import { useItemStore } from "@/stores/item-store";
import { APP_INFO } from "@/constants/app-info";
import { useLogoStore } from "@/stores/logo-store";
import { notify } from "@/lib/notify";
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
					});
				} catch (error) {
					console.error("Failed to delete items", error);
					notify.error("Unable to remove links", { id: "items-bulk-delete-fail" });
				}
			},
		});
	};

	return (
		<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
			<div className="bg-card text-card-foreground shadow-lg border border-border rounded-full supports-[corner-shape:squircle]:rounded-2xl corner-squircle px-4 py-2 flex items-center gap-4">
				<span className="text-sm font-medium whitespace-nowrap px-2">
					{selectedIds.length} selected
				</span>
				<div className="w-px h-6 bg-border" />
				<div className="flex items-center gap-1">
					<Button
						variant="ghost"
						size="sm"
						onClick={handleDeleteSelected}
						className="h-8 gap-2 hover:bg-destructive/10 hover:text-destructive rounded-full!"
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
		</div>
	);
}
