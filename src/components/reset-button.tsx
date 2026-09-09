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
			className={cn("w-full shrink-0 gap-2 sm:w-auto", className)}
		>
			<Icon className="h-3.5 w-3.5" />
			{label}
		</Button>
	);
}
