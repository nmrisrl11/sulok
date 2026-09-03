import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "@/hooks/use-debounce";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { itemSchema, type ItemFormValues } from "@/schemas/item.schema";
import { useMetadata } from "../hooks/use-metadata";
import { ItemPreview } from "./item-preview";
import { APP_INFO } from "@/constants/app-info";

interface ItemFormProps {
	defaultValues?: Partial<ItemFormValues>;
	onSubmit: (data: ItemFormValues) => void;
	onCancel: () => void;
	isSubmitting?: boolean;
	submitError?: string | null;
}

export function ItemForm({
	defaultValues,
	onSubmit,
	onCancel,
	isSubmitting,
	submitError,
}: ItemFormProps) {
	const {
		register,
		handleSubmit,
		setValue,
		control,
		formState: { errors },
	} = useForm<ItemFormValues>({
		resolver: zodResolver(itemSchema),
		defaultValues: {
			url: defaultValues?.url || "",
			title: defaultValues?.title || "",
			description: defaultValues?.description || "",
		},
	});

	const rawUrl = useWatch({ control, name: "url" });
	const debouncedUrl = useDebounce(rawUrl, 500);

	// Fetch metadata only if it's a new item (no default title provided initially)
	const shouldFetch = !defaultValues?.title && debouncedUrl.length > 5;
	const { data: metadata, loading, error } = useMetadata(debouncedUrl, shouldFetch);

	// Auto-populate form fields when metadata is successfully fetched
	useEffect(() => {
		if (metadata) {
			if (metadata.title) {
				setValue("title", metadata.title, { shouldDirty: true });
			}
			if (metadata.description) {
				setValue("description", metadata.description, { shouldDirty: true });
			}
		}
	}, [metadata, setValue]);

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-1 flex-col gap-4 overflow-y-auto p-4"
		>
			<ItemPreview metadata={metadata} loading={loading} error={error} url={debouncedUrl} />

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
					placeholder="A brief note about this item"
					{...register("description")}
					maxLength={500}
					className="field-sizing-content min-h-15 resize-none w-full max-w-full wrap-break-word"
				/>
				{errors.description && (
					<p className="text-sm font-medium text-destructive">{errors.description.message}</p>
				)}
			</div>

			{submitError && (
				<div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
					{submitError}
				</div>
			)}

			<DialogFooter>
				<Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
					Cancel
				</Button>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Saving..." : `Save to ${APP_INFO.name}`}
				</Button>
			</DialogFooter>
		</form>
	);
}
