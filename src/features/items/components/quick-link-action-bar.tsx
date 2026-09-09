import { SuloMascot } from "@/components/logo/sulo-mascot";
import { Button } from "@/components/ui/button";
import { ItemRepository } from "@/db/repositories/item-repository";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";
import { itemSchema } from "@/schemas/item.schema";
import { useItemStore } from "@/stores/item-store";
import type { SuloExpression } from "@/stores/logo-store";
import { useSettingsStore } from "@/stores/settings-store";
import { CornerDownLeftIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function QuickLinkActionBar() {
	const [url, setUrl] = useState("");
	const [isFocused, setIsFocused] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const openCreateDialog = useItemStore((state) => state.openCreateDialog);
	const defaultExpression = useSettingsStore(
		(state) => state.settings.suloSettings.expressionQuickAction,
	);
	const inputRef = useRef<HTMLInputElement>(null);

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

		const handleOpenQuickLink = () => {
			setIsExpanded(true);
			setTimeout(() => inputRef.current?.focus(), 50);
		};

		document.addEventListener("paste", handleGlobalPaste);
		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("open-quick-link", handleOpenQuickLink);
		return () => {
			document.removeEventListener("paste", handleGlobalPaste);
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("open-quick-link", handleOpenQuickLink);
		};
	}, [error, urlSchema]);

	const getExpression = (): SuloExpression => {
		if (error) return "confused";
		if (url && isFocused) return "attentive";
		if (isFocused) return "curious";
		return defaultExpression;
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
		setIsExpanded(false);
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
				"mx-auto flex animate-in items-center gap-3 border border-border bg-card/80 text-card-foreground shadow-lg backdrop-blur-md transition-all duration-300 slide-in-from-bottom-10 fade-in",
				isExpanded
					? "w-full max-w-md rounded-full p-1.5 pr-2 corner-squircle focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background supports-[corner-shape:squircle]:rounded-2xl"
					: "w-13 cursor-pointer rounded-full p-2 corner-squircle hover:scale-105 hover:bg-card/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none supports-[corner-shape:squircle]:rounded-2xl",
			)}
		>
			<div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted/30 transition-colors">
				<SuloMascot expression={getExpression()} className="h-5 w-5" />
			</div>

			<div
				className={cn(
					"flex items-center gap-3 overflow-hidden transition-all duration-300 ease-in-out",
					isExpanded ? "max-w-full flex-1 opacity-100" : "pointer-events-none w-0 opacity-0",
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
					className="min-w-0 flex-1 border-none bg-transparent text-base outline-none placeholder:text-muted-foreground md:text-sm"
					aria-label="Paste a link to preview"
					tabIndex={isExpanded ? 0 : -1}
				/>
				<Button
					type="submit"
					size="icon"
					variant={url.trim() ? "default" : "ghost"}
					disabled={!url.trim()}
					className="h-8 w-8 shrink-0 rounded-full transition-all duration-300"
					aria-label="Preview link"
					tabIndex={isExpanded ? 0 : -1}
				>
					<CornerDownLeftIcon className="h-4 w-4" />
				</Button>
			</div>
		</form>
	);
}
