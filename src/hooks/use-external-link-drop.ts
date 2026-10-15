import {
	extractExternalLink,
	isExternalLinkDrag,
	type ExternalLinkData,
} from "@/lib/external-link-drag";
import { useExternalDragStore, type ExternalDropTarget } from "@/stores";
import { useCallback, type DragEvent } from "react";

export interface UseExternalLinkDropOptions {
	onDropLink: (data: ExternalLinkData) => void | Promise<void>;
	target: ExternalDropTarget;
	disabled?: boolean;
}

/**
 * Hook to handle native HTML5 external link drag-and-drop.
 * Coordinated via global ExternalDragStore to prevent clashing dropzones
 * (e.g. folder cards vs parent explorer overlay) and stuck overlay artifacts.
 */
export function useExternalLinkDrop({
	onDropLink,
	target,
	disabled = false,
}: UseExternalLinkDropOptions) {
	const isDraggingExternal = useExternalDragStore((state) => state.isDraggingExternal);
	const activeTarget = useExternalDragStore((state) => state.activeTarget);
	const setIsDraggingExternal = useExternalDragStore((state) => state.setIsDraggingExternal);
	const setActiveTarget = useExternalDragStore((state) => state.setActiveTarget);
	const clearExternalDrag = useExternalDragStore((state) => state.clearExternalDrag);

	// Determine if THIS target is actively hovered
	let isExternalOver = false;
	if (isDraggingExternal && target && activeTarget) {
		if (target.type === "folder" && activeTarget.type === "folder") {
			isExternalOver = target.id === activeTarget.id;
		} else if (target.type === "breadcrumb" && activeTarget.type === "breadcrumb") {
			isExternalOver = target.id === activeTarget.id;
		} else if (target.type === activeTarget.type) {
			isExternalOver = true;
		}
	}

	const handleDragEnter = useCallback(
		(e: DragEvent) => {
			if (disabled || !isExternalLinkDrag(e)) return;
			e.preventDefault();
			setIsDraggingExternal(true);

			if (target) {
				if (target.type === "folder" || target.type === "breadcrumb") {
					e.stopPropagation();
				}
				setActiveTarget(target);
			}
		},
		[disabled, target, setIsDraggingExternal, setActiveTarget],
	);

	const handleDragOver = useCallback(
		(e: DragEvent) => {
			if (disabled || !isExternalLinkDrag(e)) return;
			e.preventDefault();
			if (e.dataTransfer) {
				e.dataTransfer.dropEffect = "copy";
			}

			if (target) {
				if (target.type === "folder" || target.type === "breadcrumb") {
					e.stopPropagation();
				}
				if (
					!activeTarget ||
					activeTarget.type !== target.type ||
					("id" in target && "id" in activeTarget && target.id !== activeTarget.id)
				) {
					setActiveTarget(target);
				}
			}
		},
		[disabled, target, activeTarget, setActiveTarget],
	);

	const handleDragLeave = useCallback(
		(e: DragEvent) => {
			if (disabled || !isExternalLinkDrag(e)) return;
			e.preventDefault();

			// If leaving a nested folder or breadcrumb, revert active target to parent explorer
			if (target && (target.type === "folder" || target.type === "breadcrumb")) {
				e.stopPropagation();
				if (
					activeTarget &&
					activeTarget.type === target.type &&
					"id" in activeTarget &&
					activeTarget.id === target.id
				) {
					setActiveTarget({ type: "explorer" });
				}
			}
		},
		[disabled, target, activeTarget, setActiveTarget],
	);

	const handleDrop = useCallback(
		async (e: DragEvent) => {
			if (disabled || !isExternalLinkDrag(e)) return;
			e.preventDefault();
			e.stopPropagation();
			clearExternalDrag();

			if (!e.dataTransfer) return;
			const link = extractExternalLink(e.dataTransfer);
			if (!link) return;

			await onDropLink(link);
		},
		[disabled, onDropLink, clearExternalDrag],
	);

	return {
		isExternalOver,
		dragProps: {
			onDragEnter: handleDragEnter,
			onDragOver: handleDragOver,
			onDragLeave: handleDragLeave,
			onDrop: handleDrop,
		},
	};
}
