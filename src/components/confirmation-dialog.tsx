import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useConfirmationStore } from "@/stores/confirmation-store";
import { useState } from "react";

export function ConfirmationDialog() {
	const { isOpen, options, isConfirming, close, setConfirming } = useConfirmationStore();
	const [error, setError] = useState<string | null>(null);

	const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

	// Reset error when dialog opens with new options (derived state instead of effect)
	if (isOpen !== prevIsOpen) {
		setPrevIsOpen(isOpen);
		if (isOpen) {
			setError(null);
		}
	}

	if (!options) return null;

	const handleConfirm = async (e: React.MouseEvent) => {
		e.preventDefault();
		try {
			setError(null);
			setConfirming(true);
			await options.onConfirm();
			close();
		} catch (err) {
			console.error("Confirmation action failed:", err);
			setError(err instanceof Error ? err.message : "An unexpected error occurred.");
		} finally {
			setConfirming(false);
		}
	};

	const handleOpenChange = (open: boolean) => {
		if (!open && !isConfirming) {
			close();
		}
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{options.title || "Are you absolutely sure?"}</AlertDialogTitle>
					<AlertDialogDescription>
						{options.description ||
							"This action cannot be undone. This will permanently delete your data."}
					</AlertDialogDescription>
					{error && (
						<div className="bg-destructive/15 text-destructive rounded-md p-3 text-sm">{error}</div>
					)}
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isConfirming}>
						{options.cancelText || "Cancel"}
					</AlertDialogCancel>
					<AlertDialogAction
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						onClick={handleConfirm}
						disabled={isConfirming}
					>
						{isConfirming ? "Processing..." : options.confirmText || "Continue"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
