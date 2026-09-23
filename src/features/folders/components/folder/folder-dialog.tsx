import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { notify } from "@/lib/notify";
import { type FolderFormData, folderSchema } from "@/schemas";
import { useFolderStore } from "@/stores";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export function FolderDialog() {
	const isMobile = useIsMobile();
	const isDialogOpen = useFolderStore((state) => state.isDialogOpen);
	const setDialogOpen = useFolderStore((state) => state.setDialogOpen);
	const editingFolder = useFolderStore((state) => state.editingFolder);
	const initialParentId = useFolderStore((state) => state.initialParentId);
	const addFolder = useFolderStore((state) => state.addFolder);
	const updateFolder = useFolderStore((state) => state.updateFolder);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Derive state for smooth animations
	const [activeFolder, setActiveFolder] = useState(editingFolder);
	const [activeParentId, setActiveParentId] = useState(initialParentId);
	const [prevIsDialogOpen, setPrevIsDialogOpen] = useState(isDialogOpen);
	const [prevEditingFolder, setPrevEditingFolder] = useState(editingFolder);
	const [prevInitialParentId, setPrevInitialParentId] = useState(initialParentId);

	if (
		isDialogOpen !== prevIsDialogOpen ||
		editingFolder !== prevEditingFolder ||
		initialParentId !== prevInitialParentId
	) {
		setPrevIsDialogOpen(isDialogOpen);
		setPrevEditingFolder(editingFolder);
		setPrevInitialParentId(initialParentId);
		if (isDialogOpen) {
			setActiveFolder(editingFolder);
			setActiveParentId(initialParentId);
		}
	}

	const {
		register,
		handleSubmit,
		reset,
		getValues,
		formState: { errors },
	} = useForm<FolderFormData>({
		resolver: zodResolver(folderSchema),
		defaultValues: activeFolder
			? { name: activeFolder.name, parentId: activeFolder.parentId }
			: { name: "", parentId: activeParentId },
	});

	useEffect(() => {
		if (isDialogOpen) {
			reset(
				editingFolder
					? { name: editingFolder.name, parentId: editingFolder.parentId }
					: { name: "", parentId: initialParentId },
			);
		}
	}, [isDialogOpen, editingFolder, initialParentId, reset]);

	const handleFormSubmit = async (data: FolderFormData) => {
		setIsSubmitting(true);
		try {
			const finalParentId = getValues("parentId") || activeParentId || null;

			if (activeFolder) {
				await updateFolder(activeFolder.id, { ...data, parentId: finalParentId });
				notify.success("Folder updated");
			} else {
				await addFolder({ ...data, parentId: finalParentId });
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

	const title = activeFolder ? "Rename Folder" : "New Folder";
	const description = activeFolder
		? "Choose a new name for this folder."
		: "Create a new folder to organize your links.";

	const formContent = (
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
	);

	if (isMobile) {
		return (
			<Drawer open={isDialogOpen} onOpenChange={setDialogOpen}>
				<DrawerContent className="gap-0 p-0">
					<DrawerHeader className="border-b p-4 text-left">
						<DrawerTitle>{title}</DrawerTitle>
						<DrawerDescription>{description}</DrawerDescription>
					</DrawerHeader>
					{formContent}
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
			<DialogContent className="gap-0 p-0 sm:max-w-sm">
				<DialogHeader className="border-b p-4 pb-2">
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				{formContent}
			</DialogContent>
		</Dialog>
	);
}
