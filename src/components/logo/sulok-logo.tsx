import { APP_INFO } from "@/constants/app-info";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useLogoStore } from "@/stores/logo-store";
import { combine } from "flubber";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { BASE_BODY_PATH, SuloMascot } from "./sulo-mascot";

// The paths of "Sulok" from the text logo, split into independent subpaths for flawless morphing
const SULOK_PATHS = [
	"M32.33,92a29.93,29.93,0,0,1-8.13-1,22.49,22.49,0,0,1-5.38-2.19c-1.38-.82-2.5-1.54-3.36-2.15a4,4,0,0,0-2.1-.92,3.4,3.4,0,0,0-2,.86c-.75.58-1.55,1.25-2.39,2a20.11,20.11,0,0,1-2.56,2,4.63,4.63,0,0,1-2.61.87,3.87,3.87,0,0,1-3-1.07A4.45,4.45,0,0,1,0,87.07L2.44,66.9a6.43,6.43,0,0,1,1.29-3.83,3.68,3.68,0,0,1,2.91-1.29,3.58,3.58,0,0,1,2.73,1.15,13.36,13.36,0,0,1,2.09,3.45l1.61,6.67a14.63,14.63,0,0,0,5.55,8.65,15.79,15.79,0,0,0,9.46,3,13.36,13.36,0,0,0,5.46-1.06,9.14,9.14,0,0,0,3.76-3,11.22,11.22,0,0,0,1.87-4.69,12.22,12.22,0,0,0-1.81-8.79q-2.62-4.2-10.2-8.68-8.81-5.34-12.48-11.24a20.83,20.83,0,0,1-2.76-13.82,26,26,0,0,1,4.75-12.41,28.07,28.07,0,0,1,11.18-9.06Q35,8.44,45.26,8.44q9,0,15,2.82a21.83,21.83,0,0,1,9.11,7.27,15,15,0,0,1,2.82,9.34A10.6,10.6,0,0,1,70,34.19a6.71,6.71,0,0,1-5.57,2.53,6.85,6.85,0,0,1-4.69-1.58,12.57,12.57,0,0,1-3.13-5.37L55.38,25a14.4,14.4,0,0,0-4.31-7.5,10.55,10.55,0,0,0-7-2.45,12.85,12.85,0,0,0-6.29,1.47,11.73,11.73,0,0,0-4.28,4,13.86,13.86,0,0,0-2.07,5.61,13.09,13.09,0,0,0,1.92,9.05Q36,39.31,43.13,44A58.8,58.8,0,0,1,54.49,53a22.43,22.43,0,0,1,5.23,8.68,23.62,23.62,0,0,1,.71,9.45A20.55,20.55,0,0,1,56.12,82a24.69,24.69,0,0,1-9.8,7.35A34.67,34.67,0,0,1,32.33,92Z",
	"M135.1,76.21a2,2,0,0,1,1,1.84,7.46,7.46,0,0,1-1,3.39,19,19,0,0,1-7.73,7.76,24.15,24.15,0,0,1-12,2.93,10.93,10.93,0,0,1-6.59-1.72,5.91,5.91,0,0,1-2.32-5.06,12.88,12.88,0,0,1,.89-4.4q.89-2.45,2.18-5.29t2.65-6.12a42,42,0,0,0,2.15-6.9l1.38,1.15a58.53,58.53,0,0,1-7.1,13.51A41.74,41.74,0,0,1,100.24,86a30,30,0,0,1-8.68,4.68,26.4,26.4,0,0,1-8.13,1.41q-5.3,0-7.82-2.33A8.65,8.65,0,0,1,73,83.36a27.07,27.07,0,0,1,1.79-9.51l6.32-18c1-2.76,1.36-4.67,1.09-5.75s-.84-1.61-1.72-1.61a3.61,3.61,0,0,0-1.5.38,8.58,8.58,0,0,0-2,1.41,5.49,5.49,0,0,1-2,1.23,2.43,2.43,0,0,1-1.61-.14,2,2,0,0,1-1-1.84,7.33,7.33,0,0,1,1-3.39A19,19,0,0,1,81,38.39a23.34,23.34,0,0,1,11.84-2.93q5.06,0,7.47,2a7.47,7.47,0,0,1,2.59,5.69,22.51,22.51,0,0,1-1.67,8.68L94.86,70q-1.6,4.43-1.17,6.5c.28,1.38,1.27,2.07,3,2.07a8,8,0,0,0,3.93-1.21,19.62,19.62,0,0,0,4.26-3.45A31.68,31.68,0,0,0,109,68.42,42.52,42.52,0,0,0,112.51,61c.77-2,1.39-3.72,1.87-5.18s.84-2.7,1.09-3.73a11.59,11.59,0,0,0,.37-2.65,8.1,8.1,0,0,0-.6-3.19,8.23,8.23,0,0,1-.6-3.25c0-2.29,1.38-4.13,4.16-5.51s6.64-2.07,11.58-2.07q5.46,0,6.62,3.56t-1.27,10L127.4,71.73c-1,2.72-1.35,4.62-1.07,5.71s.86,1.64,1.7,1.64a3.26,3.26,0,0,0,1.52-.4,11.29,11.29,0,0,0,1.93-1.38,5.78,5.78,0,0,1,2-1.26A2.13,2.13,0,0,1,135.1,76.21Z",
	"M181.54,24.31,167,71.38q-1.44,4.43-1,6A1.81,1.81,0,0,0,167.8,79a4.64,4.64,0,0,0,2.1-.55,9,9,0,0,0,2.21-1.7,5.91,5.91,0,0,1,2-1.17,2.28,2.28,0,0,1,1.55.14,2,2,0,0,1,1,1.78,6.69,6.69,0,0,1-.92,3.39,17,17,0,0,1-4.57,5.81,22.53,22.53,0,0,1-7.07,4,26.15,26.15,0,0,1-8.82,1.44q-5.11,0-7.5-2a7.44,7.44,0,0,1-2.53-5.72,26.83,26.83,0,0,1,1.52-9l14.6-47.19c.89-2.79,1.2-4.72.95-5.77s-.79-1.58-1.64-1.58a3.5,3.5,0,0,0-1.52.37,8.76,8.76,0,0,0-1.92,1.41,6,6,0,0,1-2.07,1.23,2.27,2.27,0,0,1-1.56-.14,2,2,0,0,1-1-1.84,7.15,7.15,0,0,1,1-3.39A18.26,18.26,0,0,1,158.14,13a22.08,22.08,0,0,1,6.64-3.73A24.28,24.28,0,0,1,173,7.87c3.37,0,5.86.67,7.45,2A7.41,7.41,0,0,1,183,15.57,26.07,26.07,0,0,1,181.54,24.31Z",
	"M220.11,35.4q9.07.06,15.28,3.56a19.87,19.87,0,0,1,8.86,9.95q2.64,6.44,1,15.23a35.8,35.8,0,0,1-4.28,11.67,32.28,32.28,0,0,1-7.64,8.88,33.21,33.21,0,0,1-10.41,5.57,38.71,38.71,0,0,1-12.61,1.87q-9-.06-15.18-3.59a19.84,19.84,0,0,1-8.76-10q-2.62-6.45-1-15.18a37.35,37.35,0,0,1,4.28-11.7,32,32,0,0,1,7.59-8.88,33.14,33.14,0,0,1,10.38-5.6A37.49,37.49,0,0,1,220.11,35.4Z",
	"M265.11,22.5c-.23-1.06-.77-1.58-1.61-1.58a3.43,3.43,0,0,0-1.52.37,9,9,0,0,0-1.93,1.41A5.79,5.79,0,0,1,258,23.93a2.24,2.24,0,0,1-1.55-.14,1.93,1.93,0,0,1-1-1.84,7.66,7.66,0,0,1,1-3.39A19.18,19.18,0,0,1,261,13a21.37,21.37,0,0,1,6.55-3.73,23.9,23.9,0,0,1,8.17-1.35A12.51,12.51,0,0,1,281.49,9a6.23,6.23,0,0,1,3,3.25,11.8,11.8,0,0,1,.66,5.17,36.58,36.58,0,0,1-1.23,6.9l-8.63,31.38-2.93,1.72a30.67,30.67,0,0,1,4.14-9.28,27.48,27.48,0,0,1,6.64-7,28.76,28.76,0,0,1,8.59-4.31,32.38,32.38,0,0,1,10.06-1.41q7,.1,10.43,3.39t2.62,9.31q-.75,5.64-6,10.09T293.59,66a151.39,151.39,0,0,1-25.38,5.49L268,66a81.76,81.76,0,0,0,15.41-3.48,24.49,24.49,0,0,0,8.79-4.94,11.73,11.73,0,0,0,3.56-6.41,5.51,5.51,0,0,0-.71-4.46A4.64,4.64,0,0,0,291.26,45a10.56,10.56,0,0,0-5.4,1.32,20.49,20.49,0,0,0-5.32,4.14,30.22,30.22,0,0,0-4.6,6.52,42.45,42.45,0,0,0-3.36,8.54c-.76,3-1.34,5.24-1.72,6.87s-.63,2.85-.75,3.68a16.28,16.28,0,0,0-.17,2.09,9,9,0,0,0,.52,3.14,9.7,9.7,0,0,1,.51,3.3,5.17,5.17,0,0,1-1.87,3.94,12.61,12.61,0,0,1-5.4,2.61,33.93,33.93,0,0,1-8.53.92c-2.3,0-4-.49-5.06-1.49a5.77,5.77,0,0,1-1.64-4.37,24.71,24.71,0,0,1,1.12-6.9l14.66-51C265.05,25.48,265.34,23.55,265.11,22.5Z",
	"M294.48,63.85l2.88,9.31a9.58,9.58,0,0,0,2.18,4.17,4.32,4.32,0,0,0,2.87,1.24,3.48,3.48,0,0,0,2-.55,9.08,9.08,0,0,0,1.73-1.35,5.87,5.87,0,0,1,1.9-1.24,2.65,2.65,0,0,1,1.49-.08,1.89,1.89,0,0,1,1.32,1.09,4.28,4.28,0,0,1,0,2.64,14.77,14.77,0,0,1-3.36,6.81,17.38,17.38,0,0,1-6.24,4.6,19.56,19.56,0,0,1-8,1.64c-3.22,0-5.68-.93-7.36-2.67A17.12,17.12,0,0,1,282,81.67l-3.68-14Z",
];

const O_INNER_PATH =
	"M209.7,84.66a6.3,6.3,0,0,0,3.25-.29,8.28,8.28,0,0,0,3.07-2.1,19.24,19.24,0,0,0,2.88-3.91,34.76,34.76,0,0,0,2.59-5.8q1.2-3.42,2.3-7.79a64.34,64.34,0,0,0,1.78-11.67,16,16,0,0,0-1.07-7.3,4.91,4.91,0,0,0-3.76-3,6,6,0,0,0-3.22.32,8.91,8.91,0,0,0-3.05,2.1,18,18,0,0,0-2.84,3.91A38.31,38.31,0,0,0,209.07,55q-1.2,3.42-2.3,7.79A62.71,62.71,0,0,0,205,74.4a16.34,16.34,0,0,0,1,7.3A4.83,4.83,0,0,0,209.7,84.66Z";

// The default maxSegmentLength is 10, which provides a good balance between performance and smoothness.
// Since we defer the calculation to a setTimeout, it won't block the main thread.
const getInterpolator = () => {
	return combine(SULOK_PATHS, BASE_BODY_PATH, {
		single: true,
	});
};

export function SulokLogo({ className }: { className?: string }) {
	const temporaryExpression = useLogoStore((state) => state.temporaryExpression);
	const currentExpression = temporaryExpression || "sleepy";

	const [isMorphed, setIsMorphed] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	const isMobile = useIsMobile();
	const location = useLocation();
	const isHome = location.pathname === "/";

	// Hold the heavy interpolator function in state
	const [interpolator, setInterpolator] = useState<((t: number) => string) | null>(null);

	// Create motion value.
	// progress 0 = Sulok text
	// progress 1 = Sulo mascot
	const progress = useMotionValue(0);

	// Morph path string. If interpolator isn't ready, just render the static merged path.
	const pathData = useTransform(progress, (v) => {
		if (interpolator) return interpolator(v);
		return SULOK_PATHS.join(" ");
	});

	// Morph viewBox coordinates simultaneously:
	// Sulok wordmark originally fits well in "0 0 315 84"
	// Sulo mascot body fits in "-125 -125 250 250"
	const viewBox = useTransform(progress, [0, 1], ["0 0 315 84.26", "-125 -125 250 250"]);

	// Morph visual container width so aspect ratio stays proportional.
	// The Mascot is now 48x48. For Sulok text to keep its 3.73 aspect ratio with height 48,
	// the width needs to be roughly 180 (48 * 3.73 = 179).
	// On mobile, we scale down: height 36, max width ~135 (36 * 3.73 = 134.28 -> 135)
	const width = useTransform(progress, [0, 1], isMobile ? [135, 36] : [180, 48]);
	const targetHeight = isMobile ? 36 : 48;

	// Original text SVG paths need a Y translation offset of -7.87. We scale that out during morph
	const yTransform = useTransform(progress, [0, 1], [-7.87, 0]);

	// Hole opacity: fades out quickly at the beginning of the morph (0 to 10% progress)
	// so the O becomes solid black before transforming into Sulo.
	const holeOpacity = useTransform(progress, [0, 0.1], [1, 0]);

	// Fade in the mascot component (which renders both body and eyes).
	// Since the body paths perfectly match, fading the body on top of the morphed body creates no visual artifacts.
	const eyesOpacity = useTransform(progress, [0.5, 1], [0, 1]);

	useEffect(() => {
		// Defer the heavy flubber calculation to avoid blocking the main thread during initial page load/render
		const calcTimer = setTimeout(() => {
			setInterpolator(() => getInterpolator());
		}, 100);

		// Delay morph on page load
		const loadTimer = setTimeout(() => {
			setIsMorphed(true);
		}, 2000);

		return () => {
			clearTimeout(calcTimer);
			clearTimeout(loadTimer);
		};
	}, []);

	useEffect(() => {
		// Target progress: 1 (Sulo) when morphed and NOT hovered
		// 0 (Sulok) when hovered, or if not morphed yet.
		const target = isMorphed && !isHovered ? 1 : 0;

		animate(progress, target, {
			duration: 0.8,
			ease: [0.25, 1, 0.5, 1],
		});
	}, [isMorphed, isHovered, progress]);

	const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleMouseEnter = () => {
		if (hoverTimeoutRef.current) {
			clearTimeout(hoverTimeoutRef.current);
		}
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		hoverTimeoutRef.current = setTimeout(() => {
			setIsHovered(false);
		}, 2000); // 2 second delay before morphing back
	};

	const handleInteract = () => {
		if (isHome) {
			handleMouseEnter();
			handleMouseLeave();
		}
	};

	const classNameValue = cn(
		"group relative flex items-center outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm cursor-pointer select-none [-webkit-touch-callout:none]",
		isMobile ? "h-9" : "h-12",
		className,
	);

	const content = (
		<motion.div
			style={{ width, height: targetHeight }}
			className="relative flex items-center justify-start overflow-visible"
		>
			<motion.svg
				viewBox={viewBox}
				className="absolute w-full h-full fill-foreground overflow-visible"
				xmlns="http://www.w3.org/2000/svg"
			>
				<motion.g style={{ y: yTransform }}>
					<motion.path d={pathData} />
					{/* O inner hole rendered separately so it can fade out and simulate a cutout */}
					<motion.path
						d={O_INNER_PATH}
						className="fill-background"
						style={{ opacity: holeOpacity }}
					/>
				</motion.g>
			</motion.svg>

			<motion.div
				className="absolute w-full h-full pointer-events-none"
				style={{ opacity: eyesOpacity }}
			>
				{/* Render full SuloMascot - its body perfectly overlaps the morphed path */}
				<SuloMascot expression={currentExpression} className={isMobile ? "w-9 h-9" : "w-12 h-12"} />
			</motion.div>
		</motion.div>
	);

	if (isHome) {
		return (
			<button
				type="button"
				onClick={handleInteract}
				className={classNameValue}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				aria-label={`${APP_INFO.name} Home`}
			>
				{content}
			</button>
		);
	}

	return (
		<Link
			to="/"
			className={classNameValue}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			aria-label={`${APP_INFO.name} Home`}
		>
			{content}
		</Link>
	);
}
