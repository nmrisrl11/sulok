import { useCallback, useEffect, useRef, useState } from "react";

export function useCopyToClipboard({ timeout = 2000 } = {}) {
	const [isCopied, setIsCopied] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const copyToClipboard = useCallback(
		async (value: string) => {
			try {
				if (typeof window === "undefined" || !navigator.clipboard) {
					throw new Error("Clipboard not supported");
				}
				await navigator.clipboard.writeText(value);
				setIsCopied(true);

				if (timeoutRef.current) clearTimeout(timeoutRef.current);
				timeoutRef.current = setTimeout(() => setIsCopied(false), timeout);
			} catch {
				setIsCopied(false);
			}
		},
		[timeout],
	);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	return { isCopied, copyToClipboard };
}
