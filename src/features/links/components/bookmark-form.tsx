import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookmarkSchema, type BookmarkFormValues } from "../schemas/bookmark.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface BookmarkFormProps {
	defaultValues?: Partial<BookmarkFormValues>;
	onSubmit: (data: BookmarkFormValues) => void;
	onCancel: () => void;
	isSubmitting?: boolean;
}

export function BookmarkForm({
	defaultValues,
	onSubmit,
	onCancel,
	isSubmitting,
}: BookmarkFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<BookmarkFormValues>({
		resolver: zodResolver(bookmarkSchema),
		defaultValues: {
			url: defaultValues?.url || "",
			title: defaultValues?.title || "",
			description: defaultValues?.description || "",
		},
	});

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-1 flex-col gap-4 overflow-y-auto p-4"
		>
			<div className="space-y-2">
				<Label htmlFor="url">URL *</Label>
				<Input
					id="url"
					autoComplete="off"
					placeholder="https://example.com"
					{...register("url")}
					className={errors.url ? "border-destructive" : ""}
				/>
				{errors.url && <p className="text-sm font-medium text-destructive">{errors.url.message}</p>}
			</div>

			<div className="space-y-2">
				<Label htmlFor="title">Site Name (Optional)</Label>
				<Input id="title" placeholder="Example Site" {...register("title")} autoComplete="off" />
				{errors.title && (
					<p className="text-sm font-medium text-destructive">{errors.title.message}</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="description">Description (Optional)</Label>
				<Textarea
					id="description"
					placeholder="A brief note about this bookmark"
					{...register("description")}
					maxLength={500}
					className="field-sizing-content min-h-15 resize-none w-full max-w-full wrap-break-word"
				/>
				{errors.description && (
					<p className="text-sm font-medium text-destructive">{errors.description.message}</p>
				)}
			</div>

			<DialogFooter>
				<Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
					Cancel
				</Button>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Saving..." : "Save Bookmark"}
				</Button>
			</DialogFooter>
		</form>
	);
}
