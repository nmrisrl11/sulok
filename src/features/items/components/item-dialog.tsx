import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { APP_INFO } from "@/constants/app-info";
import { ItemRepository } from "@/db/repositories/item-repository";
import { notify } from "@/lib/notify";
import { folderIdParser, searchQueryParser, viewParser } from "@/lib/search-params";
import type { ItemFormValues } from "@/schemas";
import { useItemStore, useLogoStore } from "@/stores";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { ItemForm } from "./item-form";

export function ItemDialog() {
	const [, setFolderId] = useQueryState("folder", folderIdParser);
	const [, setSearchQuery] = useQueryState("q", searchQueryParser);
	const [, setView] = useQueryState("view", viewParser);

	const isDialogOpen = useItemStore((state) => state.isDialogOpen);
	const setDialogOpen = useItemStore((state) => state.setDialogOpen);
	const editingItem = useItemStore((state) => state.editingItem);
	const initialUrl = useItemStore((state) => state.initialUrl);
	const initialFolderId = useItemStore((state) => state.initialFolderId);
	const addItem = useItemStore((state) => state.addItem);
	const updateItem = useItemStore((state) => state.updateItem);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	// Keep a stable reference to the item being edited while the dialog is open
	// to prevent the form from resetting or flashing while animating out.
	const [activeItem, setActiveItem] = useState(editingItem);
	const [activeUrl, setActiveUrl] = useState(initialUrl);
	const [activeFolderId, setActiveFolderId] = useState(initialFolderId);

	// Derive state during render to avoid cascading renders from useEffect
	if (isDialogOpen && activeItem !== editingItem) {
		setActiveItem(editingItem);
	}
	if (isDialogOpen && activeUrl !== initialUrl) {
		setActiveUrl(initialUrl);
	}
	if (isDialogOpen && activeFolderId !== initialFolderId) {
		setActiveFolderId(initialFolderId);
	}

	const handleSubmit = async (data: ItemFormValues) => {
		setIsSubmitting(true);
		setSubmitError(null);
		try {
			// Check for duplicates
			const existingItem = await ItemRepository.findByUrl(data.url);
			if (existingItem && (!editingItem || existingItem.id !== editingItem.id)) {
				setDialogOpen(false);
				if (existingItem.deletedAt) {
					notify.warning("This link is in your recycle bin.", {
						id: "item-dialog-duplicate",
						action: {
							label: "Restore",
							onClick: async () => {
								await useItemStore.getState().restoreItems([existingItem.id]);
								notify.dismiss("item-dialog-duplicate");
								notify.success("Link restored from trash", { id: "item-restored" });
							},
						},
					});
				} else {
					notify.warning("This link is already in your corner.", {
						id: "item-dialog-duplicate",
						action: {
							label: "Go to link",
							onClick: () => {
								setFolderId(existingItem.folderId || null);
								setSearchQuery(null);
								setView("all");
							},
						},
					});
				}
				setIsSubmitting(false);
				return; // Stop submission
			}

			if (editingItem) {
				await updateItem(editingItem.id, data);
				notify.success("Changes saved", { id: "item-updated" });
			} else {
				await addItem({
					...data,
					url: data.url as string, // Zod validation guarantees url is present
				});
				notify.success("Added to your corner", { id: "item-saved" });
			}
			setDialogOpen(false);
			useLogoStore.getState().setTemporaryExpression("curious");
		} catch (error) {
			console.error("Failed to save item", error);
			setSubmitError(error instanceof Error ? error.message : "Failed to save item.");
			notify.error("Unable to save changes", { id: "item-save-fail" });
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
			<DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-sm">
				<DialogHeader className="border-b p-4 pb-2">
					<DialogTitle>{editingItem ? "Edit Item" : `Add to ${APP_INFO.name}`}</DialogTitle>
					<DialogDescription>
						{editingItem
							? "Update the details of your saved item."
							: "Save a new find to your corner."}
					</DialogDescription>
				</DialogHeader>

				<ItemForm
					defaultValues={
						activeItem || {
							url: activeUrl || "",
							folderId: activeFolderId || "unorganized",
						}
					}
					isEditing={!!activeItem}
					onSubmit={handleSubmit}
					onCancel={() => setDialogOpen(false)}
					isSubmitting={isSubmitting}
					submitError={submitError}
				/>
			</DialogContent>
		</Dialog>
	);
}
