import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Provides a continuously looping boolean state for animated mock UIs.
 * Gracefully degrades to a static `true` state if the user prefers reduced motion.
 *
 * @param intervalMs The duration of each animation cycle in milliseconds. Defaults to 1500ms.
 */
export function useMockAnimation(intervalMs = 1500) {
	const prefersReducedMotion = useReducedMotion();
	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		if (prefersReducedMotion) return;

		const interval = setInterval(() => {
			setIsActive((prev) => !prev);
		}, intervalMs);
		return () => clearInterval(interval);
	}, [prefersReducedMotion, intervalMs]);

	return {
		isActive: prefersReducedMotion || isActive,
		prefersReducedMotion: prefersReducedMotion === true,
	};
}
