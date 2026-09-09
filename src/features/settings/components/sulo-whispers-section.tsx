import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WHISPER_PHRASES } from "@/constants/whispers";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";
import { whispersSchema, type WhispersFormValues } from "@/schemas/settings.schema";
import { useSettingsStore } from "@/stores/settings-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, RotateCcwIcon, TrashIcon } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm, type FieldErrors } from "react-hook-form";

function mapPhrasesToForm(phrases: readonly string[]) {
	return phrases.map((p) => ({ value: p }));
}
function mapFormToPhrases(items: { value: string }[]) {
	return items.map((i) => i.value).filter((v) => v.trim() !== "");
}

const categoryMap: Record<keyof WhispersFormValues, { label: string; desc: string }> = {
	positive: { label: "Success", desc: "When things go perfectly right." },
	negative: { label: "Errors", desc: "When something fails or breaks." },
	warning: { label: "Warnings", desc: "When caution is needed." },
	info: { label: "Info", desc: "For general updates and hints." },
};

const WhispersHeader = memo(function WhispersHeader({ onRestore }: { onRestore: () => void }) {
	return (
		<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
			<div>
				<h3 className="text-sm font-semibold">Whispers</h3>
				<p className="text-sm text-muted-foreground">
					What should Sulo whisper to you? Customize his responses.
				</p>
			</div>
			<Button
				variant="outline"
				size="sm"
				onClick={onRestore}
				className="w-full shrink-0 gap-2 sm:w-auto"
			>
				<RotateCcwIcon className="h-3.5 w-3.5" />
				Reset Whispers
			</Button>
		</div>
	);
});

export function SuloWhispersSection() {
	// Subscribe to whispers. Since store updates preserve object references for unchanged properties,
	// this will NOT trigger a re-render when Sulo expressions are updated.
	const whispers = useSettingsStore((state) => state.settings.suloSettings.whispers);
	const updateSettings = useSettingsStore((state) => state.updateSettings);

	const [activeCategory, setActiveCategory] = useState<keyof WhispersFormValues>("positive");

	const form = useForm<WhispersFormValues>({
		resolver: zodResolver(whispersSchema),
		defaultValues: {
			positive: mapPhrasesToForm(whispers.positive),
			negative: mapPhrasesToForm(whispers.negative),
			warning: mapPhrasesToForm(whispers.warning),
			info: mapPhrasesToForm(whispers.info),
		},
	});

	// Sync form with external store resets (e.g. "Reset All" button in parent)
	useEffect(() => {
		form.reset({
			positive: mapPhrasesToForm(whispers.positive),
			negative: mapPhrasesToForm(whispers.negative),
			warning: mapPhrasesToForm(whispers.warning),
			info: mapPhrasesToForm(whispers.info),
		});
	}, [whispers, form]);

	const positiveArray = useFieldArray({ control: form.control, name: "positive" });
	const negativeArray = useFieldArray({ control: form.control, name: "negative" });
	const warningArray = useFieldArray({ control: form.control, name: "warning" });
	const infoArray = useFieldArray({ control: form.control, name: "info" });

	const arrays = {
		positive: positiveArray,
		negative: negativeArray,
		warning: warningArray,
		info: infoArray,
	};

	const handleRestoreWhispers = useCallback(() => {
		const currentSettings = useSettingsStore.getState().settings.suloSettings;
		updateSettings({
			suloSettings: {
				...currentSettings,
				whispers: WHISPER_PHRASES,
			},
		});
		notify.success("Whispers restored", { id: "restore-whispers" });
	}, [updateSettings]);

	const onSubmit = (data: WhispersFormValues) => {
		const newWhispers = {
			positive: mapFormToPhrases(data.positive),
			negative: mapFormToPhrases(data.negative),
			warning: mapFormToPhrases(data.warning),
			info: mapFormToPhrases(data.info),
		};
		const currentSettings = useSettingsStore.getState().settings.suloSettings;
		updateSettings({
			suloSettings: {
				...currentSettings,
				whispers: newWhispers,
			},
		});
		notify.success("Whispers saved successfully", { id: "save-whispers" });
	};

	const onInvalid = (errors: FieldErrors<WhispersFormValues>) => {
		const firstErrorCategory = Object.keys(errors)[0] as keyof WhispersFormValues;
		if (firstErrorCategory && firstErrorCategory !== activeCategory) {
			setActiveCategory(firstErrorCategory);
		}
	};

	const activeErrors = form.formState.errors[activeCategory];

	return (
		<div className="space-y-6">
			<WhispersHeader onRestore={handleRestoreWhispers} />

			<form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
				<div className="custom-scrollbar flex gap-2 overflow-x-auto pb-2">
					{(Object.keys(categoryMap) as Array<keyof WhispersFormValues>).map((cat) => (
						<Button
							key={cat}
							type="button"
							variant={activeCategory === cat ? "default" : "secondary"}
							onClick={() => setActiveCategory(cat)}
							className="shrink-0 rounded-full"
						>
							{categoryMap[cat].label}
						</Button>
					))}
				</div>

				<div className="space-y-4 rounded-xl border bg-muted/10 p-6">
					<div className="mb-4">
						<h4 className="font-medium">{categoryMap[activeCategory].label} Phrases</h4>
						<p className="text-sm text-muted-foreground">{categoryMap[activeCategory].desc}</p>
					</div>

					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{arrays[activeCategory].fields.map((field, index) => {
							const fieldError = activeErrors?.[index]?.value;
							return (
								<div key={field.id} className="space-y-1.5">
									<div className="relative">
										<Input
											{...form.register(`${activeCategory}.${index}.value` as const)}
											placeholder="Enter phrase..."
											className={cn(
												"bg-background pe-9",
												fieldError && "border-destructive focus-visible:ring-destructive",
											)}
											maxLength={30}
										/>
										<button
											type="button"
											aria-label="Remove phrase"
											onClick={() => arrays[activeCategory].remove(index)}
											disabled={arrays[activeCategory].fields.length <= 1}
											className="absolute inset-y-0 inset-e-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 transition-[color,box-shadow] outline-none hover:text-destructive focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
										>
											<TrashIcon size={16} />
										</button>
									</div>
									{fieldError && (
										<p className="text-xs font-medium text-destructive">{fieldError.message}</p>
									)}
								</div>
							);
						})}

						{arrays[activeCategory].fields.length < 10 && (
							<Button
								type="button"
								variant="outline"
								className="h-9 w-full gap-2 border-dashed bg-transparent"
								onClick={() => arrays[activeCategory].append({ value: "" })}
							>
								<PlusIcon className="h-4 w-4" />
								Add Phrase
							</Button>
						)}
					</div>
				</div>

				<div className="flex justify-end pt-2">
					<Button type="submit" disabled={!form.formState.isDirty}>
						Save Whispers
					</Button>
				</div>
			</form>
		</div>
	);
}
