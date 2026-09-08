import { QuickLinkActionBar } from "@/features/items/components/quick-link-action-bar";
import { useItemStore } from "@/stores/item-store";
import { lazy, Suspense, useEffect, useRef } from "react";

const BulkActionBar = lazy(() =>
	import("@/features/items/components/bulk-action-bar").then((m) => ({ default: m.BulkActionBar })),
);

export function BottomActionSystem() {
	const selectedIds = useItemStore((state) => state.selectedIds);
	const isSelectionMode = selectedIds.length > 0;
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const height = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
				document.documentElement.style.setProperty("--bottom-action-height", `${height}px`);
			}
		});

		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={containerRef}
			className="pointer-events-none fixed right-0 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-0 z-50 flex w-full flex-col items-center px-4 md:bottom-6"
		>
			<div className="pointer-events-auto flex w-full max-w-md justify-center">
				{isSelectionMode ? (
					<Suspense fallback={null}>
						<BulkActionBar />
					</Suspense>
				) : (
					<QuickLinkActionBar />
				)}
			</div>
		</div>
	);
}
