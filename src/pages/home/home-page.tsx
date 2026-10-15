import { InstallNudgeBanner } from "@/components/install-nudge-banner";
import { SEO } from "@/components/seo";
import { Checkbox } from "@/components/ui/checkbox";
import { type Folder, type Item } from "@/db/db";
import { FolderRepository } from "@/db/repositories/folder-repository";
import { ItemRepository } from "@/db/repositories/item-repository";
import { ExplorerDndContext } from "@/features/folders/components/dnd/explorer-dnd-context";
import { ExplorerMain } from "@/features/folders/components/explorer/explorer-main";
import { ExplorerNav } from "@/features/folders/components/explorer/explorer-nav";
import { ExplorerToolbar } from "@/features/folders/components/explorer/explorer-toolbar";
import { useExternalLinkDrop } from "@/hooks";
import {
	extractExternalLink,
	isExternalLinkDrag,
	type ExternalLinkData,
} from "@/lib/external-link-drag";
import { notify } from "@/lib/notify";
import { folderIdParser, searchQueryParser, viewParser } from "@/lib/search-params";
import { getHasDataHint } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { useExternalDragStore, useFolderStore, useItemStore } from "@/stores";
import { useLiveQuery } from "dexie-react-hooks";
import { PlusIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { useHomeData } from "./hooks/use-home-management";

const SelectionHeader = memo(function SelectionHeader({
	items,
	hasItems,
	folders,
	hasFolders,
	isLoading,
}: {
	items: Item[];
	hasItems: boolean;
	folders: Folder[];
	hasFolders: boolean;
	isLoading?: boolean;
}) {
	const selectedIds = useItemStore((state) => state.selectedIds);
	const selectedFolderIds = useFolderStore((state) => state.selectedFolderIds);
	const selectAllItems = useItemStore((state) => state.selectAll);
	const clearItemSelection = useItemStore((state) => state.clearSelection);
	const selectAllFolders = useFolderStore((state) => state.selectAll);
	const clearFolderSelection = useFolderStore((state) => state.clearSelection);

	if (isLoading) {
		if (getHasDataHint()) {
			return (
				<div className="mb-2 flex items-center justify-between border-b px-3 py-2">
					<div className="flex items-center gap-3">
						<div className="size-4 rounded-sm border border-border bg-muted/50" />
						<div className="h-4 w-8 rounded bg-muted/50" />
					</div>
					<div className="h-4 w-12 rounded bg-muted/50" />
				</div>
			);
		}
		return null;
	}

	if (!hasItems && !hasFolders) return null;

	const isAllSelected =
		(items.length === 0 || items.every((item) => selectedIds.includes(item.id))) &&
		(folders.length === 0 || folders.every((folder) => selectedFolderIds.includes(folder.id)));

	const handleSelectAllChange = (checked: boolean | string) => {
		if (checked === true) {
			selectAllItems(items.map((item) => item.id));
			selectAllFolders(folders.map((folder) => folder.id));
		} else {
			clearItemSelection();
			clearFolderSelection();
		}
	};

	return (
		<div className="mb-2 flex items-center justify-between border-b px-3 py-2">
			<div className="flex items-center gap-3">
				<Checkbox
					id="select-all"
					checked={isAllSelected}
					onCheckedChange={handleSelectAllChange}
					className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
				/>
				<label
					htmlFor="select-all"
					className="cursor-pointer text-xs font-medium text-muted-foreground select-none"
				>
					Name
				</label>
			</div>
			<div className="text-xs font-medium text-muted-foreground">
				{items.length + folders.length} {items.length + folders.length === 1 ? "item" : "items"}
			</div>
		</div>
	);
});

export function HomePage({ className }: { className?: string }) {
	const homeData = useHomeData();
	const scrollRef = useRef<HTMLDivElement>(null);
	const [folderId, setFolderId] = useQueryState("folder", folderIdParser);
	const [, setSearchQuery] = useQueryState("q", searchQueryParser);
	const [view, setView] = useQueryState("view", viewParser);

	const activeFolder = useLiveQuery(
		() => (folderId ? FolderRepository.getById(folderId) : null),
		[folderId],
	);
	const currentFolderName = !folderId ? "Library" : activeFolder?.name || "Library";

	const handleDropLink = useCallback(
		async (link: ExternalLinkData) => {
			if (view === "trash") {
				notify.warning("Cannot add links to the Recycle Bin.", {
					id: `trash-drop-disabled-${link.url}`,
				});
				return;
			}

			const existing = await ItemRepository.findByUrl(link.url);
			if (existing) {
				if (existing.deletedAt) {
					notify.warning("This link is in your recycle bin.", {
						id: `explorer-trash-${existing.id}`,
						action: {
							label: "Restore",
							onClick: async () => {
								await useItemStore.getState().restoreItems([existing.id]);
								notify.dismiss(`explorer-trash-${existing.id}`);
								notify.success("Link restored from trash", {
									id: `item-restored-${existing.id}`,
								});
							},
						},
					});
				} else {
					notify.warning("This link is already in your corner.", {
						id: `explorer-dup-${existing.id}`,
						action: {
							label: "Go to link",
							onClick: () => {
								setFolderId(existing.folderId || null);
								setSearchQuery(null);
								setView("all");
								notify.dismiss(`explorer-dup-${existing.id}`);
							},
						},
					});
				}
				return;
			}

			useItemStore.getState().openCreateDialog(link.url, folderId, link.title);
		},
		[folderId, view, setFolderId, setSearchQuery, setView],
	);

	const explorerDropTarget = useMemo(() => ({ type: "explorer" as const }), []);

	const { isExternalOver, dragProps } = useExternalLinkDrop({
		target: explorerDropTarget,
		onDropLink: handleDropLink,
		disabled: view === "trash",
	});

	// Global window drag listeners to prevent default browser page navigation and reset drag state
	useEffect(() => {
		const handleWindowDragOver = (e: DragEvent) => {
			if (isExternalLinkDrag(e)) {
				e.preventDefault();
				useExternalDragStore.getState().setIsDraggingExternal(true);
			}
		};

		const handleWindowDragLeave = (e: DragEvent) => {
			if (
				e.clientX <= 0 ||
				e.clientY <= 0 ||
				e.clientX >= window.innerWidth ||
				e.clientY >= window.innerHeight ||
				!e.relatedTarget
			) {
				useExternalDragStore.getState().clearExternalDrag();
			}
		};

		const handleWindowDrop = async (e: DragEvent) => {
			useExternalDragStore.getState().clearExternalDrag();

			if (!isExternalLinkDrag(e)) return;
			e.preventDefault();
			if (!e.dataTransfer) return;
			const link = extractExternalLink(e.dataTransfer);
			if (!link) return;

			await handleDropLink(link);
		};

		const handleDragEnd = () => {
			useExternalDragStore.getState().clearExternalDrag();
		};

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				useExternalDragStore.getState().clearExternalDrag();
			}
		};

		window.addEventListener("dragover", handleWindowDragOver);
		window.addEventListener("dragleave", handleWindowDragLeave);
		window.addEventListener("drop", handleWindowDrop);
		window.addEventListener("dragend", handleDragEnd);
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("dragover", handleWindowDragOver);
			window.removeEventListener("dragleave", handleWindowDragLeave);
			window.removeEventListener("drop", handleWindowDrop);
			window.removeEventListener("dragend", handleDragEnd);
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleDropLink, view]);

	return (
		<main className={cn("flex flex-col gap-6 md:gap-8", className)}>
			<SEO canonical="/" />
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-4 px-2 sm:flex-row sm:items-center sm:justify-between sm:px-0">
					<h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
						Your Corner
					</h2>
					<ExplorerNav />
				</div>
				<InstallNudgeBanner />
				<ExplorerDndContext>
					<div className="flex w-full min-w-0 flex-col">
						<ExplorerToolbar
							hasItems={homeData.items.length > 0}
							hasFolders={homeData.folders.length > 0}
							availableDomains={homeData.availableDomains}
						/>
						<SelectionHeader
							items={homeData.items}
							hasItems={homeData.items.length > 0}
							folders={homeData.folders}
							hasFolders={homeData.folders.length > 0}
							isLoading={homeData.isLoading}
						/>
						<div
							ref={scrollRef}
							{...dragProps}
							className={cn(
								"custom-scrollbar relative mt-2 max-h-[55vh] overflow-y-auto pr-2 pb-4 transition-colors",
								isExternalOver &&
									"rounded-xl ring-2 ring-primary/40 ring-offset-2 ring-offset-background",
							)}
						>
							{isExternalOver && (
								<div className="pointer-events-none absolute inset-0 z-30 flex animate-in flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/50 bg-primary/5 backdrop-blur-[2px] transition-all fade-in">
									<div className="flex items-center gap-2 rounded-full border border-border bg-card/95 px-4 py-2 text-sm font-medium text-foreground shadow-lg backdrop-blur-md corner-squircle supports-[corner-shape:squircle]:rounded-2xl">
										<PlusIcon className="size-4 animate-pulse text-primary" />
										<span>Drop link to add to {currentFolderName}</span>
									</div>
								</div>
							)}
							<ExplorerMain
								folders={homeData.folders}
								items={homeData.items}
								folderCounts={homeData.folderCounts}
								isLoading={homeData.isLoading}
								scrollRef={scrollRef}
							/>
						</div>
					</div>
				</ExplorerDndContext>
			</div>
		</main>
	);
}
