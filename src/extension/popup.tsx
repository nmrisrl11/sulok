import { SiteFavicon } from "@/components/site-favicon";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_INFO } from "@/constants/app-info";
import { normalizeUrl } from "@/lib/utils";
import { useEffect, useState } from "react";
import { type FolderRef } from "./types";
import { showSaveNotification } from "./utils";
import { VirtualFolderCombobox } from "./virtual-folder-combobox";

function Popup() {
	const [url, setUrl] = useState("");
	const [title, setTitle] = useState("");
	const [favicon, setFavicon] = useState("");
	const [saved, setSaved] = useState(false);
	const [status, setStatus] = useState<"new" | "duplicate" | "trashed">("new");
	const [folders, setFolders] = useState<FolderRef[]>([]);
	const [selectedFolderId, setSelectedFolderId] = useState<string>("unorganized");

	useEffect(() => {
		// Get current tab info
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			const tab = tabs[0];

			if (tab?.url) setUrl(tab.url);
			if (tab?.title) setTitle(tab.title);
			if (tab?.favIconUrl) setFavicon(tab.favIconUrl);

			// Load folder tree, theme, and saved URLs from the bridge sync
			chrome.storage.local.get(["folders", "theme", "savedUrls"], (result) => {
				if (result.folders) {
					setFolders(result.folders as FolderRef[]);
				}
				if (result.savedUrls && tab?.url) {
					const savedUrls = result.savedUrls as { url: string; isDeleted: boolean }[];
					const normalizedInput = normalizeUrl(tab.url);
					const existingMatch = savedUrls.find((s) => s.url === normalizedInput);
					if (existingMatch) {
						setStatus(existingMatch.isDeleted ? "trashed" : "duplicate");
					}
				}
				if (result.theme) {
					const themeData = result.theme as { className?: string; cssText?: string };
					if (typeof themeData === "string") {
						// Fallback for previous string format
						document.documentElement.className = themeData;
					} else {
						if (themeData.className) document.documentElement.className = themeData.className;
						if (themeData.cssText) document.documentElement.style.cssText = themeData.cssText;
					}
				}
			});
		});
	}, []);

	const handleSave = () => {
		chrome.storage.local.get("pendingSaves", (result) => {
			interface SaveData {
				url: string;
				title: string;
				folderId: string | null;
				timestamp: number;
			}
			const pendingSaves = (result.pendingSaves as SaveData[]) || [];
			const newSave: SaveData = {
				url,
				title,
				folderId: selectedFolderId === "unorganized" ? null : selectedFolderId,
				timestamp: Date.now(),
			};

			chrome.storage.local.set({ pendingSaves: [...pendingSaves, newSave] }, () => {
				showSaveNotification({ title, status });
				setSaved(true);
				setTimeout(() => window.close(), 1500);
			});
		});
	};

	return (
		<div className="flex w-85 flex-col gap-5 bg-background p-5 font-sans text-foreground">
			<div className="flex items-center gap-2 border-b border-border pb-3">
				<h1
					className="font-heading text-2xl font-extrabold italic"
					style={{ fontVariationSettings: "'WONK' 0, 'SOFT' 0" }}
				>
					{APP_INFO.name}
				</h1>
			</div>

			{title && url ? (
				<div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-3 shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-2xl">
					<SiteFavicon url={url} logo={favicon} className="size-8 shrink-0" smartInvert />
					<div className="flex min-w-0 flex-col">
						<div className="truncate text-sm font-medium text-foreground" title={title}>
							{title}
						</div>
						<div
							className="truncate font-mono text-xs tracking-tight text-muted-foreground"
							title={url}
						>
							{url}
						</div>
					</div>
				</div>
			) : (
				<div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-3 shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-2xl">
					<Skeleton className="size-8 shrink-0 rounded-md corner-squircle supports-[corner-shape:squircle]:rounded-xl" />
					<div className="flex w-full flex-col gap-2 pt-1">
						<Skeleton className="h-4 w-5/6" />
						<Skeleton className="h-3 w-4/6" />
					</div>
				</div>
			)}

			<div className="flex flex-col gap-2">
				<Label
					className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
					htmlFor="folder"
				>
					Save to corner
				</Label>
				<VirtualFolderCombobox
					folders={folders}
					value={selectedFolderId}
					onValueChange={setSelectedFolderId}
				/>
			</div>

			<Button
				onClick={handleSave}
				disabled={saved || !url || status === "duplicate" || status === "trashed"}
				className="mt-2 w-full transition-all duration-300"
			>
				{saved
					? "Added to your corner!"
					: status === "duplicate"
						? "Already in your corner"
						: status === "trashed"
							? "In your Recycle Bin"
							: `Save to ${APP_INFO.name}`}
			</Button>
		</div>
	);
}
export default Popup;
