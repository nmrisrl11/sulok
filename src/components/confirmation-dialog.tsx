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

export function ConfirmationDialog() {
	const { isOpen, options, isConfirming, close, setConfirming } = useConfirmationStore();

	if (!options) return null;

	const handleConfirm = async (e: React.MouseEvent) => {
		e.preventDefault();
		try {
			setConfirming(true);
			await options.onConfirm();
		} catch (error) {
			console.error("Confirmation action failed:", error);
		} finally {
			setConfirming(false);
			close();
		}
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={close}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{options.title || "Are you absolutely sure?"}</AlertDialogTitle>
					<AlertDialogDescription>
						{options.description ||
							"This action cannot be undone. This will permanently delete your data."}
					</AlertDialogDescription>
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
