import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";
import { memo, useEffect, useRef, type ComponentProps } from "react";

export interface NomiBotProps extends Omit<ComponentProps<typeof motion.svg>, "children"> {
	/** Triggers the animation sequence (e.g., pass true when a parent container is hovered) */
	isHovered?: boolean;
	/** Whether to render the body of the bot */
	showBody?: boolean;
	/** Whether the head bounces during the animation */
	headBounce?: boolean;
	/** Type of eye expression/animation */
	eyeAnimation?: "blink" | "wink" | "look-left" | "look-right" | "look-around" | "none";
}

/**
 * NomiBot - A reusable, plug-and-play animated AI mascot component.
 * Created by Nomer Israel (nmrisrl.dev).
 *
 * Features built-in physics-based animations via Framer Motion.
 * Supports isolated head and body rendering, and distinct expressive eye animations.
 */
export const NomiBot = memo(function NomiBot({
	isHovered,
	showBody = true,
	headBounce = true,
	eyeAnimation = "blink",
	className,
	...props
}: NomiBotProps) {
	const headControls = useAnimation();
	const bodyControls = useAnimation();
	const leftEyeControls = useAnimation();
	const rightEyeControls = useAnimation();
	const isAnimating = useRef(false);

	useEffect(() => {
		if (isHovered && !isAnimating.current) {
			const playAnimation = async () => {
				isAnimating.current = true;
				const animations: Promise<void>[] = [];

				if (showBody && headBounce) {
					// Body moves up to collide with head
					animations.push(
						bodyControls.start({
							y: [0, -1.5, 0],
							transition: { duration: 0.3, ease: "easeOut" as const },
						}),
					);
				}

				if (headBounce) {
					// Head reacts to collision, bounces up, and settles
					animations.push(
						headControls.start({
							y: [0, -1, -6, 0],
							transition: { duration: 0.5, times: [0, 0.15, 0.5, 1], ease: "easeInOut" as const },
						}),
					);
				}

				// Eye Expressions
				if (eyeAnimation === "blink") {
					const blinkSequence = {
						scaleY: [1, 1, 0.1, 1, 1],
						transition: { duration: 0.5, times: [0, 0.3, 0.5, 0.7, 1], ease: "easeInOut" as const },
					};
					animations.push(leftEyeControls.start(blinkSequence));
					animations.push(rightEyeControls.start(blinkSequence));
				} else if (eyeAnimation === "wink") {
					animations.push(
						leftEyeControls.start({
							scaleY: [1, 1, 0.1, 1, 1],
							transition: {
								duration: 0.5,
								times: [0, 0.3, 0.5, 0.7, 1],
								ease: "easeInOut" as const,
							},
						}),
					);
				} else if (eyeAnimation === "look-left") {
					const shiftSequence = {
						x: [0, -1.5, -1.5, 0],
						transition: { duration: 0.6, times: [0, 0.2, 0.8, 1], ease: "easeInOut" as const },
					};
					animations.push(leftEyeControls.start(shiftSequence));
					animations.push(rightEyeControls.start(shiftSequence));
				} else if (eyeAnimation === "look-right") {
					const shiftSequence = {
						x: [0, 1.5, 1.5, 0],
						transition: { duration: 0.6, times: [0, 0.2, 0.8, 1], ease: "easeInOut" as const },
					};
					animations.push(leftEyeControls.start(shiftSequence));
					animations.push(rightEyeControls.start(shiftSequence));
				} else if (eyeAnimation === "look-around") {
					const lookAroundSequence = {
						x: [0, -1.5, 1.5, 0],
						transition: { duration: 0.8, times: [0, 0.2, 0.6, 1], ease: "easeInOut" as const },
					};
					animations.push(leftEyeControls.start(lookAroundSequence));
					animations.push(rightEyeControls.start(lookAroundSequence));
				}

				if (animations.length > 0) {
					await Promise.all(animations);
				}

				isAnimating.current = false;
			};

			playAnimation();
		}
	}, [
		isHovered,
		showBody,
		headBounce,
		eyeAnimation,
		headControls,
		bodyControls,
		leftEyeControls,
		rightEyeControls,
	]);

	return (
		<motion.svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			overflow="visible"
			className={cn("overflow-visible", className)}
			{...props}
		>
			<g transform={showBody ? undefined : "translate(0, 4.5)"}>
				<motion.g animate={headControls}>
					{/* Head & Screen Hole */}
					<path d="M22,7.5v2c0,.827-.673,1.5-1.5,1.5h-.5c0,2.206-1.794,4-4,4h-8c-2.206,0-4-1.794-4-4h-.5c-.827,0-1.5-.673-1.5-1.5v-2c0-.827.673-1.5,1.5-1.5h.5c0-2.206,1.794-4,4-4h3v-1c0-.553.448-1,1-1s1,.447,1,1v1h3c2.206,0,4,1.794,4,4h.5c.827,0,1.5.673,1.5,1.5ZM18,6c0-1.103-.897-2-2-2h-8c-1.103,0-2,.897-2,2v5c0,1.103.897,2,2,2h8c1.103,0,2-.897,2-2v-5Z" />

					{/* Left Eye */}
					<motion.path
						animate={leftEyeControls}
						style={{ transformOrigin: "9.5px 8.5px" }}
						d="M9.5,7c-.828,0-1.5.672-1.5,1.5s.672,1.5,1.5,1.5,1.5-.672,1.5-1.5-.672-1.5-1.5-1.5Z"
					/>

					{/* Right Eye */}
					<motion.path
						animate={rightEyeControls}
						style={{ transformOrigin: "14.5px 8.5px" }}
						d="M14.5,7c-.828,0-1.5.672-1.5,1.5s.672,1.5,1.5,1.5,1.5-.672,1.5-1.5-.672-1.5-1.5-1.5Z"
					/>
				</motion.g>
			</g>

			{showBody && (
				<motion.path
					animate={bodyControls}
					d="M21,23c0,.553-.448,1-1,1s-1-.447-1-1c0-2.206-1.794-4-4-4h-6c-2.206,0-4,1.794-4,4,0,.553-.448,1-1,1s-1-.447-1-1c0-3.309,2.691-6,6-6h6c3.309,0,6,2.691,6,6Z"
				/>
			)}
		</motion.svg>
	);
});
