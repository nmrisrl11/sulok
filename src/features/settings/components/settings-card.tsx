import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SettingsCardProps {
	children: ReactNode;
	className?: string;
}

export function SettingsCard({ children, className }: SettingsCardProps) {
	return (
		<div
			className={cn(
				"space-y-5 rounded-xl border border-border/50 bg-card p-5 shadow-sm sm:p-6",
				"corner-squircle supports-[corner-shape:squircle]:rounded-4xl",
				className,
			)}
		>
			{children}
		</div>
	);
}
