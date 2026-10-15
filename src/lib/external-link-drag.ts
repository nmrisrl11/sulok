import { ITEM_TITLE_MAX_LENGTH } from "@/constants/validation-constants";
import type { Item } from "@/db/db";
import { ItemRepository } from "@/db/repositories/item-repository";
import { fetchUrlMetadata } from "@/features/items/hooks/use-metadata";
import { notify } from "@/lib/notify";
import { itemSchema } from "@/schemas";
import { useActiveDragStore, useExternalDragStore, useItemStore } from "@/stores";

export interface ExternalLinkData {
	url: string;
	title?: string;
}

export interface SaveExternalLinkOptions {
	url: string;
	title?: string;
	folderId?: string | null;
	folderName?: string;
}

/**
 * Checks whether an incoming drag event represents an external link
 * (e.g. from the browser bookmark bar, address bar, or another browser window)
 * rather than an internal @dnd-kit drag or non-link desktop file.
 */
export function isExternalLinkDrag(e: DragEvent | React.DragEvent): boolean {
	// If an internal @dnd-kit item/folder is actively being dragged, ignore
	if (useActiveDragStore.getState().activeData) return false;
	if (!e.dataTransfer) return false;

	const types = Array.from(e.dataTransfer.types || []);
	if (types.length === 0) return false;

	const hasFiles = types.includes("Files");
	const hasUriList = types.includes("text/uri-list");
	const hasHtml = types.includes("text/html");
	const hasMozUrl = types.includes("text/x-moz-url");
	const hasPlain = types.includes("text/plain");

	// Ignore if purely files without any URI or HTML bookmark metadata
	if (hasFiles && !hasUriList && !hasHtml && !hasMozUrl) {
		return false;
	}

	return hasUriList || hasHtml || hasMozUrl || hasPlain;
}

/**
 * Extracts the URL and site title from the browser's DataTransfer object.
 * Handles Chromium HTML anchors, Firefox text/x-moz-url, RFC 2483 uri-lists, and plain text.
 */
export function extractExternalLink(dataTransfer: DataTransfer): ExternalLinkData | null {
	let candidateUrl: string | null = null;
	let candidateTitle: string | undefined = undefined;

	// 1. Try text/html (Chromium browsers: <a href="https://...">Title</a>)
	const html = dataTransfer.getData("text/html");
	if (html) {
		try {
			const doc = new DOMParser().parseFromString(html, "text/html");
			const anchor = doc.querySelector("a");
			if (anchor) {
				const href = anchor.getAttribute("href");
				if (href) {
					candidateUrl = href;
					const text = anchor.textContent?.trim();
					if (text && text !== href) {
						candidateTitle = text;
					}
				}
			}
		} catch {
			// Ignore DOMParser error
		}
	}

	// 2. Try text/x-moz-url (Firefox: URL\nTitle)
	if (!candidateUrl) {
		const mozUrl = dataTransfer.getData("text/x-moz-url");
		if (mozUrl) {
			const [url, title] = mozUrl.split(/\r?\n/);
			if (url?.trim()) {
				candidateUrl = url.trim();
				if (title?.trim() && title.trim() !== candidateUrl) {
					candidateTitle = title.trim();
				}
			}
		}
	}

	// 3. Try text/uri-list (RFC 2483 format)
	if (!candidateUrl) {
		const uriList = dataTransfer.getData("text/uri-list");
		if (uriList) {
			const lines = uriList.split(/\r?\n/).map((l) => l.trim());
			const firstUrl = lines.find((l) => l && !l.startsWith("#"));
			if (firstUrl) {
				candidateUrl = firstUrl;
			}
		}
	}

	// 4. Try text/plain or URL
	if (!candidateUrl) {
		const plain = (dataTransfer.getData("text/plain") || dataTransfer.getData("URL") || "").trim();
		if (plain) {
			candidateUrl = plain;
		}
	}

	if (!candidateUrl) return null;

	// Clean candidate URL: remove surrounding quotes, trailing whitespaces
	candidateUrl = candidateUrl.replace(/^["']|["']$/g, "").trim();

	// Validate using itemSchema
	const validation = itemSchema.shape.url.safeParse(candidateUrl);
	if (!validation.success) {
		return null;
	}

	return {
		url: validation.data,
		title: candidateTitle?.trim() || undefined,
	};
}

/**
 * Saves an external link directly into a target folder or the Library root.
 * Enforces duplicate checks, undo notifications, and background metadata enrichment.
 */
export async function saveExternalLinkToFolder({
	url,
	title,
	folderId,
	folderName,
}: SaveExternalLinkOptions): Promise<void> {
	useExternalDragStore.getState().clearExternalDrag();

	const parsed = itemSchema.shape.url.safeParse(url);
	if (!parsed.success) {
		notify.error("That doesn't look like a valid link.", { id: "external-link-invalid" });
		return;
	}
	const validUrl = parsed.data;

	// Duplicate detection
	const existingItem = await ItemRepository.findByUrl(validUrl);
	if (existingItem) {
		if (existingItem.deletedAt) {
			notify.warning("This link is in your recycle bin.", {
				id: `external-link-trash-${existingItem.id}`,
				action: {
					label: "Restore",
					onClick: async () => {
						await useItemStore.getState().restoreItems([existingItem.id]);
						notify.dismiss(`external-link-trash-${existingItem.id}`);
						notify.success("Link restored from trash", {
							id: `item-restored-${existingItem.id}`,
						});
					},
				},
			});
		} else {
			notify.warning("This link is already in your corner.", {
				id: `external-link-dup-${existingItem.id}`,
				action: {
					label: "Go to link",
					onClick: () => {
						const urlObj = new URL(window.location.href);
						if (existingItem.folderId) {
							urlObj.searchParams.set("folder", existingItem.folderId);
						} else {
							urlObj.searchParams.delete("folder");
						}
						urlObj.searchParams.delete("q");
						urlObj.searchParams.delete("view");
						window.history.pushState(null, "", urlObj.toString());
						window.dispatchEvent(new PopStateEvent("popstate"));
						notify.dismiss(`external-link-dup-${existingItem.id}`);
					},
				},
			});
		}
		return;
	}

	// Save new item
	const cleanTitle = title?.trim() ? title.trim().slice(0, ITEM_TITLE_MAX_LENGTH) : undefined;
	let createdItem: Item;
	try {
		createdItem = await ItemRepository.save({
			url: validUrl,
			title: cleanTitle,
			folderId: folderId || undefined,
		});
	} catch (error) {
		console.error("Failed to save dropped link:", error);
		const message = error instanceof Error ? error.message : "Failed to save link";
		notify.error(message, { id: `external-link-save-error-${validUrl}` });
		return;
	}

	const destination = folderName || "Library";
	notify.success(`Saved to ${destination}`, {
		id: `item-saved-${createdItem.id}`,
		action: {
			label: "Undo",
			onClick: async () => {
				try {
					await useItemStore.getState().softDeleteItems([createdItem.id]);
					notify.dismiss(`item-saved-${createdItem.id}`);
					notify.success("Link removed", { id: `item-undone-${createdItem.id}` });
				} catch (error) {
					console.error("Failed to undo link save", error);
					notify.error("Unable to undo save", { id: `item-undo-error-${createdItem.id}` });
				}
			},
		},
	});

	// Enrich metadata asynchronously in background
	fetchUrlMetadata(validUrl)
		.then(async (meta) => {
			const updates: Partial<Item> = {};
			if (meta.logo) updates.logo = meta.logo;
			if (meta.image) updates.image = meta.image;
			if (meta.description) updates.description = meta.description;
			if (meta.title && !cleanTitle) updates.title = meta.title;
			if (Object.keys(updates).length > 0) {
				await ItemRepository.update(createdItem.id, updates);
			}
		})
		.catch(() => {
			// Background fetch fail is non-fatal; the link is already safely saved
		});
}
