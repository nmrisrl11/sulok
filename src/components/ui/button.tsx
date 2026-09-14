import { type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { type ComponentProps } from "react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./button-variants";

function Button({
	className,
	variant = "default",
	size = "default",
	asChild = false,
	...props
}: ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot.Root : "button";

	return (
		<Comp
			data-slot="button"
			data-variant={variant}
			data-size={size}
			className={cn(
				"rounded-md corner-squircle supports-[corner-shape:squircle]:rounded-xl",
				buttonVariants({ variant, size, className }),
			)}
			{...props}
		/>
	);
}

export { Button };
