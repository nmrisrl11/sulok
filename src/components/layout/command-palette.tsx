import {
	AboutIcon,
	AppearanceIcon,
	DataIcon,
	FolderIcon,
	FolderLinkIcon,
	FollowFolderIcon,
	GetAppIcon,
	RecycleBinIcon,
	SettingsIcon,
	SoundFxIcon,
	SuloCustomizationIcon,
	UpdatesIcon,
} from "@/components/icons";
import { SiteFavicon } from "@/components/site-favicon";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { APP_INFO } from "@/constants/app-info";
import { useCommandSearch, useDebounce } from "@/hooks";
import { cn } from "@/lib/utils";
import { useCommandStore, useSettingsStore } from "@/stores";

import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const CORNER_ITEMS = [
	{ value: "corner-library", label: "Library", icon: FolderLinkIcon, path: "/?view=all" },
	{
		value: "corner-favorites",
		label: "Favorites",
		icon: FollowFolderIcon,
		path: "/?view=favorites",
	},
	{ value: "corner-trash", label: "Recycle Bin", icon: RecycleBinIcon, path: "/?view=trash" },
];

const PAGES_ITEMS = [
	{ value: "page-install", label: "Get App", icon: GetAppIcon, path: "/install" },
	{ value: "page-updates", label: "Updates", icon: UpdatesIcon, path: "/updates" },
	{ value: "page-about", label: "About", icon: AboutIcon, path: "/about" },
	{ value: "page-settings", label: "Settings", icon: SettingsIcon, path: "/settings" },
];

const SETTINGS_ITEMS = [
	{ value: "settings-data", label: "Data & Storage", icon: DataIcon, path: "/settings?tab=data" },
	{
		value: "settings-appearance",
		label: "Appearance",
		icon: AppearanceIcon,
		path: "/settings?tab=appearance",
	},
	{ value: "settings-sounds", label: "Sound FX", icon: SoundFxIcon, path: "/settings?tab=sounds" },
	{
		value: "settings-sulo",
		label: "Sulo Customization",
		icon: SuloCustomizationIcon,
		path: "/settings?tab=sulo",
	},
];

export function CommandPalette() {
	const isOpen = useCommandStore((state) => state.isOpen);
	const setIsOpen = useCommandStore((state) => state.setIsOpen);
	const [query, setQuery] = useState("");
	const navigate = useNavigate();

	const debouncedQuery = useDebounce(query, 150);
	const { folders, items, folderMap } = useCommandSearch(debouncedQuery);

	const isReferralTrackingEnabled = useSettingsStore(
		(state) => state.settings.privacySettings?.enableReferralTracking,
	);

	const runCommand = useCallback(
		(command: () => void) => {
			setIsOpen(false);
			command();
		},
		[setIsOpen],
	);

	const renderFolders = useMemo(() => {
		if (folders.length === 0) return null;
		return (
			<CommandGroup heading="Folders">
				{folders.map((folder) => (
					<CommandItem
						key={folder.id}
						value={`folder-${folder.id}-${folder.name}`}
						onSelect={() => runCommand(() => navigate(`/?folder=${folder.id}`))}
						className="gap-2 rounded-md"
					>
						<FolderIcon className="mr-2 h-4 w-4 shrink-0" />
						<span>{folder.name}</span>
					</CommandItem>
				))}
			</CommandGroup>
		);
	}, [folders, navigate, runCommand]);

	const renderItems = useMemo(() => {
		if (items.length === 0) return null;
		return (
			<CommandGroup heading="Links">
				{items.map((item) => {
					let targetUrl = item.url;
					let domain = "";
					if (isReferralTrackingEnabled) {
						try {
							const urlObj = new URL(item.url);
							urlObj.searchParams.set("ref", APP_INFO.name.toLowerCase());
							targetUrl = urlObj.toString();
							domain = urlObj.hostname.replace(/^www\./, "");
						} catch {
							// Ignore invalid URLs
						}
					} else {
						try {
							domain = new URL(item.url).hostname.replace(/^www\./, "");
						} catch {
							// Ignore invalid URLs
						}
					}

					return (
						<CommandItem
							key={item.id}
							value={`item-${item.id}-${item.title || ""}-${item.url}-${domain}`}
							onSelect={() =>
								runCommand(() => window.open(targetUrl, "_blank", "noopener,noreferrer"))
							}
							className="gap-2 rounded-md py-2"
						>
							<SiteFavicon url={item.url} logo={item.logo} className="mr-2 h-5 w-5 shrink-0" />
							<div className="flex flex-col items-start overflow-hidden">
								<span className="truncate">{item.title || item.url}</span>
								{item.title && item.title !== item.url && (
									<span className="truncate font-mono text-[11px] tracking-tight text-muted-foreground">
										{item.url}
									</span>
								)}
								{query && (
									<button
										type="button"
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											runCommand(() =>
												navigate(item.folderId ? `/?folder=${item.folderId}` : `/?view=all`),
											);
										}}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.stopPropagation();
											}
										}}
										className="mt-1.5 flex w-fit items-center gap-1.5 rounded-md border border-border/50 bg-secondary/50 px-2 py-0.5 text-[11px] font-medium text-secondary-foreground transition-colors corner-squircle hover:bg-secondary hover:text-foreground supports-[corner-shape:squircle]:rounded-xl"
									>
										<FolderIcon className="h-3! w-3! shrink-0 text-muted-foreground" />
										<span className="truncate">
											{item.folderId ? folderMap.get(item.folderId)?.name : "Library"}
										</span>
									</button>
								)}
							</div>
						</CommandItem>
					);
				})}
			</CommandGroup>
		);
	}, [items, query, folderMap, isReferralTrackingEnabled, runCommand, navigate]);

	const filteredStaticGroups = useMemo(() => {
		const q = query.toLowerCase().trim();
		const groups = [
			{ heading: "Your Corner", items: CORNER_ITEMS },
			{ heading: "Pages", items: PAGES_ITEMS },
			{ heading: "Settings", items: SETTINGS_ITEMS },
		];

		const filteredGroups = q
			? groups
					.map((group) => ({
						...group,
						items: group.items.filter(
							(item) =>
								item.label.toLowerCase().includes(q) || item.value.toLowerCase().includes(q),
						),
					}))
					.filter((group) => group.items.length > 0)
			: groups;

		return filteredGroups;
	}, [query]);

	const renderStaticGroups = useMemo(() => {
		return filteredStaticGroups.map((group) => (
			<CommandGroup key={group.heading} heading={group.heading}>
				{group.items.map((item) => {
					const Icon = item.icon;
					return (
						<CommandItem
							key={item.value}
							value={item.value}
							onSelect={() => runCommand(() => navigate(item.path))}
							className="gap-2 rounded-md"
						>
							<Icon className="mr-2 h-4 w-4 shrink-0" />
							<span>{item.label}</span>
						</CommandItem>
					);
				})}
			</CommandGroup>
		));
	}, [filteredStaticGroups, navigate, runCommand]);

	const totalResults =
		folders.length +
		items.length +
		filteredStaticGroups.reduce((acc, group) => acc + group.items.length, 0);

	return (
		<CommandDialog open={isOpen} onOpenChange={setIsOpen} shouldFilter={false}>
			<CommandInput placeholder="Search your corner..." value={query} onValueChange={setQuery} />
			<div className="mx-3 mb-3 rounded-xl bg-background ring-1 ring-border corner-squircle supports-[corner-shape:squircle]:rounded-4xl">
				<CommandList
					className={cn("max-h-75 overflow-y-auto", totalResults > 4 && "scroll-fade-effect-y")}
				>
					<CommandEmpty className="flex flex-col items-center justify-center gap-1 px-4 py-6 text-center text-sm">
						<span className="text-muted-foreground">No results found for</span>
						<span className="max-w-full truncate font-medium">"{query}"</span>
					</CommandEmpty>

					{renderFolders}
					{renderItems}
					{renderStaticGroups}
				</CommandList>
			</div>
		</CommandDialog>
	);
}
