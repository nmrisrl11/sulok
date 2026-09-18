import { Button } from "@/components/ui/button";
import { type TooltipRenderProps } from "react-joyride";

export function CustomTooltip({
	index,
	isLastStep,
	step,
	backProps,
	skipProps,
	primaryProps,
	tooltipProps,
	size,
}: TooltipRenderProps) {
	return (
		<div
			{...tooltipProps}
			className="flex max-w-sm flex-col gap-4 rounded-xl border bg-card p-5 text-card-foreground shadow-2xl"
		>
			<div className="flex flex-col gap-2">
				{step.title && (
					<h3 className="font-heading text-xl font-bold text-card-foreground">{step.title}</h3>
				)}
				<div className="text-sm leading-relaxed text-muted-foreground">{step.content}</div>
			</div>

			<div className="mt-2 flex items-center justify-between">
				<div className="text-xs font-medium text-muted-foreground">
					{index + 1} of {size}
				</div>
				<div className="flex items-center gap-2">
					{!isLastStep && (
						<Button variant="ghost" size="sm" {...skipProps}>
							Skip
						</Button>
					)}
					{!isLastStep && <div className="h-4 w-px bg-border/50" />}
					{index > 0 && (
						<Button variant="ghost" size="sm" {...backProps}>
							Back
						</Button>
					)}
					<Button variant="default" size="sm" {...primaryProps}>
						{isLastStep ? "Finish" : "Next"}
					</Button>
				</div>
			</div>
		</div>
	);
}
