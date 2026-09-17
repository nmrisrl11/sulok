import { Toaster } from "@/components/ui/toaster";
import {
	useConfirmationStore,
	useFolderStore,
	useItemStore,
	useMoveStore,
	useUIStore,
} from "@/stores";
import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { ErrorBoundary } from "../error-boundary";
import { BottomActionSystem } from "./bottom-action-system";
import { Header } from "./header";
import { QuickCustomizeSheet } from "./quick-customize-sheet";

const ItemDialog = lazy(() =>
	import("@/features/items/components/item-dialog").then((m) => ({ default: m.ItemDialog })),
);
const ConfirmationDialog = lazy(() =>
	import("@/components/confirmation-dialog").then((m) => ({
		default: m.ConfirmationDialog,
	})),
);
const FolderDialog = lazy(() =>
	import("@/features/folders/components/folder-dialog").then((m) => ({
		default: m.FolderDialog,
	})),
);
const MoveDialog = lazy(() =>
	import("@/features/items/components/move-dialog").then((m) => ({
		default: m.MoveDialog,
	})),
);

function GlobalDialogs() {
	const isItemDialogOpen = useItemStore((state) => state.isDialogOpen);
	const isFolderDialogOpen = useFolderStore((state) => state.isDialogOpen);
	const isConfirmationDialogOpen = useConfirmationStore((state) => state.isOpen);
	const isMoveDialogOpen = useMoveStore((state) => state.isOpen);

	const [hasLoadedItemDialog, setHasLoadedItemDialog] = useState(isItemDialogOpen);
	const [hasLoadedFolderDialog, setHasLoadedFolderDialog] = useState(isFolderDialogOpen);
	const [hasLoadedMoveDialog, setHasLoadedMoveDialog] = useState(isMoveDialogOpen);
	const [hasLoadedConfirmationDialog, setHasLoadedConfirmationDialog] =
		useState(isConfirmationDialogOpen);

	if (isItemDialogOpen && !hasLoadedItemDialog) {
		setHasLoadedItemDialog(true);
	}

	if (isFolderDialogOpen && !hasLoadedFolderDialog) {
		setHasLoadedFolderDialog(true);
	}

	if (isConfirmationDialogOpen && !hasLoadedConfirmationDialog) {
		setHasLoadedConfirmationDialog(true);
	}

	if (isMoveDialogOpen && !hasLoadedMoveDialog) {
		setHasLoadedMoveDialog(true);
	}

	return (
		<>
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
			{hasLoadedFolderDialog && (
				<ErrorBoundary>
					<Suspense fallback={null}>
						<FolderDialog />
					</Suspense>
				</ErrorBoundary>
			)}
			{hasLoadedMoveDialog && (
				<ErrorBoundary>
					<Suspense fallback={null}>
						<MoveDialog />
					</Suspense>
				</ErrorBoundary>
			)}
		</>
	);
}

export function AppLayout({ children }: { children: ReactNode }) {
	const toggleQuickCustomize = useUIStore((state) => state.toggleQuickCustomize);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key.toLowerCase() === "c" && e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
				// Don't trigger if user is typing in an input
				if (
					e.target instanceof HTMLInputElement ||
					e.target instanceof HTMLTextAreaElement ||
					(e.target instanceof HTMLElement && e.target.isContentEditable)
				)
					return;
				e.preventDefault();
				toggleQuickCustomize();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [toggleQuickCustomize]);

	return (
		<div className="flex min-h-dvh flex-col bg-background pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
			<div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
				<Header />

				<main className="flex flex-col gap-12 p-4 md:gap-16 md:py-6">{children}</main>
			</div>
			<GlobalDialogs />
			<BottomActionSystem />
			<QuickCustomizeSheet />
			<Toaster />
		</div>
	);
}
