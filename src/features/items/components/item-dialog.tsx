import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { APP_INFO } from "@/constants/app-info";
import type { ItemFormValues } from "@/schemas/item.schema";
import { useItemStore } from "@/stores/item-store";
import { useLogoStore } from "@/stores/logo-store";
import { useState } from "react";
import { ItemForm } from "./item-form";

export function ItemDialog() {
	const { isDialogOpen, setDialogOpen, editingItem, addItem, updateItem } = useItemStore();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	// Keep a stable reference to the item being edited while the dialog is open
	// to prevent the form from resetting or flashing while animating out.
	const [activeItem, setActiveItem] = useState(editingItem);

	// Derive state during render to avoid cascading renders from useEffect
	if (isDialogOpen && activeItem !== editingItem) {
		setActiveItem(editingItem);
	}

	const handleSubmit = async (data: ItemFormValues) => {
		setIsSubmitting(true);
		setSubmitError(null);
		try {
			if (editingItem) {
				await updateItem(editingItem.id, data);
			} else {
				await addItem({
					...data,
					url: data.url as string, // Zod validation guarantees url is present
				});
			}
			setDialogOpen(false);
			useLogoStore.getState().setTemporaryExpression("curious");
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
					defaultValues={activeItem || undefined}
					onSubmit={handleSubmit}
					onCancel={() => setDialogOpen(false)}
					isSubmitting={isSubmitting}
					submitError={submitError}
				/>
			</DialogContent>
		</Dialog>
	);
}
