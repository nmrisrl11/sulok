import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

export function FolderIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 64 64"
			xmlns="http://www.w3.org/2000/svg"
			className={cn("h-4 w-4", className)}
			{...props}
		>
			<g>
				<path
					d="m59.61 10.69h-29.43c-1.2 0-2.35-.49-3.18-1.36l-3.76-3.94c-.83-.87-1.98-1.36-3.18-1.36h-15.67c-2.43 0-4.39 1.96-4.39 4.38v41.88c0 2.42 1.96 4.39 4.39 4.39h55.22c2.42 0 4.39-1.96 4.39-4.39v-35.21c0-2.42-1.96-4.39-4.39-4.39z"
					fill="var(--folder-color-back, #56b2e3)"
				/>
				<path
					d="m57.26 15.07h-50.52c-1.83 0-3.32 1.49-3.32 3.32v33.48c0 1.84 1.49 3.32 3.32 3.32h50.52c1.83 0 3.32-1.49 3.32-3.32v-33.47c0-1.84-1.48-3.33-3.32-3.33z"
					fill="var(--folder-color-paper, #ffffff)"
				/>
				<path
					d="m59.61 20.42h-55.22c-2.43 0-4.39 1.96-4.39 4.39v30.78c0 2.42 1.96 4.39 4.39 4.39h55.22c2.42 0 4.39-1.96 4.39-4.39v-30.78c0-2.43-1.96-4.39-4.39-4.39z"
					fill="var(--folder-color-front, #98cfef)"
				/>
			</g>
		</svg>
	);
}
