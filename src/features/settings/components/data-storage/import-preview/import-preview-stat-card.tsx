import { cn } from "@/lib/utils";
import { memo } from "react";
import type { ImportFilterStatus } from "./types";

interface ImportPreviewStatCardProps {
	filter: ImportFilterStatus;
	activeFilter: ImportFilterStatus;
	count: number;
	label: string;
	onClick: () => void;
	variant?: "primary" | "destructive";
}

export const ImportPreviewStatCard = memo(function ImportPreviewStatCard({
	filter,
	activeFilter,
	count,
	label,
	onClick,
	variant = "primary",
}: ImportPreviewStatCardProps) {
	const isActive = activeFilter === filter;
	const isDisabled = count === 0;

	return (
		<button
			type="button"
			disabled={isDisabled}
			onClick={onClick}
			className={cn(
				"group flex flex-1 flex-col rounded-lg border p-2.5 text-left transition-all corner-squircle focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none supports-[corner-shape:squircle]:rounded-xl",
				isDisabled && "cursor-default opacity-40",
				!isDisabled && "cursor-pointer",
				isActive
					? variant === "destructive"
						? "border-destructive bg-destructive/10 shadow-xs"
						: "border-primary bg-primary/10 shadow-xs"
					: !isDisabled
						? "border-border/60 bg-card hover:border-border hover:bg-muted/40"
						: "border-transparent bg-muted/20",
			)}
		>
			<span
				className={cn(
					"font-mono text-xl transition-colors",
					isActive
						? variant === "destructive"
							? "font-semibold text-destructive"
							: "font-semibold text-primary"
						: isDisabled
							? "font-medium text-muted-foreground"
							: "font-semibold text-foreground",
				)}
			>
				{count}
			</span>
			<span
				className={cn(
					"text-[10px] font-semibold tracking-wider uppercase transition-colors",
					isActive
						? variant === "destructive"
							? "font-bold text-destructive"
							: "font-bold text-primary"
						: "text-muted-foreground",
				)}
			>
				{label}
			</span>
		</button>
	);
});
