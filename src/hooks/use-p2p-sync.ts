import { Peer, type DataConnection } from "peerjs";
import { useCallback, useEffect, useRef, useState } from "react";

export type SyncState = "idle" | "connecting" | "hosting" | "transferring" | "error" | "success";

const generateSyncId = () => {
	const array = new Uint32Array(2);
	crypto.getRandomValues(array);
	return Array.from(array)
		.map((x) => x.toString(36))
		.join("")
		.substring(0, 10)
		.toUpperCase();
};

export function useP2PSync() {
	const [syncState, setSyncState] = useState<SyncState>("idle");
	const [peerId, setPeerId] = useState<string>("");

	const peerRef = useRef<Peer | null>(null);
	const connRef = useRef<DataConnection | null>(null);
	const syncStateRef = useRef<SyncState>("idle");
	const cleanupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const connectionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const updateSyncState = useCallback((newState: SyncState | ((prev: SyncState) => SyncState)) => {
		setSyncState((prev) => {
			const next = typeof newState === "function" ? newState(prev) : newState;
			syncStateRef.current = next;
			return next;
		});
	}, []);

	const cleanup = useCallback(() => {
		if (cleanupTimeoutRef.current) {
			clearTimeout(cleanupTimeoutRef.current);
			cleanupTimeoutRef.current = null;
		}
		if (connectionTimeoutRef.current) {
			clearTimeout(connectionTimeoutRef.current);
			connectionTimeoutRef.current = null;
		}
		if (connRef.current) {
			connRef.current.close();
			connRef.current = null;
		}
		if (peerRef.current) {
			peerRef.current.destroy();
			peerRef.current = null;
		}
		updateSyncState("idle");
		setPeerId("");
	}, [updateSyncState]);

	useEffect(() => {
		return () => cleanup();
	}, [cleanup]);

	const startHosting = useCallback(
		(onProvideData: (send: (data: Blob) => void) => void, onSuccess: () => void) => {
			cleanup();
			updateSyncState("connecting");

			const newPeerId = generateSyncId();
			const peer = new Peer(newPeerId);
			peerRef.current = peer;

			connectionTimeoutRef.current = setTimeout(() => {
				if (syncStateRef.current === "connecting" || syncStateRef.current === "hosting") {
					if (peerRef.current) {
						peerRef.current.destroy();
						peerRef.current = null;
					}
					updateSyncState("error");
				}
			}, 60000); // 1 min timeout for handshake

			peer.on("open", (id) => {
				setPeerId(id);
				updateSyncState("hosting");
			});

			peer.on("connection", (conn) => {
				if (connRef.current) {
					// Reject any connections after the first one
					conn.on("open", () => {
						conn.close();
					});
					return;
				}

				connRef.current = conn;
				updateSyncState("transferring");

				if (connectionTimeoutRef.current) {
					clearTimeout(connectionTimeoutRef.current);
					connectionTimeoutRef.current = null;
				}

				conn.on("open", () => {
					onProvideData((blob) => {
						conn.send(blob);
					});
				});

				conn.on("data", (data) => {
					if (data === "ACK") {
						updateSyncState("success");
						onSuccess();
						cleanupTimeoutRef.current = setTimeout(cleanup, 2000);
					}
				});

				conn.on("error", () => {
					updateSyncState("error");
				});

				conn.on("close", () => {
					if (syncStateRef.current !== "success") {
						updateSyncState("error");
					}
				});
			});

			peer.on("error", (err) => {
				if (connectionTimeoutRef.current) {
					clearTimeout(connectionTimeoutRef.current);
					connectionTimeoutRef.current = null;
				}
				console.error("PeerJS error:", err);
				updateSyncState("error");
			});
		},
		[cleanup, updateSyncState],
	);

	const connectToHost = useCallback(
		(hostId: string, onReceiveData: (data: unknown, ack: () => void) => void) => {
			cleanup();
			updateSyncState("connecting");

			const peer = new Peer();
			peerRef.current = peer;

			connectionTimeoutRef.current = setTimeout(() => {
				if (syncStateRef.current === "connecting") {
					if (peerRef.current) {
						peerRef.current.destroy();
						peerRef.current = null;
					}
					updateSyncState("error");
				}
			}, 15000);

			peer.on("open", () => {
				const conn = peer.connect(hostId, { reliable: true });
				connRef.current = conn;

				conn.on("open", () => {
					if (connectionTimeoutRef.current) {
						clearTimeout(connectionTimeoutRef.current);
						connectionTimeoutRef.current = null;
					}
					updateSyncState("transferring");
				});

				conn.on("data", (data) => {
					onReceiveData(data, () => {
						conn.send("ACK");
						updateSyncState("success");
						cleanupTimeoutRef.current = setTimeout(cleanup, 2000);
					});
				});

				conn.on("error", () => {
					if (connectionTimeoutRef.current) {
						clearTimeout(connectionTimeoutRef.current);
						connectionTimeoutRef.current = null;
					}
					updateSyncState("error");
				});

				conn.on("close", () => {
					if (connectionTimeoutRef.current) {
						clearTimeout(connectionTimeoutRef.current);
						connectionTimeoutRef.current = null;
					}
					if (syncStateRef.current !== "success") {
						updateSyncState("error");
					}
				});
			});

			peer.on("error", (err) => {
				if (connectionTimeoutRef.current) {
					clearTimeout(connectionTimeoutRef.current);
					connectionTimeoutRef.current = null;
				}
				console.error("PeerJS error:", err);
				updateSyncState("error");
			});
		},
		[cleanup, updateSyncState],
	);

	const cancelSync = useCallback(() => {
		cleanup();
	}, [cleanup]);

	return {
		syncState,
		peerId,
		startHosting,
		connectToHost,
		cancelSync,
	};
}
