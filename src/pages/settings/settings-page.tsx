import { AppearanceIcon, DataIcon, SoundFxIcon, SuloCustomizationIcon } from "@/components/icons";
import { SuloMascot } from "@/components/logo/sulo-mascot";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/stores";
import { LoaderIcon } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { Suspense, lazy, useEffect, useRef } from "react";

const DataStorageSection = lazy(() =>
	import("@/features/settings/components/data-storage").then((m) => ({
		default: m.DataStorageSection,
	})),
);
const AppearanceSection = lazy(() =>
	import("@/features/settings/components/appearance").then((m) => ({
		default: m.AppearanceSection,
	})),
);
const SoundFxSection = lazy(() =>
	import("@/features/settings/components/sound-fx").then((m) => ({
		default: m.SoundFxSection,
	})),
);
const SuloCustomizationSection = lazy(() =>
	import("@/features/settings/components/sulo-customization").then((m) => ({
		default: m.SuloCustomizationSection,
	})),
);

const TABS = [
	{ id: "data", label: "Data & Storage", icon: DataIcon, disabled: false },
	{ id: "appearance", label: "Appearance", icon: AppearanceIcon, disabled: false },
	{ id: "sounds", label: "Sound FX", icon: SoundFxIcon, disabled: false },
	{ id: "sulo", label: "Sulo Customization", icon: SuloCustomizationIcon, disabled: false },
] as const;

function SettingsTabTrigger({
	tab,
	isActive,
	onClick,
}: {
	tab: (typeof TABS)[number];
	isActive: boolean;
	onClick: () => void;
}) {
	const triggerRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (isActive && triggerRef.current) {
			triggerRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
		}
	}, [isActive]);

	const Icon = tab.icon;

	return (
		<button
			ref={triggerRef}
			onClick={onClick}
			disabled={tab.disabled}
			className={cn(
				"flex snap-start items-center gap-2 rounded-full px-4 py-2 text-sm whitespace-nowrap transition-all corner-squircle supports-[corner-shape:squircle]:rounded-2xl",
				isActive
					? "bg-primary font-medium text-primary-foreground shadow-sm"
					: "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
				tab.disabled && "cursor-not-allowed opacity-50",
			)}
		>
			<Icon
				className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground")}
			/>
			{tab.label}
		</button>
	);
}

export function SettingsPage() {
	const [activeTab, setActiveTab] = useQueryState(
		"tab",
		parseAsString.withDefault("data").withOptions({ shallow: true }),
	);

	const expression = useSettingsStore((state) => state.settings.suloSettings.expression404);

	const renderContent = () => {
		switch (activeTab) {
			case "data":
				return <DataStorageSection />;
			case "appearance":
				return <AppearanceSection />;
			case "sounds":
				return <SoundFxSection />;
			case "sulo":
				return <SuloCustomizationSection />;
			default:
				return (
					<div className="flex animate-in flex-col items-center justify-center gap-6 text-center duration-500 fade-in">
						<div className="h-32 w-32 sm:h-48 sm:w-48">
							<SuloMascot expression={expression} />
						</div>
						<div className="flex flex-col gap-2">
							<h2 className="font-heading text-2xl font-bold">Lost in the settings?</h2>
							<p className="mx-auto max-w-sm text-muted-foreground">
								This configuration corner doesn't seem to exist. Let's get you back to familiar
								territory.
							</p>
						</div>
						<Button className="cursor-pointer" onClick={() => setActiveTab("data")}>
							Return to Data & Storage
						</Button>
					</div>
				);
		}
	};

	return (
		<div className="mx-auto w-full max-w-2xl px-4 pt-6 md:px-6 md:pt-12">
			<div className="mb-10 text-center sm:text-left">
				<h1 className="flex items-center justify-center gap-2.5 font-heading text-3xl font-bold sm:justify-start">
					Settings
				</h1>
				<p className="mt-2 text-sm text-muted-foreground sm:text-base">
					Customize your experience and manage your data
				</p>
			</div>

			<div className="flex flex-col gap-10">
				<nav className="custom-scrollbar flex snap-x items-center gap-2 overflow-x-auto border-b border-border/50 pb-4">
					{TABS.map((tab) => (
						<SettingsTabTrigger
							key={tab.id}
							tab={tab}
							isActive={activeTab === tab.id}
							onClick={() => !tab.disabled && setActiveTab(tab.id)}
						/>
					))}
				</nav>

				<main className="min-w-0 flex-1">
					<Suspense
						fallback={
							<div className="flex justify-center p-12">
								<LoaderIcon className="h-5 w-5 animate-spin text-muted-foreground" />
							</div>
						}
					>
						{renderContent()}
					</Suspense>
				</main>
			</div>
		</div>
	);
}
