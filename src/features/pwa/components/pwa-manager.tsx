import { notify } from "@/lib/notify";
import { useLogoStore } from "@/stores";
import { useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

export function PwaManager() {
	const setTemporaryExpression = useLogoStore((state) => state.setTemporaryExpression);

	const {
		needRefresh: [needRefresh],
		updateServiceWorker,
	} = useRegisterSW({
		onRegistered(r) {
			console.log("SW Registered:", r);
		},
		onRegisterError(error) {
			console.error("SW Registration Error:", error);
		},
	});

	useEffect(() => {
		const handleOnline = () => {
			notify.success("You are back online.");
			setTemporaryExpression("excited", 4000);
		};

		const handleOffline = () => {
			notify.error("You are currently offline. Changes will be saved locally.");
			setTemporaryExpression("sleepy", 5000);
		};

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, [setTemporaryExpression]);

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
