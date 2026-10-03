import { APP_INFO } from "@/constants/app-info";
import { normalizeUrl } from "@/lib/utils";
import { showSaveNotification } from "./utils";

chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: "save-page",
		title: `Save Page to ${APP_INFO.name}`,
		contexts: ["page"],
	});

	chrome.contextMenus.create({
		id: "save-link",
		title: `Save Link to ${APP_INFO.name}`,
		contexts: ["link"],
	});
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (info.menuItemId === "save-page" && tab?.url) {
		saveToQueue({
			url: tab.url,
			title: tab.title || "",
			folderId: null,
			timestamp: Date.now(),
		});
	} else if (info.menuItemId === "save-link" && info.linkUrl) {
		saveToQueue({
			url: info.linkUrl,
			title: info.selectionText || info.linkUrl,
			folderId: null,
			timestamp: Date.now(),
		});
	}
});

interface SaveData {
	url: string;
	title: string;
	folderId: string | null;
	timestamp: number;
}

let saveQueueLock = Promise.resolve();

function saveToQueue(saveData: SaveData) {
	saveQueueLock = saveQueueLock.then(() => {
		return new Promise<void>((resolve) => {
			chrome.storage.local.get(["pendingSaves", "savedUrls"], (result) => {
				const pendingSaves = (result.pendingSaves as SaveData[]) || [];

				// Now an array of { url: string, isDeleted: boolean }
				const savedUrls = (result.savedUrls as { url: string; isDeleted: boolean }[]) || [];
				const normalizedInput = normalizeUrl(saveData.url);
				const existingMatch = savedUrls.find((s) => s.url === normalizedInput);

				let status: "new" | "duplicate" | "trashed" = "new";
				if (existingMatch) {
					status = existingMatch.isDeleted ? "trashed" : "duplicate";
				}

				chrome.storage.local.set({ pendingSaves: [...pendingSaves, saveData] }, () => {
					showSaveNotification({ title: saveData.title, status });
					resolve();
				});
			});
		});
	});
}

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
	if (request.type === "SULOK_EXT_SAVE_POPUP") {
		saveToQueue(request.payload);
		sendResponse({ success: true });
	}

	if (request.type === "SULOK_EXT_TRIGGER_BOOKMARK_IMPORT") {
		const fromWebApp = request.fromWebApp;

		import("./bookmark-parser").then(({ parseBookmarksTree }) => {
			chrome.bookmarks.getTree((nodes) => {
				const payload = parseBookmarksTree(nodes);
				chrome.storage.local.set({ pending_bookmark_import: payload }, () => {
					if (fromWebApp) {
						// Called from inside the web app itself, do nothing else.
						// The content script will detect the storage change and show the dialog.
						sendResponse({ success: true });
					} else {
						// Called from the popup
						// Try to find an existing Sulok tab and focus it, otherwise create a new one
						chrome.tabs.query({}, (tabs) => {
							const existingTab = tabs.find(
								(t) => t.url?.includes(APP_INFO.appUrl) || t.url?.includes("localhost:5173"),
							);
							if (existingTab && existingTab.id && existingTab.windowId) {
								chrome.tabs.update(existingTab.id, { active: true });
								chrome.windows.update(existingTab.windowId, { focused: true });
							} else {
								const targetAppUrl = import.meta.env.DEV
									? "http://localhost:5173"
									: `https://${APP_INFO.appUrl}`;
								chrome.tabs.create({ url: targetAppUrl });
							}
							sendResponse({ success: true });
						});
					}
				});
			});
		});
		return true;
	}
});

chrome.notifications.onClicked.addListener((notificationId) => {
	if (notificationId === "sulok-save-notification") {
		chrome.tabs.query({}, (tabs) => {
			const existingTab = tabs.find(
				(t) => t.url?.includes(APP_INFO.appUrl) || t.url?.includes("localhost:5173"),
			);
			if (existingTab && existingTab.id && existingTab.windowId) {
				// Focus the tab and its window
				chrome.tabs.update(existingTab.id, { active: true });
				chrome.windows.update(existingTab.windowId, { focused: true });
			} else {
				// Open new tab to the app
				const targetAppUrl = import.meta.env.DEV
					? "http://localhost:5173"
					: `https://${APP_INFO.appUrl}`;
				chrome.tabs.create({ url: targetAppUrl });
			}
			chrome.notifications.clear(notificationId);
		});
	}
});
