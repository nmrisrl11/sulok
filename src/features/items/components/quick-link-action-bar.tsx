import { SuloMascot } from "@/components/logo/sulo-mascot";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/notify";
import { itemSchema } from "@/schemas/item.schema";
import { useItemStore } from "@/stores/item-store";
import type { SuloExpression } from "@/stores/logo-store";
import { CornerDownLeftIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function QuickLinkActionBar() {
	const [url, setUrl] = useState("");
	const [isFocused, setIsFocused] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const openCreateDialog = useItemStore((state) => state.openCreateDialog);
	const inputRef = useRef<HTMLInputElement>(null);

	const isMac =
		typeof navigator !== "undefined" && /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
	const modifierKey = isMac ? "⌘" : "Ctrl";

	const urlSchema = itemSchema.shape.url;

	useEffect(() => {
		const handleGlobalPaste = (e: ClipboardEvent) => {
			const target = e.target as HTMLElement;
			// Ignore if user is already focused on an input or textarea
			if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
				return;
			}

			const text = e.clipboardData?.getData("text")?.trim();
			if (!text) return;

			const result = urlSchema.safeParse(text);
			if (result.success) {
				e.preventDefault();
				setUrl(text);
				if (error) setError(null);
				inputRef.current?.focus();
			}
		};

		document.addEventListener("paste", handleGlobalPaste);
		return () => {
			document.removeEventListener("paste", handleGlobalPaste);
		};
	}, [error, urlSchema]);

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
			className="bg-card/80 backdrop-blur-md text-card-foreground shadow-lg border border-border rounded-full supports-[corner-shape:squircle]:rounded-2xl corner-squircle p-1.5 pr-2 flex items-center gap-3 w-full max-w-md mx-auto transition-all focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background animate-in slide-in-from-bottom-10 fade-in duration-300"
		>
			<div className="w-10 h-10 shrink-0 bg-muted/30 rounded-full flex items-center justify-center relative overflow-hidden transition-colors">
				<SuloMascot expression={getExpression()} className="w-6 h-6" />
			</div>
			<input
				ref={inputRef}
				id="quick-link-input"
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
				className="flex-1 bg-transparent border-none outline-none text-base md:text-sm placeholder:text-muted-foreground min-w-0"
				aria-label="Paste a link to preview"
			/>
			{!url && !isFocused && (
				<kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border border-border/50 bg-muted/30 px-1.5 font-mono text-[10px] font-medium text-muted-foreground shrink-0 select-none pointer-events-none transition-opacity">
					{modifierKey} V
				</kbd>
			)}
			<Button
				type="submit"
				size="icon"
				variant={url.trim() ? "default" : "ghost"}
				disabled={!url.trim()}
				className="h-8 w-8 rounded-full shrink-0 transition-all duration-300"
				aria-label="Preview link"
			>
				<CornerDownLeftIcon className="h-4 w-4" />
			</Button>
		</form>
	);
}
