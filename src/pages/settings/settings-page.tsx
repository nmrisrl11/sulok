import { AppearanceIcon, DataIcon, SoundFxIcon, SuloCustomizationIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { LoaderIcon, SettingsIcon } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { Suspense, lazy } from "react";

const DataStorageSection = lazy(() =>
	import("@/features/settings/components/data-storage-section").then((m) => ({
		default: m.DataStorageSection,
	})),
);
const SoundSettingsSection = lazy(() =>
	import("@/features/settings/components/sound-settings-section").then((m) => ({
		default: m.SoundSettingsSection,
	})),
);

const TABS = [
	{ id: "data", label: "Data & Storage", icon: DataIcon, disabled: false },
	{ id: "appearance", label: "Appearance", icon: AppearanceIcon, disabled: true },
	{ id: "sounds", label: "Sound FX", icon: SoundFxIcon, disabled: false },
	{ id: "sulo", label: "Sulo Customization", icon: SuloCustomizationIcon, disabled: true },
] as const;

export function SettingsPage() {
	const [activeTab, setActiveTab] = useQueryState(
		"tab",
		parseAsString.withDefault("data").withOptions({ shallow: false }),
	);

	const renderContent = () => {
		switch (activeTab) {
			case "data":
				return (
					<Suspense
						fallback={
							<div className="flex justify-center p-12">
								<LoaderIcon className="w-5 h-5 animate-spin text-muted-foreground" />
							</div>
						}
					>
						<DataStorageSection />
					</Suspense>
				);
			case "sounds":
				return (
					<Suspense
						fallback={
							<div className="flex justify-center p-12">
								<LoaderIcon className="w-5 h-5 animate-spin text-muted-foreground" />
							</div>
						}
					>
						<SoundSettingsSection />
					</Suspense>
				);
			default:
				return (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<SettingsIcon className="w-12 h-12 text-muted-foreground/50 mb-4" />
						<h3 className="font-heading text-lg font-medium">Coming Soon</h3>
						<p className="text-sm text-muted-foreground max-w-sm mt-1">
							These settings are currently under development. Please check back later.
						</p>
					</div>
				);
		}
	};

	return (
		<div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 pb-24 md:py-12 md:pb-12">
			<div className="mb-10 text-center sm:text-left">
				<h1 className="font-heading text-3xl font-bold flex items-center justify-center sm:justify-start gap-2.5">
					<SettingsIcon className="w-7 h-7 text-primary" />
					Settings
				</h1>
				<p className="text-muted-foreground text-sm sm:text-base mt-2">
					Customize your experience and manage your data.
				</p>
			</div>

			<div className="flex flex-col gap-10">
				<nav className="flex items-center gap-2 overflow-x-auto pb-4 custom-scrollbar snap-x border-b border-border/50">
					{TABS.map((tab) => {
						const Icon = tab.icon;
						const isActive = activeTab === tab.id;
						return (
							<button
								key={tab.id}
								onClick={() => !tab.disabled && setActiveTab(tab.id)}
								disabled={tab.disabled}
								className={cn(
									"snap-start flex items-center gap-2 px-4 py-2 text-sm rounded-full transition-all whitespace-nowrap corner-squircle supports-[corner-shape:squircle]:rounded-2xl",
									isActive
										? "bg-primary text-primary-foreground font-medium shadow-sm"
										: "hover:bg-muted/60 text-muted-foreground hover:text-foreground",
									tab.disabled && "opacity-50 cursor-not-allowed",
								)}
							>
								<Icon
									className={cn(
										"w-4 h-4",
										isActive ? "text-primary-foreground" : "text-muted-foreground",
									)}
								/>
								{tab.label}
							</button>
						);
					})}
				</nav>

				<main className="flex-1 min-w-0 pb-10">{renderContent()}</main>
			</div>
		</div>
	);
}
