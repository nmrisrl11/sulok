import { SuloMascot } from "@/components/logo/sulo-mascot";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/notify";
import { itemSchema } from "@/schemas/item.schema";
import { useItemStore } from "@/stores/item-store";
import type { SuloExpression } from "@/stores/logo-store";
import { ArrowUpIcon } from "lucide-react";
import { useState } from "react";

export function QuickLinkActionBar() {
	const [url, setUrl] = useState("");
	const [isFocused, setIsFocused] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const openCreateDialog = useItemStore((state) => state.openCreateDialog);

	const urlSchema = itemSchema.shape.url;

	const getExpression = (): SuloExpression => {
		if (error) return "confused";
		if (url && isFocused) return "attentive";
		if (isFocused) return "curious";
		return "sleepy";
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!url.trim()) return;

		const result = urlSchema.safeParse(url);
		if (!result.success) {
			const errorMessage = result.error.issues[0]?.message || "Invalid URL";
			setError(errorMessage);
			notify.error("That doesn't look like a valid link.", { id: "quick-link-error" });
			return;
		}

		setError(null);
		openCreateDialog(result.data);
		setUrl("");
	};

	return (
		<form
			onSubmit={handleSubmit}
			noValidate
			className="bg-card text-card-foreground shadow-lg border border-border rounded-full supports-[corner-shape:squircle]:rounded-2xl corner-squircle p-1.5 pr-2 flex items-center gap-3 w-full max-w-md mx-auto transition-all focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background animate-in slide-in-from-bottom-10 fade-in duration-300"
		>
			<div className="w-10 h-10 shrink-0 bg-muted/30 rounded-full flex items-center justify-center relative overflow-hidden transition-colors">
				<SuloMascot expression={getExpression()} className="w-6 h-6" />
			</div>
			<input
				type="text"
				autoComplete="off"
				value={url}
				onChange={(e) => {
					setUrl(e.target.value);
					if (error) setError(null);
				}}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				placeholder="Drop a link to your corner..."
				className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground min-w-0"
				aria-label="Paste a link to preview"
			/>
			<Button
				type="submit"
				size="icon"
				variant={url.trim() ? "default" : "ghost"}
				disabled={!url.trim()}
				className="h-8 w-8 rounded-full shrink-0 transition-all duration-300"
				aria-label="Preview link"
			>
				<ArrowUpIcon className="h-4 w-4" />
			</Button>
		</form>
	);
}
