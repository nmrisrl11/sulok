import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RotateCcwIcon, type LucideIcon } from "lucide-react";

interface ResetButtonProps {
	onClick: () => void;
	label?: string;
	icon?: LucideIcon;
	className?: string;
	disabled?: boolean;
}

export function ResetButton({
	onClick,
	label = "Reset",
	icon: Icon = RotateCcwIcon,
	className,
	disabled,
}: ResetButtonProps) {
	return (
		<Button
			type="button"
			variant="outline"
			size="sm"
			onClick={onClick}
			aria-label={label}
			disabled={disabled}
			className={cn("shrink-0 text-xs", className)}
		>
			<Icon className="h-3.5 w-3.5" />
			<span className="hidden sm:inline">{label}</span>
		</Button>
	);
}
