import { useLayoutEffect, useRef } from "react";

interface RelativeRect {
	left: number;
	top: number;
}

interface UseListSortAnimationProps {
	containerRef: React.RefObject<HTMLDivElement | null>;
	sortOption: string;
	folderId?: string;
}

export function useListSortAnimation({
	containerRef,
	sortOption,
	folderId,
}: UseListSortAnimationProps) {
	const lastRectsRef = useRef<Map<string, RelativeRect>>(new Map());
	const prevSortRef = useRef(sortOption);
	const prevFolderRef = useRef(folderId);

	// Primary animation effect: handles folder changes and sort animations
	useLayoutEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		// Clear cached positions if navigating to a different folder
		if (prevFolderRef.current !== folderId) {
			prevFolderRef.current = folderId;
			lastRectsRef.current.clear();
			prevSortRef.current = sortOption;
			return;
		}

		const isSortChange = prevSortRef.current !== sortOption;
		prevSortRef.current = sortOption;

		const prefersReducedMotion =
			typeof window !== "undefined" &&
			window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		if (isSortChange && !prefersReducedMotion) {
			const prevRects = lastRectsRef.current;
			const containerRect = container.getBoundingClientRect();
			const elements = container.querySelectorAll<HTMLElement>("[data-flip-id]");

			elements.forEach((el) => {
				const id = el.dataset.flipId;
				if (!id) return;

				const prevRect = prevRects.get(id);
				const elRect = el.getBoundingClientRect();
				const newRect: RelativeRect = {
					left: elRect.left - containerRect.left,
					top: elRect.top - containerRect.top,
				};

				if (prevRect) {
					const dx = prevRect.left - newRect.left;
					const dy = prevRect.top - newRect.top;

					if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
						// Cancel any existing animation on this element
						el.getAnimations().forEach((anim) => anim.cancel());

						// Elevate the parent virtual row's stacking context during glide
						const rowEl = el.closest<HTMLElement>("[data-index]");
						if (rowEl) rowEl.style.zIndex = "10";
						el.dataset.flipAnimating = "true";

						const animation = el.animate(
							[
								{
									transform: `translate3d(${dx}px, ${dy}px, 0)`,
								},
								{
									transform: "translate3d(0, 0, 0)",
								},
							],
							{
								duration: 320,
								easing: "cubic-bezier(0.16, 1, 0.3, 1)",
								fill: "none",
							},
						);

						animation.finished.finally(() => {
							delete el.dataset.flipAnimating;
							if (rowEl) rowEl.style.zIndex = "";
						});
					}
				} else {
					// Subtle presence entrance animation for items entering viewport
					el.animate(
						[
							{ opacity: 0, transform: "translate3d(0, 8px, 0)" },
							{ opacity: 1, transform: "translate3d(0, 0, 0)" },
						],
						{
							duration: 240,
							easing: "cubic-bezier(0.33, 1, 0.68, 1)",
							fill: "none",
						},
					);
				}
			});
		}
	}, [containerRef, sortOption, folderId]);

	// Separate layout effect that runs after every commit to keep snapshots current
	// relative to the container across loading, navigation, scrolling, and item changes
	useLayoutEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const containerRect = container.getBoundingClientRect();
		const nextMap = new Map<string, RelativeRect>();
		const elements = container.querySelectorAll<HTMLElement>("[data-flip-id]");

		elements.forEach((el) => {
			const id = el.dataset.flipId;
			if (!id) return;

			// If the element is currently animating, preserve its resting destination rect
			if (el.dataset.flipAnimating === "true") {
				const existing = lastRectsRef.current.get(id);
				if (existing) {
					nextMap.set(id, existing);
					return;
				}
			}

			const elRect = el.getBoundingClientRect();
			nextMap.set(id, {
				left: elRect.left - containerRect.left,
				top: elRect.top - containerRect.top,
			});
		});

		lastRectsRef.current = nextMap;
	});
}
