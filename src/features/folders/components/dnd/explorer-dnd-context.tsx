import { MoveToFolderIcon } from "@/components/icons";
import type { Folder, Item } from "@/db/db";
import { ItemCard } from "@/features/items/components/item-card";
import { ItemGridCard } from "@/features/items/components/item-grid-card";
import { notify } from "@/lib/notify";
import { viewModeParser } from "@/lib/search-params";
import { useActiveDragStore, useFolderStore, useItemStore, type DragData } from "@/stores";
import {
	DndContext,
	DragOverlay,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	closestCenter,
	pointerWithin,
	useDndContext,
	useSensor,
	useSensors,
	type DragEndEvent,
	type DragStartEvent,
	type Modifier,
} from "@dnd-kit/core";
import { BanIcon, InfoIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useRef, type ReactNode } from "react";
import { FolderCard } from "../folder/folder-card";
import { FolderGridCard } from "../folder/folder-grid-card";

export type DropData = {
	type: "folder" | "breadcrumb";
	folderId: string | null;
	isVirtualRoot?: string;
};

export function ExplorerDndContext({ children }: { children: ReactNode }) {
	const [viewMode] = useQueryState("mode", viewModeParser);
	const setActiveData = useActiveDragStore((state) => state.setActiveData);

	const wasDragging = useRef(false);
	const isPointerDown = useRef(false);

	useEffect(() => {
		const handlePointerDown = () => {
			isPointerDown.current = true;
		};
		const handlePointerUp = () => {
			isPointerDown.current = false;
			if (wasDragging.current) {
				setTimeout(() => {
					wasDragging.current = false;
				}, 50);
			}
		};
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isPointerDown.current) {
				wasDragging.current = true;
			}
		};
		const handleClick = (e: MouseEvent) => {
			if (wasDragging.current) {
				e.preventDefault();
				e.stopPropagation();
				wasDragging.current = false;
			}
		};
		document.addEventListener("pointerdown", handlePointerDown, true);
		document.addEventListener("pointerup", handlePointerUp, true);
		document.addEventListener("keydown", handleKeyDown, true);
		document.addEventListener("click", handleClick, true);
		return () => {
			document.removeEventListener("pointerdown", handlePointerDown, true);
			document.removeEventListener("pointerup", handlePointerUp, true);
			document.removeEventListener("keydown", handleKeyDown, true);
			document.removeEventListener("click", handleClick, true);
		};
	}, []);

	// Configure sensors for touch and mouse
	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				distance: 5, // 5px movement before dragging starts (prevents accidental clicks)
			},
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 250, // Hold for 250ms to start dragging
				tolerance: 5,
			},
		}),
		useSensor(KeyboardSensor, {
			keyboardCodes: {
				start: ["Space"],
				cancel: ["Escape"],
				end: ["Space", "Enter"],
			},
		}),
	);

	const handleDragStart = (event: DragStartEvent) => {
		wasDragging.current = true;
		const { active } = event;
		const data = active.data.current as DragData | undefined;
		if (data) {
			const itemSelectedIds = useItemStore.getState().selectedIds;
			const folderSelectedIds = useFolderStore.getState().selectedFolderIds;

			const isSelected =
				data.type === "folder"
					? folderSelectedIds.includes(data.entity.id)
					: itemSelectedIds.includes(data.entity.id);

			const totalCount = itemSelectedIds.length + folderSelectedIds.length;
			const isBulk = isSelected && totalCount > 1;

			setActiveData({
				...data,
				isBulk,
				itemIds: isSelected ? itemSelectedIds : [],
				folderIds: isSelected ? folderSelectedIds : [],
				totalCount: isBulk ? totalCount : 1,
			});
		}
	};

	const handleDragEnd = async (event: DragEndEvent) => {
		setActiveData(null);
		const { active, over } = event;

		if (!over) return;

		const dragData = active.data.current as DragData | undefined;
		const dropData = over.data.current as DropData | undefined;

		if (!dragData || !dropData) return;

		const targetFolderId = dropData.folderId;

		if (dropData.isVirtualRoot) {
			return;
		}

		const itemSelectedIds = useItemStore.getState().selectedIds;
		const folderSelectedIds = useFolderStore.getState().selectedFolderIds;

		const isSelected =
			dragData.type === "folder"
				? folderSelectedIds.includes(dragData.entity.id)
				: itemSelectedIds.includes(dragData.entity.id);

		const totalCount = itemSelectedIds.length + folderSelectedIds.length;
		const isBulk = isSelected && totalCount > 1;

		// Prevent moving into itself or its current parent (if single)
		if (!isBulk) {
			if (dragData.type === "folder") {
				const folder = dragData.entity as Folder;
				if (folder.id === targetFolderId) return;
				if (folder.parentId === targetFolderId) return;
			}
			if (dragData.type === "item") {
				const item = dragData.entity as Item;
				if ((item.folderId || null) === targetFolderId) return;
			}
		} else {
			if (folderSelectedIds.includes(targetFolderId ?? "")) {
				notify.error("Cannot move a folder into itself", { id: "move-error" });
				return;
			}
			const isSameFolder =
				dragData.type === "folder"
					? (dragData.entity as Folder).parentId === targetFolderId
					: ((dragData.entity as Item).folderId || null) === targetFolderId;
			if (isSameFolder) return;
		}

		try {
			const { BulkRepository } = await import("@/db/repositories/bulk-repository");

			if (isBulk) {
				const itemsToMove = isSelected ? itemSelectedIds : [];
				const foldersToMove = isSelected ? folderSelectedIds : [];

				await BulkRepository.move(itemsToMove, foldersToMove, targetFolderId);
				useItemStore.getState().clearSelection();
				useFolderStore.getState().clearSelection();
			} else {
				if (dragData.type === "folder") {
					await BulkRepository.move([], [dragData.entity.id], targetFolderId);
				} else {
					await BulkRepository.move([dragData.entity.id], [], targetFolderId);
				}
			}
			notify.success("Moved successfully", { id: "dnd-moved" });
		} catch (error) {
			console.error("Failed to move:", error);
			notify.error(error instanceof Error ? error.message : "Failed to move", {
				id: "move-error",
			});
		}
	};

	const clampToOverlayBoundsModifier: Modifier = ({
		activatorEvent,
		activeNodeRect,
		overlayNodeRect,
		transform,
	}) => {
		if (activatorEvent && activeNodeRect && overlayNodeRect) {
			const isTouchEvent = "touches" in activatorEvent;
			const clientX = isTouchEvent
				? (activatorEvent as TouchEvent).touches[0].clientX
				: (activatorEvent as MouseEvent).clientX;
			const clientY = isTouchEvent
				? (activatorEvent as TouchEvent).touches[0].clientY
				: (activatorEvent as MouseEvent).clientY;

			const offsetX = clientX - activeNodeRect.left;
			const offsetY = clientY - activeNodeRect.top;

			// Clamp the cursor position to within the overlay bounds
			const clampedOffsetX = Math.min(Math.max(offsetX, 10), overlayNodeRect.width - 10);
			const clampedOffsetY = Math.min(Math.max(offsetY, 10), overlayNodeRect.height - 10);

			const shiftX = offsetX - clampedOffsetX;
			const shiftY = offsetY - clampedOffsetY;

			return {
				...transform,
				x: transform.x + shiftX,
				y: transform.y + shiftY,
			};
		}
		return transform;
	};

	const handleDragCancel = () => {
		setActiveData(null);
	};

	const activeData = useActiveDragStore((state) => state.activeData);

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={(args) => {
				if (args.pointerCoordinates) {
					return pointerWithin(args);
				}
				return closestCenter(args);
			}}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			onDragCancel={handleDragCancel}
		>
			{children}
			<DragOverlay dropAnimation={null} modifiers={[clampToOverlayBoundsModifier]}>
				{activeData ? <DragOverlayContent activeData={activeData} viewMode={viewMode} /> : null}
			</DragOverlay>
		</DndContext>
	);
}

function DragOverlayContent({
	activeData,
	viewMode,
}: {
	activeData: DragData;
	viewMode: "compact" | "grid" | "list";
}) {
	const { over } = useDndContext();
	const overData = over?.data?.current as DropData | undefined;

	let dropStatus: "valid" | "same-folder" | "self" = "valid";
	if (overData) {
		const targetFolderId = overData.folderId;
		const entity = activeData.entity;
		if (activeData.isBulk && activeData.folderIds?.includes(targetFolderId ?? "")) {
			dropStatus = "self";
		} else if (activeData.type === "folder") {
			const folder = entity as Folder;
			if (folder.id === targetFolderId) dropStatus = "self";
			else if (folder.parentId === targetFolderId) dropStatus = "same-folder";
		} else {
			const item = entity as Item;
			if ((item.folderId || null) === targetFolderId) dropStatus = "same-folder";
		}
	}

	const isOverBreadcrumb = overData?.type === "breadcrumb";

	if (isOverBreadcrumb) {
		if (overData?.isVirtualRoot) {
			return (
				<div className="pointer-events-none flex w-max items-center gap-2 rounded-md border border-border bg-muted/95 px-3 py-1.5 text-sm font-medium text-foreground shadow-lg backdrop-blur-md corner-squircle supports-[corner-shape:squircle]:rounded-xl">
					<InfoIcon className="size-4 text-muted-foreground" />
					Already in {overData.isVirtualRoot}
				</div>
			);
		}
		if (dropStatus === "self") {
			return (
				<div className="text-destructive-foreground pointer-events-none flex w-max items-center gap-2 rounded-md border border-destructive/20 bg-destructive/90 px-3 py-1.5 text-sm font-medium shadow-lg backdrop-blur-md corner-squircle supports-[corner-shape:squircle]:rounded-xl">
					<BanIcon className="size-4" />
					Cannot move into itself
				</div>
			);
		}
		if (dropStatus === "same-folder") {
			return (
				<div className="pointer-events-none flex w-max items-center gap-2 rounded-md border border-border bg-muted/95 px-3 py-1.5 text-sm font-medium text-foreground shadow-lg backdrop-blur-md corner-squircle supports-[corner-shape:squircle]:rounded-xl">
					<InfoIcon className="size-4 text-muted-foreground" />
					Already in this folder
				</div>
			);
		}
		return (
			<div className="pointer-events-none flex w-max items-center gap-2 rounded-md border border-border bg-card/80 px-3 py-1.5 text-sm font-medium text-foreground shadow-lg backdrop-blur-md corner-squircle supports-[corner-shape:squircle]:rounded-xl">
				<MoveToFolderIcon className="size-4" />
				Move {activeData.isBulk ? activeData.totalCount : 1}{" "}
				{activeData.isBulk && activeData.totalCount && activeData.totalCount > 1 ? "items" : "item"}
			</div>
		);
	}

	return (
		<div
			className="pointer-events-none relative overflow-visible rounded-xl border border-border bg-background shadow-2xl transition-all"
			style={{ width: viewMode === "grid" ? "auto" : 350 }}
		>
			{activeData.type === "folder" ? (
				viewMode === "grid" ? (
					<FolderGridCard folder={activeData.entity as Folder} isOverlay />
				) : (
					<FolderCard folder={activeData.entity as Folder} isOverlay />
				)
			) : viewMode === "grid" ? (
				<ItemGridCard item={activeData.entity as Item} isOverlay />
			) : (
				<ItemCard item={activeData.entity as Item} isOverlay />
			)}
			{activeData.isBulk && (
				<div className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-sm">
					{activeData.totalCount}
				</div>
			)}
		</div>
	);
}
