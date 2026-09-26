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
				updateIntervalRef.current = window.setInterval(
					() => {
						r.update();
					},
					60 * 60 * 1000,
				); // Check for updates every hour
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
		};
	}, []);

	useEffect(() => {
		const handleOnline = () => {
			setReaction("happy", "You are back online!", 4000);
		};

		const handleOffline = () => {
			setReaction("sleepy", "Offline. Changes saved locally.", 5000);
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
