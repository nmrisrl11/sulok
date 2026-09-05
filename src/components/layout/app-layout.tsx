import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
		<TooltipProvider>
			<div className="bg-background min-h-dvh flex flex-col pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
				<div className="mx-auto w-full max-w-4xl flex flex-col flex-1">
					<Header />

					<main className="flex flex-col flex-1 gap-12 p-4 md:gap-16 md:py-6">{children}</main>
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
		</TooltipProvider>
	);
}
