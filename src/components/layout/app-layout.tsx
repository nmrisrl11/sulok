import { Toaster } from "@/components/ui/toaster";

import { useConfirmationStore } from "@/stores/confirmation-store";
import { useItemStore } from "@/stores/item-store";
import React, { lazy, Suspense, useState } from "react";
import { ErrorBoundary } from "../error-boundary";
import { BottomActionSystem } from "./bottom-action-system";
import { Header } from "./header";

const ItemDialog = lazy(() =>
	import("@/features/items/components/item-dialog").then((m) => ({ default: m.ItemDialog })),
);
const ConfirmationDialog = lazy(() =>
	import("@/components/confirmation-dialog").then((m) => ({
		default: m.ConfirmationDialog,
	})),
);

export function AppLayout({ children }: { children: React.ReactNode }) {
	const isItemDialogOpen = useItemStore((state) => state.isDialogOpen);
	const isConfirmationDialogOpen = useConfirmationStore((state) => state.isOpen);

	const [hasLoadedItemDialog, setHasLoadedItemDialog] = useState(isItemDialogOpen);
	const [hasLoadedConfirmationDialog, setHasLoadedConfirmationDialog] =
		useState(isConfirmationDialogOpen);

	if (isItemDialogOpen && !hasLoadedItemDialog) {
		setHasLoadedItemDialog(true);
	}

	if (isConfirmationDialogOpen && !hasLoadedConfirmationDialog) {
		setHasLoadedConfirmationDialog(true);
	}

	return (
		<div className="flex min-h-dvh flex-col bg-background pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
			<div className="mx-auto flex w-full max-w-4xl flex-1 flex-col">
				<Header />

				<main className="flex flex-1 flex-col gap-12 p-4 md:gap-16 md:py-6">{children}</main>
			</div>
			{hasLoadedItemDialog && (
				<ErrorBoundary>
					<Suspense fallback={null}>
						<ItemDialog />
					</Suspense>
				</ErrorBoundary>
			)}
			{hasLoadedConfirmationDialog && (
				<ErrorBoundary>
					<Suspense fallback={null}>
						<ConfirmationDialog />
					</Suspense>
				</ErrorBoundary>
			)}
			<BottomActionSystem />
			<Toaster />
		</div>
	);
}
