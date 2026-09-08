import { SuloMascot } from "@/components/logo/sulo-mascot";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SuloExpression } from "@/stores/logo-store";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export function ItemEmptyState({ disabled }: { disabled?: boolean }) {
	const [localExpression, setLocalExpression] = useState<SuloExpression>("sleepy");

	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center rounded-xl border border-dashed p-8 py-12 text-center",
				disabled && "pointer-events-none opacity-50",
			)}
		>
			<div className="mb-6 h-24 w-24">
				<SuloMascot expression={localExpression} />
			</div>
			<h3 className="text-xl font-semibold tracking-tight">It's quiet in here...</h3>
			<p className="mx-auto mt-2 mb-6 max-w-sm text-sm text-muted-foreground">
				Your corner is waiting to be filled with interesting links, articles, and ideas from across
				the web.
			</p>
			<Button
				onClick={() => document.dispatchEvent(new CustomEvent("open-quick-link"))}
				className="gap-2"
				disabled={disabled}
				onMouseEnter={() => setLocalExpression("excited")}
				onMouseLeave={() => setLocalExpression("sleepy")}
			>
				<PlusIcon className="h-4 w-4" />
				Add to your corner
			</Button>
		</div>
	);
}
