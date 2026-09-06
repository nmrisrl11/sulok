import { SuloMascot } from "@/components/logo/sulo-mascot";
import { Button } from "@/components/ui/button";
import { ItemRepository } from "@/db/repositories/item-repository";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";
import { itemSchema } from "@/schemas/item.schema";
import { useItemStore } from "@/stores/item-store";
import type { SuloExpression } from "@/stores/logo-store";
import { CornerDownLeftIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function QuickLinkActionBar() {
	const [url, setUrl] = useState("");
	const [isFocused, setIsFocused] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
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
				setIsExpanded(true);
				setTimeout(() => inputRef.current?.focus(), 50);
			}
		};

		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setIsExpanded(true);
				setTimeout(() => inputRef.current?.focus(), 50);
			}
		};

		document.addEventListener("paste", handleGlobalPaste);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("paste", handleGlobalPaste);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [error, urlSchema]);

	const getExpression = (): SuloExpression => {
		if (error) return "confused";
		if (url && isFocused) return "attentive";
		if (isFocused) return "curious";
		return "sleepy";
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!url.trim()) return;

		const result = urlSchema.safeParse(url);
		if (!result.success) {
			const errorMessage = result.error.issues[0]?.message || "Invalid URL";
			setError(errorMessage);
			notify.error("That doesn't look like a valid link.", { id: "quick-link-error" });
			return;
		}

		try {
			const existingItem = await ItemRepository.findByUrl(result.data);
			if (existingItem) {
				setError("Duplicate");
				notify.warning("This link is already in your corner.", { id: "quick-link-duplicate" });
				return;
			}
		} catch (err) {
			console.error("Duplicate check failed", err);
		}

		setError(null);
		openCreateDialog(result.data);
		setUrl("");
	};

	return (
		<form
			onSubmit={handleSubmit}
			noValidate
			role={!isExpanded ? "button" : undefined}
			tabIndex={!isExpanded ? 0 : undefined}
			aria-label={!isExpanded ? "Expand quick link bar" : undefined}
			onClick={() => {
				if (!isExpanded) {
					setIsExpanded(true);
					setTimeout(() => inputRef.current?.focus(), 50);
				}
			}}
			onKeyDown={(e) => {
				if (!isExpanded && (e.key === "Enter" || e.key === " ")) {
					e.preventDefault();
					setIsExpanded(true);
					setTimeout(() => inputRef.current?.focus(), 50);
				}
			}}
			className={cn(
				"bg-card/80 backdrop-blur-md text-card-foreground shadow-lg border border-border flex items-center gap-3 mx-auto transition-all duration-300 animate-in slide-in-from-bottom-10 fade-in",
				isExpanded
					? "rounded-full supports-[corner-shape:squircle]:rounded-2xl corner-squircle p-1.5 pr-2 w-full max-w-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
					: "rounded-full supports-[corner-shape:squircle]:rounded-2xl corner-squircle p-2 w-13 cursor-pointer hover:bg-card/90 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
			)}
		>
			<div className="w-9 h-9 shrink-0 bg-muted/30 rounded-full flex items-center justify-center relative overflow-hidden transition-colors">
				<SuloMascot expression={getExpression()} className="w-5 h-5" />
			</div>

			<div
				className={cn(
					"flex items-center gap-3 overflow-hidden transition-all duration-300 ease-in-out",
					isExpanded ? "flex-1 opacity-100 max-w-full" : "w-0 opacity-0 pointer-events-none",
				)}
			>
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
					onBlur={(e) => {
						setIsFocused(false);
						// If user clicked outside and input is empty, collapse it
						if (!e.target.value && !e.relatedTarget) {
							setIsExpanded(false);
						}
					}}
					placeholder="Drop a link to your corner..."
					className="flex-1 bg-transparent border-none outline-none text-base md:text-sm placeholder:text-muted-foreground min-w-0"
					aria-label="Paste a link to preview"
					tabIndex={isExpanded ? 0 : -1}
				/>
				{!url && !isFocused && (
					<kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border border-border/50 bg-muted/30 px-1.5 font-mono text-[10px] font-medium text-muted-foreground shrink-0 select-none pointer-events-none transition-opacity">
						{modifierKey} K
					</kbd>
				)}
				<Button
					type="submit"
					size="icon"
					variant={url.trim() ? "default" : "ghost"}
					disabled={!url.trim()}
					className="h-8 w-8 rounded-full shrink-0 transition-all duration-300"
					aria-label="Preview link"
					tabIndex={isExpanded ? 0 : -1}
				>
					<CornerDownLeftIcon className="h-4 w-4" />
				</Button>
			</div>
		</form>
	);
}
