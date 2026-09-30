import { APP_INFO } from "@/constants/app-info";

interface NotificationOptions {
	title?: string;
	status?: "new" | "duplicate" | "trashed";
}

export function showSaveNotification({ title, status = "new" }: NotificationOptions) {
	let notificationTitle = `Added to ${APP_INFO.name}`;
	let message = title ? `Saved: ${title}` : "Item saved to your corner.";

	if (status === "duplicate") {
		notificationTitle = "Already in your corner";
		message = title ? `Found: ${title}` : "This link is already saved.";
	} else if (status === "trashed") {
		notificationTitle = "Link in Recycle Bin";
		message = "Open the app to restore this link.";
	}

	chrome.notifications.create("sulok-save-notification", {
		type: "basic",
		iconUrl: "/favicon-96x96.png",
		title: notificationTitle,
		message,
		priority: 1,
	});
}
