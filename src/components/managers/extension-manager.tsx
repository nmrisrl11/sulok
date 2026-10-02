import { FolderRepository } from "@/db/repositories/folder-repository";
import { ItemRepository } from "@/db/repositories/item-repository";
import { fetchUrlMetadata } from "@/features/items/hooks/use-metadata";
import { useThemeState } from "@/hooks/use-theme";
import { notify } from "@/lib/notify";
import { folderIdParser, searchQueryParser, viewParser } from "@/lib/search-params";
import { normalizeUrl } from "@/lib/utils";
import { useItemStore, useSettingsStore } from "@/stores";
import { useLiveQuery } from "dexie-react-hooks";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { z } from "zod";

const savePayloadSchema = z.object({
	url: z.string().url(),
	title: z.string().optional(),
	folderId: z.string().nullable().optional(),
	timestamp: z.number().optional(),
});

type SavePayload = z.infer<typeof savePayloadSchema>;

export function ExtensionManager() {
	const folders = useLiveQuery(() => FolderRepository.getAll());
	const items = useLiveQuery(() => ItemRepository.getAllIncludingTrash());
	const theme = useThemeState();
	const appearanceSettings = useSettingsStore((state) => state.settings.appearanceSettings);

	const [, setFolderId] = useQueryState("folder", folderIdParser);
	const [, setSearchQuery] = useQueryState("search", searchQueryParser);
	const [, setView] = useQueryState("view", viewParser);

	// Sync folders to extension whenever they change
	useEffect(() => {
		if (folders) {
			window.postMessage(
				{
					type: "SULOK_EXT_UPDATE_FOLDERS",
					payload: folders.map((f) => ({ id: f.id, name: f.name, parentId: f.parentId })),
				},
				"*",
			);
		}
	}, [folders]);

	// Sync saved URLs to extension so it can detect duplicates instantly
	useEffect(() => {
		if (items) {
			// Create a map of normalized URLs to their status
			const savedUrls = items.map((item) => ({
				url: normalizeUrl(item.url),
				isDeleted: !!item.deletedAt,
			}));
			window.postMessage(
				{
					type: "SULOK_EXT_UPDATE_URLS",
					payload: savedUrls,
				},
				"*",
			);
		}
	}, [items]);

	// Sync entire HTML classList and styles (theme, radius, density, custom colors) to extension perfectly
	useEffect(() => {
		// Small delay to allow providers to apply classes and styles first
		const timeout = setTimeout(() => {
			window.postMessage(
				{
					type: "SULOK_EXT_UPDATE_THEME",
					payload: {
						className: document.documentElement.className,
						cssText: document.documentElement.style.cssText,
					},
				},
				"*",
			);
		}, 50);
		return () => clearTimeout(timeout);
	}, [theme, appearanceSettings]);

	// Listen for pending saves from extension
	useEffect(() => {
		let syncQueue = Promise.resolve();

		const handleMessage = (event: MessageEvent) => {
			if (event.source !== window) return;

			const data = event.data;
			if (data && data.type === "SULOK_EXT_PENDING_SAVES") {
				if (sessionStorage.getItem("isFactoryResetting") === "true") return;
				const saves = data.payload;
				if (!Array.isArray(saves) || saves.length === 0) return;

				syncQueue = syncQueue.then(async () => {
					let addedCount = 0;
					let duplicateCount = 0;
					let lastDuplicateItem = null;

					for (const rawSave of saves) {
						const parsed = savePayloadSchema.safeParse(rawSave);
						if (!parsed.success) {
							console.warn("Invalid save payload received from extension:", parsed.error);
							continue;
						}
						const save = parsed.data;

						try {
							// Attempt to fetch favicon and image metadata gracefully
							let image: string | undefined;
							let logo: string | undefined;
							let description: string | undefined;

							try {
								const meta = await fetchUrlMetadata(save.url);
								image = meta.image;
								logo = meta.logo;
								description = meta.description;
							} catch (e) {
								console.warn("Failed to fetch metadata for extension save", e);
							}

							await ItemRepository.save({
								url: save.url,
								title: save.title ? save.title.substring(0, 100) : undefined,
								folderId: save.folderId || undefined,
								description: description ? description.substring(0, 500) : "",
								image,
								logo,
								isFavorite: false,
							});
							addedCount++;
						} catch (e) {
							if (e instanceof Error && e.message === "This link is already in your corner.") {
								duplicateCount++;
								if (saves.length === 1) {
									const existingItem = await ItemRepository.findByUrl(save.url);
									if (existingItem) lastDuplicateItem = existingItem;
								}
							} else {
								// Ignore other errors from extension saves
								console.error("Failed to save item from extension:", e);
							}
						}
					}

					// Aggregate notifications
					if (saves.length === 1 && duplicateCount === 1 && lastDuplicateItem) {
						// Single duplicate saved, show specific action toast
						if (lastDuplicateItem.deletedAt) {
							notify.warning("This link is in your Recycle Bin.", {
								id: `ext-dup-${lastDuplicateItem.id}`,
								action: {
									label: "Restore",
									onClick: async () => {
										await useItemStore.getState().restoreItems([lastDuplicateItem!.id]);
										notify.dismiss(`ext-dup-${lastDuplicateItem!.id}`);
										notify.success("Link restored from trash", { id: "item-restored" });
									},
								},
							});
						} else {
							notify.warning("This link is already in your corner.", {
								id: `ext-dup-${lastDuplicateItem.id}`,
								action: {
									label: "Go to link",
									onClick: () => {
										setFolderId(lastDuplicateItem!.folderId || null);
										setSearchQuery(null);
										setView("all");
										useItemStore.getState().clearSelection();
									},
								},
							});
						}
					} else {
						// Bulk processing or single success
						if (addedCount > 0 && duplicateCount === 0) {
							notify.success(
								`Saved ${addedCount} link${addedCount > 1 ? "s" : ""} from the extension!`,
								{ id: "ext-sync" },
							);
						} else if (addedCount > 0 && duplicateCount > 0) {
							notify.success(
								`Saved ${addedCount} link${addedCount > 1 ? "s" : ""}. ${duplicateCount} were already in your corner.`,
								{ id: "ext-sync" },
							);
						} else if (addedCount === 0 && duplicateCount > 0) {
							notify.warning(
								`All ${duplicateCount} link${duplicateCount > 1 ? "s" : ""} were already in your corner.`,
								{ id: "ext-sync-dup" },
							);
						}
					}

					// Tell extension to clear the queue
					const processedTimestamps = saves.map((s: SavePayload) => s.timestamp).filter(Boolean);
					window.postMessage({ type: "SULOK_EXT_CLEAR_SAVES", payload: processedTimestamps }, "*");
				});
			}
		};

		window.addEventListener("message", handleMessage);
		window.postMessage({ type: "SULOK_EXT_READY" }, "*");
		return () => window.removeEventListener("message", handleMessage);
	}, [setFolderId, setSearchQuery, setView]);

	return null;
}
