import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useBookmarkStore } from "@/stores/bookmark-store";
import { useState } from "react";
import type { BookmarkFormValues } from "../schemas/bookmark.schema";
import { BookmarkForm } from "./bookmark-form";

export function BookmarkDialog() {
	const { isDialogOpen, setDialogOpen, editingBookmark, addBookmark, updateBookmark } =
		useBookmarkStore();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	const handleSubmit = async (data: BookmarkFormValues) => {
		setIsSubmitting(true);
		setSubmitError(null);
		try {
			if (editingBookmark) {
				await updateBookmark(editingBookmark.id, data);
			} else {
				await addBookmark(data);
			}
			setDialogOpen(false);
		} catch (error) {
			console.error("Failed to save bookmark", error);
			setSubmitError(error instanceof Error ? error.message : "Failed to save bookmark.");
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
					submitError={submitError}
				/>
			</DialogContent>
		</Dialog>
	);
}
