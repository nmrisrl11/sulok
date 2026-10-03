import { Peer, type DataConnection } from "peerjs";
import { useCallback, useEffect, useRef, useState } from "react";

export type SyncState = "idle" | "connecting" | "hosting" | "transferring" | "error" | "success";

const generateSyncId = () => {
	return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export function useP2PSync() {
	const [syncState, setSyncState] = useState<SyncState>("idle");
	const [peerId, setPeerId] = useState<string>("");
	const peerRef = useRef<Peer | null>(null);
	const connRef = useRef<DataConnection | null>(null);

	const cleanup = useCallback(() => {
		if (connRef.current) {
			connRef.current.close();
			connRef.current = null;
		}
		if (peerRef.current) {
			peerRef.current.destroy();
			peerRef.current = null;
		}
		setSyncState("idle");
		setPeerId("");
	}, []);

	useEffect(() => {
		return () => cleanup();
	}, [cleanup]);

	const startHosting = useCallback(
		(onProvideData: (send: (data: Blob) => void) => void, onSuccess: () => void) => {
			cleanup();
			setSyncState("connecting");

			const newPeerId = generateSyncId();
			const peer = new Peer(newPeerId);
			peerRef.current = peer;

			peer.on("open", (id) => {
				setPeerId(id);
				setSyncState("hosting");
			});

			peer.on("connection", (conn) => {
				connRef.current = conn;
				setSyncState("transferring");

				conn.on("open", () => {
					onProvideData((blob) => {
						conn.send(blob);
					});
				});

				conn.on("data", (data) => {
					if (data === "ACK") {
						setSyncState("success");
						onSuccess();
						setTimeout(cleanup, 2000);
					}
				});

				conn.on("error", () => {
					setSyncState("error");
				});

				conn.on("close", () => {
					setSyncState((prev) => {
						if (prev !== "success") return "error";
						return prev;
					});
				});
			});

			peer.on("error", (err) => {
				console.error("PeerJS error:", err);
				setSyncState("error");
			});
		},
		[cleanup],
	);

	const connectToHost = useCallback(
		(hostId: string, onReceiveData: (data: unknown, ack: () => void) => void) => {
			cleanup();
			setSyncState("connecting");

			const peer = new Peer();
			peerRef.current = peer;

			const connectionTimeout = setTimeout(() => {
				setSyncState((prev) => {
					if (prev === "connecting") {
						if (peerRef.current) peerRef.current.destroy();
						return "error";
					}
					return prev;
				});
			}, 15000);

			peer.on("open", () => {
				const conn = peer.connect(hostId, { reliable: true });
				connRef.current = conn;

				conn.on("open", () => {
					clearTimeout(connectionTimeout);
					setSyncState("transferring");
				});

				conn.on("data", (data) => {
					onReceiveData(data, () => {
						conn.send("ACK");
						setSyncState("success");
						setTimeout(cleanup, 2000);
					});
				});

				conn.on("error", () => {
					clearTimeout(connectionTimeout);
					setSyncState("error");
				});

				conn.on("close", () => {
					clearTimeout(connectionTimeout);
					setSyncState((prev) => {
						if (prev !== "success") return "error";
						return prev;
					});
				});
			});

			peer.on("error", (err) => {
				clearTimeout(connectionTimeout);
				console.error("PeerJS error:", err);
				setSyncState("error");
			});
		},
		[cleanup],
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
