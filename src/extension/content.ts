if (import.meta.env.DEV) {
	console.log("Sulok Extension Bridge active.");
}

// 1. Send pending saves to the web app as soon as the bridge loads
chrome.storage.local.get("pendingSaves", (result) => {
	const pendingSaves = (result.pendingSaves as unknown[]) || [];
	if (pendingSaves.length > 0) {
		window.postMessage({ type: "SULOK_EXT_PENDING_SAVES", payload: pendingSaves }, "*");
	}
});

// 2. Listen for real-time storage changes and forward them to the web app
chrome.storage.onChanged.addListener((changes, area) => {
	if (area === "local" && changes.pendingSaves) {
		const newValue = (changes.pendingSaves.newValue as unknown[]) || [];
		if (newValue.length > 0) {
			window.postMessage({ type: "SULOK_EXT_PENDING_SAVES", payload: newValue }, "*");
		}
	}
});

// 3. Listen for messages from the web app (React side)
window.addEventListener("message", (event) => {
	// Security check: only accept messages from our own window
	if (event.source !== window) return;

	const data = event.data;

	if (data && data.type === "SULOK_EXT_CLEAR_SAVES") {
		const processedTimestamps = new Set(data.payload as number[]);
		chrome.storage.local.get("pendingSaves", (result) => {
			const pendingSaves = (result.pendingSaves as { timestamp: number }[]) || [];
			const remainingSaves = pendingSaves.filter((s) => !processedTimestamps.has(s.timestamp));
			chrome.storage.local.set({ pendingSaves: remainingSaves }, () => {
				if (import.meta.env.DEV) {
					console.log("Sulok Extension: Pending saves cleared by web app.");
				}
			});
		});
	}

	if (data && data.type === "SULOK_EXT_FACTORY_RESET") {
		chrome.storage.local.clear(() => {
			if (import.meta.env.DEV) {
				console.log("Sulok Extension: Factory reset completed.");
			}
			window.postMessage({ type: "SULOK_EXT_FACTORY_RESET_DONE" }, "*");
		});
	}

	if (data && data.type === "SULOK_EXT_READY") {
		window.postMessage({ type: "SULOK_EXT_INSTALLED_PONG" }, "*");
		chrome.storage.local.get("pendingSaves", (result) => {
			const pendingSaves = (result.pendingSaves as unknown[]) || [];
			if (pendingSaves.length > 0) {
				window.postMessage({ type: "SULOK_EXT_PENDING_SAVES", payload: pendingSaves }, "*");
			}
		});
	}

	if (data && data.type === "SULOK_EXT_UPDATE_FOLDERS") {
		chrome.storage.local.set({ folders: data.payload }, () => {
			if (import.meta.env.DEV) {
				console.log("Sulok Extension: Folders updated from web app.");
			}
		});
	}

	if (data && data.type === "SULOK_EXT_UPDATE_THEME") {
		chrome.storage.local.set({ theme: data.payload }, () => {
			if (import.meta.env.DEV) {
				console.log("Sulok Extension: Theme updated from web app.");
			}
		});
	}

	if (data && data.type === "SULOK_EXT_UPDATE_URLS") {
		chrome.storage.local.set({ savedUrls: data.payload }, () => {
			if (import.meta.env.DEV) {
				console.log("Sulok Extension: Saved URLs updated from web app.");
			}
		});
	}
});
