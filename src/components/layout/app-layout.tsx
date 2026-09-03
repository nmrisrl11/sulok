import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ItemDialog } from "@/features/items/components/item-dialog";
import React from "react";
import { Header } from "./header";

export function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<TooltipProvider>
			<div className="bg-background min-h-screen flex flex-col">
				<div className="mx-auto w-full max-w-4xl flex flex-col px-4 md:px-0">
					<Header />
					<div className="py-6 pt-12 md:px-6">{children}</div>
				</div>
				<ItemDialog />
				<ConfirmationDialog />
			</div>
		</TooltipProvider>
	);
}
