import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { notify } from "@/lib/notify";
import { type FolderFormData, folderSchema } from "@/schemas/folder.schema";
import { useFolderStore } from "@/stores/folder-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function FolderDialog() {
	const { isDialogOpen, setDialogOpen, editingFolder, addFolder, updateFolder } = useFolderStore();
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Derive state for smooth animations
	const [activeFolder, setActiveFolder] = useState(editingFolder);
	if (isDialogOpen && activeFolder !== editingFolder) {
		setActiveFolder(editingFolder);
	}

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<FolderFormData>({
		resolver: zodResolver(folderSchema),
		defaultValues: activeFolder
			? { name: activeFolder.name, parentId: activeFolder.parentId }
			: { name: "", parentId: null },
	});

	// Reset form when dialog opens/closes
	if (isDialogOpen && !activeFolder && errors.name) {
		// Reset errors if opened as create
		reset({ name: "", parentId: null });
	}

	const handleFormSubmit = async (data: FolderFormData) => {
		setIsSubmitting(true);
		try {
			if (activeFolder) {
				await updateFolder(activeFolder.id, { ...data, parentId: data.parentId ?? null });
				notify.success("Folder updated");
			} else {
				await addFolder({ ...data, parentId: data.parentId ?? null });
				notify.success("Folder created");
			}
			setDialogOpen(false);
			reset();
		} catch (error) {
			console.error("Failed to save folder", error);
			notify.error("Unable to save folder");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
			<DialogContent className="gap-0 p-0 sm:max-w-sm">
				<DialogHeader className="border-b p-4 pb-2">
					<DialogTitle>{activeFolder ? "Rename Folder" : "New Folder"}</DialogTitle>
					<DialogDescription>
						{activeFolder
							? "Choose a new name for this folder."
							: "Create a new folder to organize your links."}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4 p-4">
					<div className="flex flex-col gap-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							placeholder="e.g. Inspiration"
							autoFocus
							autoComplete="off"
							{...register("name")}
							className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
						/>
						{errors.name && (
							<p className="text-sm text-red-500" role="alert">
								{errors.name.message}
							</p>
						)}
					</div>

					<DialogFooter className="mt-2">
						<Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{activeFolder ? "Save" : "Create"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
