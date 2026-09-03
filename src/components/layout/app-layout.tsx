import { Header } from "./header";
import { MainContent } from "./main-content";
import { BookmarkDialog } from "@/features/links/components/bookmark-dialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConfirmationDialog } from "@/components/confirmation-dialog";

export function AppLayout() {
	return (
		<TooltipProvider>
			<div className="bg-background min-h-screen flex flex-col font-geist">
				<div className="mx-auto w-full max-w-3xl flex flex-col">
					<Header />
					<div className="p-6 pt-12">
						<MainContent />
					</div>
				</div>
				<BookmarkDialog />
				<ConfirmationDialog />
			</div>
		</TooltipProvider>
	);
}
