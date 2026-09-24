import { ResetButton } from "@/components/reset-button";
import { useTheme, useThemeDispatch, type Theme } from "@/hooks";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

const WORKSPACE_THEMES = [
	{
		id: "system",
		label: "System",
		bg: "linear-gradient(135deg, #f7f5f0 50%, #1e1b18 50%)",
		fg: "#888",
		type: "system",
	},
	{ id: "light", label: "Cream", bg: "#f7f5f0", fg: "#1e1b18", type: "light" },
	{ id: "sepia", label: "Sepia", bg: "#F4ECD8", fg: "#4A3C31", type: "light" },
	{ id: "sand", label: "Sand", bg: "#EAE6DF", fg: "#45423E", type: "light" },
	{ id: "dark", label: "Charcoal", bg: "#1e1b18", fg: "#f7f5f0", type: "dark" },
	{ id: "midnight", label: "Midnight", bg: "#0B1120", fg: "#F8FAFC", type: "dark" },
	{ id: "mocha", label: "Mocha", bg: "#241C18", fg: "#F5EFEB", type: "dark" },
] as const;

export function WorkspaceThemeControl({
	variant = "default",
}: { variant?: "default" | "compact" } = {}) {
	const { theme, setTheme } = useTheme();

	return (
		<div
			className={cn(
				variant === "default"
					? "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
					: "grid grid-cols-6 gap-2",
			)}
		>
			{WORKSPACE_THEMES.map((t) => (
				<button
					key={t.id}
					type="button"
					onClick={() => setTheme(t.id as Theme)}
					aria-label={variant === "compact" ? t.label : undefined}
					className={cn(
						"group flex min-w-0 items-center rounded-xl text-left transition-all hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none supports-[corner-shape:squircle]:rounded-2xl supports-[corner-shape:squircle]:corner-squircle",
						variant === "default"
							? "gap-2 p-2 pr-3 sm:gap-3 sm:pr-4"
							: "aspect-square w-full justify-center p-1",
						theme === t.id
							? "bg-background text-foreground shadow-engraved"
							: "border bg-muted/20 not-first:border-border/40",
					)}
				>
					<div
						className={cn(
							"flex shrink-0 items-center justify-center rounded-lg ring-1 transition-transform group-hover:scale-105 supports-[corner-shape:squircle]:rounded-xl supports-[corner-shape:squircle]:corner-squircle",
							variant === "default" ? "h-8 w-8 sm:h-9 sm:w-9" : "h-full w-full",
							theme === t.id ? "ring-primary/50" : "ring-border/50 hover:ring-border",
						)}
						style={{ background: t.bg }}
					>
						{theme === t.id && (
							<CheckIcon className="h-4 w-4 drop-shadow-sm sm:h-5 sm:w-5" style={{ color: t.fg }} />
						)}
					</div>
					{variant === "default" && (
						<span
							className={cn(
								"truncate text-sm font-medium transition-colors",
								theme === t.id
									? "text-foreground"
									: "text-muted-foreground group-hover:text-foreground",
							)}
						>
							{t.label}
						</span>
					)}
				</button>
			))}
		</div>
	);
}

export function WorkspaceThemeSetting() {
	const setTheme = useThemeDispatch();
	const handleReset = () => setTheme("system");

	return (
		<div className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:py-6 sm:first:pt-0 sm:last:pb-0">
			<div className="space-y-1">
				<div className="flex items-center justify-between gap-4">
					<h3 className="text-sm font-medium text-foreground">Workspace Theme</h3>
					<ResetButton onClick={handleReset} />
				</div>
				<p className="w-full text-sm text-muted-foreground sm:max-w-md">
					Select a curated lighting environment for your workspace.
				</p>
			</div>
			<div className="pt-2">
				<WorkspaceThemeControl />
			</div>
		</div>
	);
}
