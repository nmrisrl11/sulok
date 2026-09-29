import { notify } from "@/lib/notify";
import { useLogoStore } from "@/stores";
import { useEffect, useRef } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

export function PwaManager() {
	const setReaction = useLogoStore((state) => state.setReaction);
	const setTemporaryExpression = useLogoStore((state) => state.setTemporaryExpression);

	const updateIntervalRef = useRef<number | null>(null);

	const {
		needRefresh: [needRefresh],
		updateServiceWorker,
	} = useRegisterSW({
		onRegistered(r) {
			console.log("SW Registered:", r);
			if (r) {
				// 1. Fallback: Check for updates every hour
				updateIntervalRef.current = window.setInterval(
					() => {
						if (r.installing || !navigator.onLine) return;
						r.update();
					},
					60 * 60 * 1000,
				);

				// 2. Responsive: Check for updates when user returns to the app
				const handleVisibilityChange = () => {
					if (document.visibilityState === "visible" && !r.installing && navigator.onLine) {
						r.update();
					}
				};
				document.addEventListener("visibilitychange", handleVisibilityChange);

				// Store cleanup on window so we can clean it up in useEffect if needed,
				// though this component is a global singleton so it rarely unmounts.
				// @ts-expect-error - storing cleanup function for dev fast-refresh
				window.__pwaCleanup = () => {
					document.removeEventListener("visibilitychange", handleVisibilityChange);
				};
			}
		},
		onRegisterError(error) {
			console.error("SW Registration Error:", error);
		},
	});

	useEffect(() => {
		return () => {
			if (updateIntervalRef.current) {
				window.clearInterval(updateIntervalRef.current);
			}
			// @ts-expect-error - clean up the visibility listener during fast-refresh
			if (window.__pwaCleanup) {
				// @ts-expect-error - clean up the visibility listener during fast-refresh
				window.__pwaCleanup();
			}
		};
	}, []);

	useEffect(() => {
		const handleOnline = () => {
			setReaction("happy", "Back online!", 4000);
		};

		const handleOffline = () => {
			setReaction("sleepy", "Working offline", 5000);
		};

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, [setReaction]);

	useEffect(() => {
		if (needRefresh) {
			setTemporaryExpression("attentive", 10000);
			notify.info("A new update is available!", {
				duration: Number.POSITIVE_INFINITY,
				action: {
					label: "Update",
					onClick: () => {
						updateServiceWorker(true);
					},
				},
			});
		}
	}, [needRefresh, updateServiceWorker, setTemporaryExpression]);

	return null;
}
