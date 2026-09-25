import { ResetButton } from "@/components/reset-button";
import { Input } from "@/components/ui/input";
import { WHISPER_PHRASES } from "@/constants/whispers";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";
import { whispersSchema, type WhispersFormValues } from "@/schemas";
import { useSettingsStore } from "@/stores";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, QuoteIcon, TrashIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm, type FieldErrors } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { SettingsCard } from "../settings-card";

function mapPhrasesToForm(phrases: readonly string[]) {
	return phrases.map((p) => ({ value: p }));
}
function mapFormToPhrases(items: { value: string }[]) {
	return items.map((i) => i.value).filter((v) => v.trim() !== "");
}

const categoryMap: Record<keyof WhispersFormValues, { label: string; desc: string }> = {
	positive: {
		label: "Happy Moments",
		desc: "When things go perfectly right and Sulo wants to cheer.",
	},
	negative: { label: "Oopsies", desc: "When something fails or breaks and Sulo offers comfort." },
	warning: { label: "Heads Up", desc: "When caution is needed for an action." },
	info: { label: "Friendly Hints", desc: "For general updates and helpful hints." },
};

export function SuloWhispersSection() {
	// Subscribe to whispers. Since store updates preserve object references for unchanged properties,
	// this will NOT trigger a re-render when Sulo expressions are updated.
	const whispers = useSettingsStore((state) => state.settings.suloSettings.whispers);
	const updateSettings = useSettingsStore((state) => state.updateSettings);
	const location = useLocation();

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

	useEffect(() => {
		if (location.hash === "#whispers") {
			const element = document.getElementById("whispers");
			if (element) {
				setTimeout(() => {
					element.scrollIntoView({ behavior: "smooth", block: "start" });
				}, 100);
			}
		}
	}, [location.hash]);

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
		const restoredWhispers = {
			positive: [...WHISPER_PHRASES.positive],
			negative: [...WHISPER_PHRASES.negative],
			warning: [...WHISPER_PHRASES.warning],
			info: [...WHISPER_PHRASES.info],
		};
		updateSettings({
			suloSettings: {
				...currentSettings,
				whispers: restoredWhispers,
			},
		});

		form.reset({
			positive: mapPhrasesToForm(restoredWhispers.positive),
			negative: mapPhrasesToForm(restoredWhispers.negative),
			warning: mapPhrasesToForm(restoredWhispers.warning),
			info: mapPhrasesToForm(restoredWhispers.info),
		});

		notify.success("Whispers restored", { id: "restore-whispers" });
	}, [updateSettings, form]);

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
		<div id="whispers" className="scroll-mt-24 space-y-4">
			<div className="flex items-center justify-between gap-4">
				<h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
					Whispers
				</h3>
				<ResetButton onClick={handleRestoreWhispers} label="Reset Whispers" />
			</div>

			<form
				id="whispers-form"
				onSubmit={form.handleSubmit(onSubmit, onInvalid)}
				className="space-y-6"
			>
				<SettingsCard className="flex flex-col p-0 sm:p-0">
					<div className="flex flex-col divide-y divide-border/50">
						<div className="bg-muted/20 p-4 sm:px-6 sm:py-5">
							<div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-muted/40 p-1.5 shadow-inner corner-squircle supports-[corner-shape:squircle]:rounded-3xl">
								{(Object.keys(categoryMap) as Array<keyof WhispersFormValues>).map((cat) => (
									<button
										key={cat}
										type="button"
										onClick={() => setActiveCategory(cat)}
										className={cn(
											"flex-1 rounded-xl px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none supports-[corner-shape:squircle]:rounded-2xl supports-[corner-shape:squircle]:corner-squircle",
											activeCategory === cat
												? "animate-in bg-background text-foreground shadow-engraved duration-200 zoom-in-95"
												: "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
										)}
									>
										{categoryMap[cat].label}
									</button>
								))}
							</div>
						</div>

						<div className="space-y-6 p-5 sm:p-6">
							<div className="space-y-1">
								<h4 className="text-sm font-medium text-foreground">
									{categoryMap[activeCategory].label} Phrases
								</h4>
								<p className="text-sm text-muted-foreground">{categoryMap[activeCategory].desc}</p>
							</div>

							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{arrays[activeCategory].fields.map((field, index) => {
									const fieldError = activeErrors?.[index]?.value;
									return (
										<div key={field.id} className="space-y-1.5">
											<div className="group relative flex items-center overflow-hidden rounded-xl border border-border/50 shadow-sm transition-all corner-squircle focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 hover:border-border supports-[corner-shape:squircle]:rounded-2xl">
												<div className="pointer-events-none flex w-10 shrink-0 items-center justify-center self-stretch bg-background text-muted-foreground/60 peer-disabled:opacity-50">
													<QuoteIcon size={14} />
												</div>
												<Input
													{...form.register(`${activeCategory}.${index}.value` as const)}
													placeholder="Enter phrase..."
													autoComplete="off"
													className={cn(
														"rounded-none! border-0 bg-muted/10 px-3 pr-9 shadow-none focus-visible:ring-0",
														fieldError && "text-destructive placeholder:text-destructive/50",
													)}
													maxLength={30}
												/>
												<button
													type="button"
													aria-label="Remove phrase"
													onClick={() => arrays[activeCategory].remove(index)}
													disabled={arrays[activeCategory].fields.length <= 1}
													className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground/60 opacity-100 transition-all outline-none group-hover:opacity-100 hover:text-destructive focus:z-10 focus:opacity-100 disabled:pointer-events-none disabled:opacity-0 sm:opacity-0"
												>
													<TrashIcon size={14} />
												</button>
											</div>
											{fieldError && (
												<p className="px-1 text-xs font-medium text-destructive">
													{fieldError.message}
												</p>
											)}
										</div>
									);
								})}

								{arrays[activeCategory].fields.length < 10 && (
									<button
										type="button"
										onClick={() => arrays[activeCategory].append({ value: "" })}
										className="flex min-h-8 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border/50 text-sm font-medium text-muted-foreground transition-colors corner-squircle hover:border-border hover:bg-muted/30 hover:text-foreground supports-[corner-shape:squircle]:rounded-2xl"
									>
										<PlusIcon className="h-4 w-4" />
										Add Phrase
									</button>
								)}
							</div>
						</div>
					</div>

					<div className="flex items-center justify-end border-t border-border/50 bg-muted/10 p-4 sm:px-6">
						<button
							type="submit"
							form="whispers-form"
							disabled={!form.formState.isDirty}
							className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium whitespace-nowrap text-primary-foreground shadow transition-colors corner-squircle hover:bg-primary/90 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 supports-[corner-shape:squircle]:rounded-xl"
						>
							Save Whispers
						</button>
					</div>
				</SettingsCard>
			</form>
		</div>
	);
}
