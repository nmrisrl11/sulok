import { TooltipProvider } from "@/components/ui/tooltip";
import { useConfirmationStore } from "@/stores/confirmation-store";
import { useItemStore } from "@/stores/item-store";
import React, { lazy, Suspense, useState } from "react";
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
			<div className="bg-background min-h-screen flex flex-col">
				<div className="mx-auto w-full max-w-4xl flex flex-col px-4 md:px-0">
					<Header />
					<div className="py-6 pt-12 md:px-6">{children}</div>
				</div>
				{hasLoadedItemDialog && (
					<Suspense fallback={null}>
						<ItemDialog />
					</Suspense>
				)}
				{hasLoadedConfirmationDialog && (
					<Suspense fallback={null}>
						<ConfirmationDialog />
					</Suspense>
				)}
			</div>
		</TooltipProvider>
	);
}
