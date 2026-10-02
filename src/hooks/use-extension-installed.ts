import { useEffect, useState } from "react";

export function useExtensionInstalled() {
	const [isInstalled, setIsInstalled] = useState<boolean | null>(null);

	useEffect(() => {
		let isMounted = true;

		const handleMessage = (event: MessageEvent) => {
			if (event.source !== window) return;

			if (event.data?.type === "SULOK_EXT_INSTALLED_PONG") {
				if (isMounted) setIsInstalled(true);
			}
		};

		window.addEventListener("message", handleMessage);

		// Send a ping just in case the bridge is ready
		window.postMessage({ type: "SULOK_EXT_READY" }, "*");

		// If no pong received within 1 second, assume not installed
		const timeout = setTimeout(() => {
			if (isMounted && isInstalled === null) {
				setIsInstalled(false);
			}
		}, 1000);

		return () => {
			isMounted = false;
			window.removeEventListener("message", handleMessage);
			clearTimeout(timeout);
		};
	}, [isInstalled]);

	return isInstalled;
}
