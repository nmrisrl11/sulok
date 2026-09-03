import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useItemStore } from "@/stores/item-store";
import { useState } from "react";
import type { ItemFormValues } from "@/schemas/item.schema";
import { ItemForm } from "./item-form";
import { APP_INFO } from "@/constants/app-info";

export function ItemDialog() {
	const { isDialogOpen, setDialogOpen, editingItem, addItem, updateItem } = useItemStore();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	const handleSubmit = async (data: ItemFormValues) => {
		setIsSubmitting(true);
		setSubmitError(null);
		try {
			if (editingItem) {
				await updateItem(editingItem.id, data);
			} else {
				await addItem(data);
			}
			setDialogOpen(false);
		} catch (error) {
			console.error("Failed to save item", error);
			setSubmitError(error instanceof Error ? error.message : "Failed to save item.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
			<DialogContent className="flex flex-col gap-0 p-0 sm:max-w-sm">
				<DialogHeader className="border-b p-4 pb-2">
					<DialogTitle>{editingItem ? "Edit Item" : `Add to ${APP_INFO.name}`}</DialogTitle>
					<DialogDescription>
						{editingItem
							? "Update the details of your saved item."
							: "Save a new find to your corner."}
					</DialogDescription>
				</DialogHeader>

				<ItemForm
					defaultValues={editingItem || undefined}
					onSubmit={handleSubmit}
					onCancel={() => setDialogOpen(false)}
					isSubmitting={isSubmitting}
					submitError={submitError}
				/>
			</DialogContent>
		</Dialog>
	);
}
