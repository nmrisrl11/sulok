import { useEffect, useState } from "react";

export function useIsTouchDevice() {
	const [isTouchDevice, setIsTouchDevice] = useState(() =>
		typeof window !== "undefined" ? window.matchMedia("(hover: none)").matches : false,
	);

	useEffect(() => {
		const match = window.matchMedia("(hover: none)");
		const handler = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
		match.addEventListener("change", handler);

		return () => match.removeEventListener("change", handler);
	}, []);

	return isTouchDevice;
}
