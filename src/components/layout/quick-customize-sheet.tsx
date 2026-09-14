import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import {
	AccentColorControl,
	CornerRadiusControl,
	LayoutDensityControl,
	WorkspaceThemeControl,
} from "@/features/settings/components/appearance-section";
import {
	AudioSignaturesControl,
	SoundSettingsControl,
	VolumeControl,
} from "@/features/settings/components/sound-settings-section";
import { SuloExpressionsControl } from "@/features/settings/components/sulo-expressions-section";
import { useSoundEffects } from "@/hooks";
import { type SuloExpression } from "@/stores";
import { useSettingsStore } from "@/stores";
import { useUIStore } from "@/stores";
import { WandSparklesIcon } from "lucide-react";
import { useCallback, useEffect } from "react";

export function QuickCustomizeSheet() {
	const isOpen = useUIStore((state) => state.isQuickCustomizeOpen);
	const close = useUIStore((state) => state.closeQuickCustomize);
	const { playSound } = useSoundEffects();
	const enabled = useSettingsStore((state) => state.settings.soundSettings.enabled);

	// Optional: Handle a mock Sulo state preview if needed, similar to settings page.
	// We can just use the store's default or no-op since Sulo is visible on screen.
	const setPreviewExpression = useCallback((_expr: SuloExpression) => {
		// Does not need to update global logo if we just want a preview,
		// but since Sulo is global, maybe we just don't do local preview here,
		// or we can dispatch to LogoStore to temporarily change it!
		// For now we'll do a no-op since we want live preview on the actual Sulo mascot if he's visible.
	}, []);

	useEffect(() => {
		if (isOpen && enabled) {
			playSound("toggle");
		}
	}, [isOpen, enabled, playSound]);

	return (
		<Sheet
			open={isOpen}
			onOpenChange={(open) => (open ? useUIStore.getState().openQuickCustomize() : close())}
		>
			<SheetContent
				side="right"
				className="flex w-full flex-col gap-0 border-l border-border/50 p-0 sm:max-w-md"
			>
				<div className="border-b border-border/50 bg-muted/20 p-6 pb-4">
					<SheetHeader className="p-0">
						<div className="flex items-center gap-2">
							<WandSparklesIcon className="h-5 w-5 text-primary" />
							<SheetTitle className="text-xl">Quick Customize</SheetTitle>
						</div>
						<SheetDescription>Preview changes live without leaving your corner.</SheetDescription>
					</SheetHeader>
				</div>

				<div className="custom-scrollbar flex-1 overflow-y-auto">
					<Accordion type="single" collapsible defaultValue="appearance" className="w-full">
						{/* APPEARANCE */}
						<AccordionItem value="appearance" className="border-b border-border/50 px-6">
							<AccordionTrigger className="py-4 hover:no-underline">
								<span className="font-semibold">Appearance</span>
							</AccordionTrigger>
							<AccordionContent className="pb-6">
								<div className="animate-in space-y-8 fade-in slide-in-from-top-1">
									<div className="space-y-3">
										<div>
											<h4 className="text-sm font-medium">Workspace Theme</h4>
											<p className="mb-3 text-xs text-muted-foreground">
												Select a curated lighting environment.
											</p>
										</div>
										<WorkspaceThemeControl variant="compact" />
									</div>

									<div className="space-y-3">
										<div>
											<h4 className="text-sm font-medium">Accent Color</h4>
											<p className="mb-3 text-xs text-muted-foreground">
												Choose a custom primary color.
											</p>
										</div>
										<div className="py-1 pl-1">
											<AccentColorControl />
										</div>
									</div>

									<div className="space-y-3">
										<div>
											<h4 className="text-sm font-medium">Corner Radius</h4>
											<p className="mb-3 text-xs text-muted-foreground">
												Adjust the border radius of elements.
											</p>
										</div>
										<CornerRadiusControl />
									</div>

									<div className="space-y-3">
										<div>
											<h4 className="text-sm font-medium">Layout Density</h4>
											<p className="mb-3 text-xs text-muted-foreground">
												Adjust spacing and padding sizes.
											</p>
										</div>
										<LayoutDensityControl />
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>

						{/* SULO */}
						<AccordionItem value="sulo" className="border-b border-border/50 px-6">
							<AccordionTrigger className="py-4 hover:no-underline">
								<span className="font-semibold">Sulo Mascot</span>
							</AccordionTrigger>
							<AccordionContent className="pb-6">
								<div className="animate-in space-y-4 fade-in slide-in-from-top-1">
									<div>
										<h4 className="text-sm font-medium">Default Expressions</h4>
										<p className="mb-3 text-xs text-muted-foreground">How Sulo reacts to events.</p>
									</div>
									<SuloExpressionsControl
										setPreviewExpression={setPreviewExpression}
										variant="compact"
									/>
								</div>
							</AccordionContent>
						</AccordionItem>

						{/* SOUNDS */}
						<AccordionItem value="sounds" className="border-b-0 px-6">
							<AccordionTrigger className="py-4 hover:no-underline">
								<span className="font-semibold">Sound FX</span>
							</AccordionTrigger>
							<AccordionContent className="pb-6">
								<div className="animate-in space-y-8 fade-in slide-in-from-top-1">
									<SoundSettingsControl />
									{enabled && (
										<>
											<VolumeControl />
											<div className="pt-2">
												<h4 className="mb-3 text-sm font-medium">Audio Signatures</h4>
												<AudioSignaturesControl variant="compact" />
											</div>
										</>
									)}
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			</SheetContent>
		</Sheet>
	);
}
