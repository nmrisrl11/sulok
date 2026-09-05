import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_INFO } from "@/constants/app-info";
import { useDebounce } from "@/hooks/use-debounce";
import { formatUrl } from "@/lib/utils";
import { itemSchema, type ItemFormValues } from "@/schemas/item.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useMetadata } from "../hooks/use-metadata";
import { ItemPreview } from "./item-preview";

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

	const rawUrl = useWatch({ control, name: "url" }) || "";
	const debouncedUrl = useDebounce(rawUrl, 500);
	const formattedUrl = formatUrl(debouncedUrl);

	let fetchUrl = formattedUrl;
	try {
		const parsed = new URL(formattedUrl);
		parsed.username = "";
		parsed.password = "";
		fetchUrl = parsed.toString();
	} catch {
		// ignore invalid URLs for redaction
	}

	// Fetch metadata if we have a URL to preview
	const shouldFetch = fetchUrl.length > 3;
	const { data: metadata, loading, error } = useMetadata(fetchUrl, shouldFetch);

	// Auto-populate form fields when metadata is successfully fetched
	useEffect(() => {
		const currentIsUrlChanged = defaultValues?.url
			? formatUrl(rawUrl) !== formatUrl(defaultValues.url)
			: true;

		if (rawUrl.trim() === "") {
			setValue("title", "");
			setValue("description", "");
		} else if (!currentIsUrlChanged) {
			setValue("title", defaultValues?.title || "");
			setValue("description", defaultValues?.description || "");
		} else if (metadata) {
			setValue("title", metadata.title || "");
			setValue("description", metadata.description || "");
		} else if (error) {
			setValue("title", "");
			setValue("description", "");
		}
	}, [metadata, rawUrl, error, defaultValues, setValue]);

	const isPending = rawUrl !== debouncedUrl || loading;

	const handleFormSubmit = (data: ItemFormValues) => {
		if (isPending) return;
		onSubmit(data);
	};

	return (
		<>
			<form
				id="item-form"
				onSubmit={handleSubmit(handleFormSubmit)}
				className="flex flex-1 flex-col gap-5 overflow-y-auto p-4 custom-scrollbar"
			>
				<div className="space-y-2">
					<Label htmlFor="url">URL *</Label>
					<Input
						id="url"
						autoComplete="off"
						placeholder="https://example.com"
						{...register("url")}
						className={errors.url ? "border-destructive" : ""}
						autoFocus
					/>
					{errors.url && (
						<p className="text-sm font-medium text-destructive">{errors.url.message}</p>
					)}
				</div>

				<div className="flex flex-col gap-2">
					<Label className="text-muted-foreground">Preview</Label>
					<ItemPreview metadata={metadata} loading={loading} error={error} url={formattedUrl} />
				</div>

				{submitError && (
					<div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
						{submitError}
					</div>
				)}
			</form>

			<DialogFooter className="m-0">
				<Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
					Cancel
				</Button>
				<Button type="submit" disabled={isSubmitting || isPending} form="item-form">
					{isSubmitting
						? "Saving..."
						: isPending
							? "Loading preview..."
							: `Save to ${APP_INFO.name}`}
				</Button>
			</DialogFooter>
		</>
	);
}
