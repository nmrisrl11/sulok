import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { BookmarkForm } from "./bookmark-form";
import { useBookmarkStore } from "@/stores/bookmark-store";
import type { BookmarkFormValues } from "../schemas/bookmark.schema";

export function BookmarkDialog() {
	const { isDialogOpen, setDialogOpen, editingBookmark, addBookmark, updateBookmark } =
		useBookmarkStore();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (data: BookmarkFormValues) => {
		setIsSubmitting(true);
		try {
			if (editingBookmark) {
				await updateBookmark(editingBookmark.id, data);
			} else {
				await addBookmark(data);
			}
			setDialogOpen(false);
		} catch (error) {
			console.error("Failed to save bookmark", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
			<DialogContent className="flex flex-col gap-0 p-0 sm:max-w-sm">
				<DialogHeader className="border-b p-4 pb-2">
					<DialogTitle>{editingBookmark ? "Edit Bookmark" : "Add Bookmark"}</DialogTitle>
					<DialogDescription>
						{editingBookmark
							? "Update the details of your saved bookmark."
							: "Save a new link to your library."}
					</DialogDescription>
				</DialogHeader>

				<BookmarkForm
					defaultValues={editingBookmark || undefined}
					onSubmit={handleSubmit}
					onCancel={() => setDialogOpen(false)}
					isSubmitting={isSubmitting}
				/>
			</DialogContent>
		</Dialog>
	);
}
