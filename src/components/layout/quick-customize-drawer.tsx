import { ResetButton } from "@/components/reset-button";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import {
	AccentColorControl,
	CornerRadiusControl,
	LayoutDensityControl,
	WorkspaceThemeControl,
} from "@/features/settings/components/appearance/controls";
import { FolderColorControl } from "@/features/settings/components/appearance/folder-customization-setting";
import { AudioSignaturesControl } from "@/features/settings/components/sound-fx/audio-signatures-setting";
import { VolumeControl } from "@/features/settings/components/sound-fx/master-volume-setting";
import { SoundSettingsControl } from "@/features/settings/components/sound-fx/play-interaction-sounds-setting";
import { SuloExpressionsControl } from "@/features/settings/components/sulo-customization/sulo-expressions-section";
import { useSoundEffects, useThemeDispatch } from "@/hooks";
import { defaultSettings, useSettingsStore, useUIStore, type SuloExpression } from "@/stores";
import { WandSparklesIcon, XIcon } from "lucide-react";
import { useCallback, useEffect } from "react";

export function QuickCustomizeDrawer() {
	const isOpen = useUIStore((state) => state.isQuickCustomizeOpen);
	const close = useUIStore((state) => state.closeQuickCustomize);
	const { playSound } = useSoundEffects();
	const enabled = useSettingsStore((state) => state.settings.soundSettings.enabled);
	const updateSettings = useSettingsStore((state) => state.updateSettings);
	const currentSettings = useSettingsStore((state) => state.settings);
	const setTheme = useThemeDispatch();

	const setPreviewExpression = useCallback((_expr: SuloExpression) => {}, []);

	useEffect(() => {
		if (isOpen && enabled) {
			playSound("toggle");
		}
	}, [isOpen, enabled, playSound]);

	const resetAppearance = () => {
		setTheme("system");
		updateSettings({
			appearanceSettings: {
				...currentSettings.appearanceSettings,
				accentColor: "foreground",
				folderColorMode: "preset",
				folderColorBack: "#56b2e3",
				folderColorFront: "#98cfef",
				folderColorPaper: "#ffffff",
				cornerStyle: "squircle",
				customCornerRadius: 16,
				layoutDensity: "compact",
				customLayoutDensity: 12,
			},
		});
	};

	const resetSulo = () => {
		updateSettings({
			suloSettings: {
				...currentSettings.suloSettings,
				expression404: defaultSettings.suloSettings.expression404,
				expressionEmptyState: defaultSettings.suloSettings.expressionEmptyState,
				expressionNavbar: defaultSettings.suloSettings.expressionNavbar,
				expressionQuickAction: defaultSettings.suloSettings.expressionQuickAction,
				expressionPreviewUnavailable: defaultSettings.suloSettings.expressionPreviewUnavailable,
				expressionError: defaultSettings.suloSettings.expressionError,
			},
		});
	};

	const resetSounds = () => {
		updateSettings({
			soundSettings: {
				...currentSettings.soundSettings,
				enabled: defaultSettings.soundSettings.enabled,
				volume: defaultSettings.soundSettings.volume,
				mappings: defaultSettings.soundSettings.mappings,
			},
		});
	};

	return (
		<Drawer
			open={isOpen}
			onOpenChange={(open) => (open ? useUIStore.getState().openQuickCustomize() : close())}
			direction="right"
		>
			<DrawerContent className="flex w-full flex-col gap-0 rounded-none border-l border-border/50 bg-popover p-0 text-popover-foreground shadow-xl transition-all sm:max-w-md">
				<div className="relative border-b border-border/50 bg-muted/20 p-6 pb-4">
					<DrawerHeader className="p-0 text-left">
						<div className="flex items-center gap-2">
							<WandSparklesIcon className="h-5 w-5 text-primary" />
							<DrawerTitle className="text-xl">Quick Customize</DrawerTitle>
						</div>
						<DrawerDescription>Preview changes live without leaving your corner.</DrawerDescription>
					</DrawerHeader>
					<DrawerClose asChild>
						<Button variant="ghost" className="absolute top-4 right-4" size="icon-sm">
							<XIcon />
							<span className="sr-only">Close</span>
						</Button>
					</DrawerClose>
				</div>

				<div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
					<Accordion type="single" collapsible defaultValue="appearance" className="w-full">
						{/* APPEARANCE */}
						<AccordionItem value="appearance" className="border-b border-border/50 px-4 sm:px-6">
							<div className="flex w-full items-center justify-between">
								<AccordionTrigger className="flex-1 py-4 hover:no-underline [&>svg]:hidden">
									<span className="font-semibold">Appearance</span>
								</AccordionTrigger>
								<ResetButton
									onClick={resetAppearance}
									className="h-8 w-8 px-0 [&_span]:hidden"
									aria-label="Reset Appearance"
								/>
							</div>
							<AccordionContent className="pb-6">
								<div className="animate-in space-y-6 fade-in slide-in-from-top-1">
									<div className="space-y-3">
										<div>
											<h4 className="text-sm font-medium">Workspace Theme</h4>
											<p className="mb-3 text-xs text-muted-foreground">
												Select a curated lighting environment.
											</p>
										</div>
										<div className="p-1">
											<WorkspaceThemeControl variant="compact" />
										</div>
									</div>

									<div className="space-y-3">
										<div>
											<h4 className="text-sm font-medium">Accent Color</h4>
											<p className="mb-3 text-xs text-muted-foreground">
												Choose a custom primary color.
											</p>
										</div>
										<div className="p-1">
											<AccentColorControl variant="compact" />
										</div>
									</div>

									<div className="space-y-3">
										<div>
											<h4 className="text-sm font-medium">Folder Customization</h4>
											<p className="mb-3 text-xs text-muted-foreground">
												Personalize the colors of your folder icons.
											</p>
										</div>
										<div className="p-1">
											<FolderColorControl variant="compact" />
										</div>
									</div>

									<div className="space-y-3">
										<div>
											<h4 className="text-sm font-medium">Corner Radius</h4>
											<p className="mb-3 text-xs text-muted-foreground">
												Adjust the border radius of elements.
											</p>
										</div>
										<div className="p-1">
											<CornerRadiusControl variant="compact" />
										</div>
									</div>

									<div className="space-y-3">
										<div>
											<h4 className="text-sm font-medium">Layout Density</h4>
											<p className="mb-3 text-xs text-muted-foreground">
												Adjust spacing and padding sizes.
											</p>
										</div>
										<div className="p-1">
											<LayoutDensityControl variant="compact" />
										</div>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>

						{/* SULO */}
						<AccordionItem value="sulo" className="border-b border-border/50 px-4 sm:px-6">
							<div className="flex w-full items-center justify-between">
								<AccordionTrigger className="flex-1 py-4 hover:no-underline [&>svg]:hidden">
									<span className="font-semibold">Sulo Mascot</span>
								</AccordionTrigger>
								<ResetButton
									onClick={resetSulo}
									className="h-8 w-8 px-0 [&_span]:hidden"
									aria-label="Reset Sulo Mascot"
								/>
							</div>
							<AccordionContent className="pb-6">
								<div className="animate-in space-y-4 fade-in slide-in-from-top-1">
									<div>
										<h4 className="text-sm font-medium">Default Expressions</h4>
										<p className="mb-3 text-xs text-muted-foreground">How Sulo reacts to events.</p>
									</div>
									<div className="p-1">
										<SuloExpressionsControl
											setPreviewExpression={setPreviewExpression}
											variant="compact"
										/>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>

						{/* SOUNDS */}
						<AccordionItem value="sounds" className="border-b-0 px-4 sm:px-6">
							<div className="flex w-full items-center justify-between">
								<AccordionTrigger className="flex-1 py-4 hover:no-underline [&>svg]:hidden">
									<span className="font-semibold">Sound FX</span>
								</AccordionTrigger>
								<ResetButton
									onClick={resetSounds}
									className="h-8 w-8 px-0 [&_span]:hidden"
									aria-label="Reset Sound FX"
								/>
							</div>
							<AccordionContent className="pb-6">
								<div className="animate-in space-y-6 fade-in slide-in-from-top-1">
									<div className="p-1">
										<SoundSettingsControl />
									</div>
									{enabled && (
										<>
											<div className="p-1">
												<VolumeControl />
											</div>
											<div className="p-1">
												<AudioSignaturesControl />
											</div>
										</>
									)}
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
