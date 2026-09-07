import { useSoundEffects } from "@/hooks/use-sound-effects";
import { useEffect } from "react";

// Elements that should trigger interactive sounds
const INTERACTIVE_SELECTORS = [
	"button",
	"a[href]",
	"[role='button']",
	"[role='tab']",
	"[role='menuitem']",
	"[role='option']",
	"[role='switch']",
	"input[type='checkbox']",
	"input[type='radio']",
	".cursor-pointer",
].join(", ");

export function useGlobalSoundInteractions() {
	const { playInteraction } = useSoundEffects();

	useEffect(() => {
		// Throttle hover sounds to prevent spamming
		let lastHoverTime = 0;

		const handlePointerEnter = (e: PointerEvent) => {
			// Only play for fine pointers (mouse) to avoid double-playing on touch
			if (e.pointerType !== "mouse") return;

			const target = (e.target as HTMLElement).closest?.(INTERACTIVE_SELECTORS);
			if (!target) return;

			// Don't play if it's disabled or opted out
			if (
				target.hasAttribute("disabled") ||
				target.getAttribute("aria-disabled") === "true" ||
				target.closest("[data-no-sound='true']")
			)
				return;

			const now = performance.now();
			if (now - lastHoverTime > 150) {
				lastHoverTime = now;
				playInteraction("hover");
			}
		};

		const handlePointerDown = (e: PointerEvent) => {
			const target = (e.target as HTMLElement).closest?.(INTERACTIVE_SELECTORS);
			if (!target) return;

			if (
				target.hasAttribute("disabled") ||
				target.getAttribute("aria-disabled") === "true" ||
				target.closest("[data-no-sound='true']")
			)
				return;

			// Check if it's a switch/toggle
			const isToggle =
				target.getAttribute("role") === "switch" ||
				(target.tagName.toLowerCase() === "input" &&
					(target as HTMLInputElement).type === "checkbox");

			if (isToggle) {
				// We let click handle toggles, or we can handle it here.
				// Actually, toggle clicks are better handled on 'click' to ensure state changed.
				// But to feel responsive, pointerdown is okay, except click might be cancelled.
				// Let's just use press for down.
			}

			playInteraction("press");
		};

		const handleClick = (e: MouseEvent) => {
			const target = (e.target as HTMLElement).closest?.(INTERACTIVE_SELECTORS);
			if (!target) return;

			if (
				target.hasAttribute("disabled") ||
				target.getAttribute("aria-disabled") === "true" ||
				target.closest("[data-no-sound='true']")
			)
				return;

			const isToggle =
				target.getAttribute("role") === "switch" ||
				(target.tagName.toLowerCase() === "input" &&
					(target as HTMLInputElement).type === "checkbox");

			if (isToggle) {
				playInteraction("toggle");
			}
		};

		// Use capture phase to ensure we catch events even if propagation is stopped
		document.addEventListener("pointerenter", handlePointerEnter, { capture: true });
		document.addEventListener("pointerdown", handlePointerDown, { capture: true });
		document.addEventListener("click", handleClick, { capture: true });

		return () => {
			document.removeEventListener("pointerenter", handlePointerEnter, { capture: true });
			document.removeEventListener("pointerdown", handlePointerDown, { capture: true });
			document.removeEventListener("click", handleClick, { capture: true });
		};
	}, [playInteraction]);
}
