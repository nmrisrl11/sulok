import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLogoStore } from "@/stores/logo-store";
import { BoxIcon, PlusIcon } from "lucide-react";

export function ItemEmptyState({ disabled }: { disabled?: boolean }) {
	const setTemporaryExpression = useLogoStore((state) => state.setTemporaryExpression);
	const clearTemporaryExpression = useLogoStore((state) => state.clearTemporaryExpression);

	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center rounded-xl border border-dashed p-8 py-12 text-center",
				disabled && "pointer-events-none opacity-50",
			)}
		>
			<div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted/50">
				<BoxIcon className="h-10 w-10 text-muted-foreground/50" />
			</div>
			<h3 className="text-xl font-semibold tracking-tight">Your corner is empty</h3>
			<p className="mx-auto mt-2 mb-6 max-w-sm text-sm text-muted-foreground">
				Start saving links, articles, and resources you find across the web to build your personal
				library.
			</p>
			<Button
				onClick={() => document.dispatchEvent(new CustomEvent("open-quick-link"))}
				className="gap-2"
				disabled={disabled}
				onMouseEnter={() => setTemporaryExpression("excited")}
				onMouseLeave={() => clearTemporaryExpression()}
			>
				<PlusIcon className="h-4 w-4" />
				Save your first item
			</Button>
		</div>
	);
}
