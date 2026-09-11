import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RotateCcwIcon, type LucideIcon } from "lucide-react";

interface ResetButtonProps {
	onClick: () => void;
	label?: string;
	icon?: LucideIcon;
	className?: string;
}

export function ResetButton({
	onClick,
	label = "Reset",
	icon: Icon = RotateCcwIcon,
	className,
}: ResetButtonProps) {
	return (
		<Button
			type="button"
			variant="outline"
			size="sm"
			onClick={onClick}
			className={cn("shrink-0 text-xs", className)}
		>
			<Icon className="h-3.5 w-3.5" data-icon="inline-start" />
			<span className="hidden sm:inline">{label}</span>
		</Button>
	);
}
