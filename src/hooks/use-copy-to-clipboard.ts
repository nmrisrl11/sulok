import { useState, useCallback } from "react";

export function useCopyToClipboard({ timeout = 2000 } = {}) {
	const [isCopied, setIsCopied] = useState(false);

	const copyToClipboard = useCallback(
		async (value: string) => {
			try {
				if (typeof window === "undefined" || !navigator.clipboard) {
					throw new Error("Clipboard not supported");
				}
				await navigator.clipboard.writeText(value);
				setIsCopied(true);
				setTimeout(() => setIsCopied(false), timeout);
			} catch (error) {
				setIsCopied(false);
			}
		},
		[timeout],
	);

	return { isCopied, copyToClipboard };
}
