import { AppearanceIcon, DataIcon, SoundFxIcon, SuloCustomizationIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { LoaderIcon, SettingsIcon } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { Suspense, lazy, useEffect, useRef } from "react";

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
const SuloCustomizationSection = lazy(() =>
	import("@/features/settings/components/sulo-customization-section").then((m) => ({
		default: m.SuloCustomizationSection,
	})),
);

const TABS = [
	{ id: "data", label: "Data & Storage", icon: DataIcon, disabled: false },
	{ id: "appearance", label: "Appearance", icon: AppearanceIcon, disabled: true },
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

	const renderContent = () => {
		switch (activeTab) {
			case "data":
				return (
					<Suspense
						fallback={
							<div className="flex justify-center p-12">
								<LoaderIcon className="h-5 w-5 animate-spin text-muted-foreground" />
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
								<LoaderIcon className="h-5 w-5 animate-spin text-muted-foreground" />
							</div>
						}
					>
						<SoundSettingsSection />
					</Suspense>
				);
			case "sulo":
				return (
					<Suspense
						fallback={
							<div className="flex justify-center p-12">
								<LoaderIcon className="h-5 w-5 animate-spin text-muted-foreground" />
							</div>
						}
					>
						<SuloCustomizationSection />
					</Suspense>
				);
			default:
				return (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<SettingsIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
						<h3 className="font-heading text-lg font-medium">Coming Soon</h3>
						<p className="mt-1 max-w-sm text-sm text-muted-foreground">
							These settings are currently under development. Please check back later.
						</p>
					</div>
				);
		}
	};

	return (
		<div className="mx-auto w-full max-w-2xl px-4 py-8 pb-24 sm:px-6 md:py-12 md:pb-12">
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

				<main className="min-w-0 flex-1 pb-10">{renderContent()}</main>
			</div>
		</div>
	);
}
