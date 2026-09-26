import { useEffect, useState } from "react";

export interface BeforeInstallPromptEvent extends Event {
	readonly platforms: string[];
	readonly userChoice: Promise<{
		outcome: "accepted" | "dismissed";
		platform: string;
	}>;
	prompt(): Promise<void>;
}

declare global {
	interface Window {
		__deferredPrompt: BeforeInstallPromptEvent | null;
		__isInstallable: boolean;
	}
}

export function useInstallApp() {
	const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
		window.__deferredPrompt || null,
	);
	const [isInstallable, setIsInstallable] = useState(window.__isInstallable || false);
	const [isChecking, setIsChecking] = useState(!window.__isInstallable);
	const [isInstalled, setIsInstalled] = useState(() => {
		const nav = window.navigator as Navigator & { standalone?: boolean };
		return (
			window.matchMedia("(display-mode: standalone)").matches ||
			window.matchMedia("(display-mode: window-controls-overlay)").matches ||
			window.matchMedia("(display-mode: fullscreen)").matches ||
			nav.standalone === true
		);
	});
	const [isIOS] = useState(() => {
		return (
			(/iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window)) ||
			(navigator.userAgent.includes("Mac") && "ontouchend" in document)
		);
	});
	const [isDesktop] = useState(() => {
		return !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobi/i.test(
			navigator.userAgent,
		);
	});

	useEffect(() => {
		const checkIsInstalled = () => {
			const nav = window.navigator as Navigator & { standalone?: boolean };
			const standalone =
				window.matchMedia("(display-mode: standalone)").matches ||
				window.matchMedia("(display-mode: window-controls-overlay)").matches ||
				window.matchMedia("(display-mode: fullscreen)").matches ||
				nav.standalone === true;
			setIsInstalled(standalone);
		};

		const mqStandalone = window.matchMedia("(display-mode: standalone)");
		const mqWco = window.matchMedia("(display-mode: window-controls-overlay)");
		const mqFullscreen = window.matchMedia("(display-mode: fullscreen)");

		mqStandalone.addEventListener("change", checkIsInstalled);
		mqWco.addEventListener("change", checkIsInstalled);
		mqFullscreen.addEventListener("change", checkIsInstalled);

		const handleAppInstallable = () => {
			setDeferredPrompt(window.__deferredPrompt || null);
			setIsInstallable(window.__isInstallable || false);
		};
		window.addEventListener("app-installable", handleAppInstallable);

		const handleBeforeInstallPrompt = (e: Event) => {
			e.preventDefault();
			const event = e as BeforeInstallPromptEvent;
			window.__deferredPrompt = event;
			window.__isInstallable = true;
			setDeferredPrompt(event);
			setIsInstallable(true);
			setIsChecking(false);
		};
		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

		const timer = setTimeout(() => {
			setIsChecking(false);
		}, 800);

		return () => {
			mqStandalone.removeEventListener("change", checkIsInstalled);
			mqWco.removeEventListener("change", checkIsInstalled);
			mqFullscreen.removeEventListener("change", checkIsInstalled);
			window.removeEventListener("app-installable", handleAppInstallable);
			window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
			clearTimeout(timer);
		};
	}, []);

	const promptInstall = async () => {
		if (!deferredPrompt) {
			return;
		}
		await deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		if (outcome === "accepted") {
			console.log("User accepted the install prompt");
		} else {
			console.log("User dismissed the install prompt");
		}

		setDeferredPrompt(null);
		setIsInstallable(false);
		window.__deferredPrompt = null;
		window.__isInstallable = false;
	};

	return {
		isInstallable,
		isInstalled,
		isIOS,
		isDesktop,
		isChecking,
		promptInstall,
	};
}
