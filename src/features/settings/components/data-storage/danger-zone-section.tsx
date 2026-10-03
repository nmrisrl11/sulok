import { TrashXMarkIcon } from "@/components/icons";
import { db } from "@/db/db";
import { useThemeDispatch } from "@/hooks/use-theme";
import { setHasDataHint } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { defaultSettings, useConfirmationStore, useSettingsStore } from "@/stores";
import { useLiveQuery } from "dexie-react-hooks";
import { RefreshCcwIcon, ShieldAlertIcon } from "lucide-react";
import { type ElementType } from "react";

interface DangerZoneActionProps {
	title: string;
	description: string;
	icon: ElementType;
	onClick: () => void;
}

function DangerZoneAction({ title, description, icon: Icon, onClick }: DangerZoneActionProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"group flex items-start gap-4 rounded-xl border border-border/50 bg-background p-4 text-left transition-all hover:border-destructive/40 hover:bg-destructive/5",
				"corner-squircle supports-[corner-shape:squircle]:rounded-4xl",
				"focus-visible:ring-2 focus-visible:ring-destructive focus-visible:outline-none",
			)}
		>
			<div className="shrink-0 rounded-lg border border-destructive/20 bg-destructive/10 p-2 text-destructive shadow-sm transition-colors corner-squircle group-hover:border-destructive/40 supports-[corner-shape:squircle]:rounded-2xl">
				<Icon className="h-5 w-5" />
			</div>
			<div className="flex-1">
				<h4 className="text-sm font-semibold text-foreground transition-colors group-hover:text-destructive">
					{title}
				</h4>
				<p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
			</div>
		</button>
	);
}

export function DangerZoneSection() {
	const confirm = useConfirmationStore((state) => state.confirm);
	const updateSettings = useSettingsStore((state) => state.updateSettings);
	const setTheme = useThemeDispatch();

	const hasData = useLiveQuery(async () => {
		const itemsCount = await db.items.count();
		const foldersCount = await db.folders.count();
		return itemsCount > 0 || foldersCount > 0;
	}, []);

	const actions = [
		...(hasData
			? [
					{
						title: "Delete Library",
						description:
							"Permanently remove all saved links and folders. This action cannot be undone.",
						icon: TrashXMarkIcon,
						onClick: () => {
							confirm({
								title: "Delete Library",
								description:
									"Are you sure you want to delete all saved links and folders? This action cannot be undone.",
								confirmText: "Delete Library",
								onConfirm: async () => {
									await db.transaction("rw", db.items, db.folders, async () => {
										await db.items.clear();
										await db.folders.clear();
									});
									setHasDataHint(false);
									window.location.reload();
								},
							});
						},
					},
				]
			: []),
		{
			title: "Reset Settings",
			description:
				"Permanently reset all your configurations to their defaults. Your saved corners will not be affected.",
			icon: RefreshCcwIcon,
			onClick: () => {
				confirm({
					title: "Reset Settings",
					description:
						"Are you sure you want to reset all configurations to their defaults? Your saved corners will not be affected.",
					confirmText: "Reset Settings",
					onConfirm: () => {
						updateSettings(defaultSettings);
						setTheme("system");
					},
				});
			},
		},
		{
			title: "Factory Reset",
			description:
				"Reset all settings and delete all library data as if it were a fresh app. This action cannot be undone.",
			icon: ShieldAlertIcon,
			onClick: () => {
				confirm({
					title: "Factory Reset",
					description:
						"Are you sure you want to permanently delete all data, configurations, and storage? This will revert the app to a fresh state. This action cannot be undone.",
					confirmText: "Factory Reset",
					onConfirm: async () => {
						sessionStorage.setItem("isFactoryResetting", "true");

						const resetExt = new Promise<void>((resolve) => {
							const handler = (e: MessageEvent) => {
								if (e.data?.type === "SULOK_EXT_FACTORY_RESET_DONE") {
									window.removeEventListener("message", handler);
									resolve();
								}
							};
							window.addEventListener("message", handler);
							window.postMessage({ type: "SULOK_EXT_FACTORY_RESET" }, "*");
							// Fallback if extension is not installed or unresponsive
							setTimeout(() => {
								window.removeEventListener("message", handler);
								resolve();
							}, 500);
						});

						await Promise.all([db.delete(), resetExt]);

						localStorage.clear();
						window.location.reload();
					},
				});
			},
		},
	];

	return (
		<div className="grid gap-3 px-5 py-5 sm:grid-cols-1 sm:px-6 sm:py-6">
			{actions.map((action) => (
				<DangerZoneAction key={action.title} {...action} />
			))}
		</div>
	);
}
