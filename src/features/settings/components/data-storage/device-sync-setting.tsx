import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useP2PSync } from "@/hooks/use-p2p-sync";
import { notify } from "@/lib/notify";
import { exportDataForSync, importDataFromSync } from "@/lib/sync-utils";
import { cn } from "@/lib/utils";
import { AlertCircleIcon, DownloadCloudIcon, Loader2, SendIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

interface WrapperProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	description: string;
	children: ReactNode;
}

function SyncModalWrapper({ isOpen, onClose, title, description, children }: WrapperProps) {
	const isMobile = useIsMobile();

	if (isMobile) {
		return (
			<Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
				<DrawerContent className="px-0 pb-8" data-vaul-no-drag>
					<DrawerHeader className="border-b px-6 pb-4 text-left">
						<DrawerTitle className="font-heading text-xl">{title}</DrawerTitle>
						<DrawerDescription>{description}</DrawerDescription>
					</DrawerHeader>
					<div className="px-6 py-6">{children}</div>
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-md">
				<div className="border-b p-6 pb-4">
					<DialogHeader>
						<DialogTitle className="font-heading text-xl">{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>
				</div>
				<div className="p-6">{children}</div>
			</DialogContent>
		</Dialog>
	);
}

interface SyncOptionButtonProps {
	icon: ReactNode;
	title: string;
	description: string;
	onClick: () => void;
}

function SyncOptionButton({ icon, title, description, onClick }: SyncOptionButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"flex flex-col items-center gap-2 p-3 text-center transition-all sm:items-start sm:gap-3 sm:p-4 sm:text-left",
				"rounded-xl border border-border/50 bg-background hover:border-border hover:bg-muted/50",
				"corner-squircle supports-[corner-shape:squircle]:rounded-4xl",
				"focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
			)}
		>
			<div className="rounded-lg border border-border/50 bg-card p-2 text-muted-foreground shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-2xl">
				{icon}
			</div>
			<div>
				<h3 className="text-sm font-medium text-foreground">{title}</h3>
				<p className="mt-0.5 hidden text-xs leading-snug text-muted-foreground sm:block">
					{description}
				</p>
			</div>
		</button>
	);
}

export function DeviceSyncSetting() {
	const { syncState, peerId, startHosting, connectToHost, cancelSync } = useP2PSync();

	const [isHostModalOpen, setIsHostModalOpen] = useState(false);
	const [isClientModalOpen, setIsClientModalOpen] = useState(false);
	const [connectCode, setConnectCode] = useState("");

	const handleHostSync = () => {
		setIsHostModalOpen(true);
		startHosting(
			async (send) => {
				try {
					const blob = await exportDataForSync();
					send(blob);
				} catch (err) {
					console.error("Failed to package data", err);
					notify.error("Failed to package data for sync.", { id: "p2p-sync-package-error" });
				}
			},
			() => {
				notify.success("Transfer Complete!", { id: "p2p-sync-transfer-success" });
				setIsHostModalOpen(false);
			},
		);
	};

	const handleReceiveSync = () => {
		setIsClientModalOpen(true);
		setConnectCode("");
	};

	const handleConnect = () => {
		if (connectCode.trim().length !== 10) {
			notify.error("Please enter a valid 10-character code.", { id: "p2p-sync-invalid-code" });
			return;
		}

		connectToHost(connectCode, async (data, ack) => {
			try {
				let text = "";
				if (data instanceof Blob) {
					text = await data.text();
				} else if (data instanceof ArrayBuffer || data instanceof Uint8Array) {
					text = new TextDecoder().decode(data);
				} else if (typeof data === "string") {
					text = data;
				} else if (typeof data === "object") {
					text = JSON.stringify(data);
				}

				if (!text) throw new Error("Empty data received");

				await importDataFromSync(text);
				ack();
				notify.success("Sync Complete!", {
					description: "Data merged successfully.",
					id: "p2p-sync-receive-success",
				});
				setIsClientModalOpen(false);
			} catch (err) {
				console.error("Data processing failed", err);
				notify.error("Sync Failed", {
					description: "Data was corrupted or invalid.",
					id: "p2p-sync-receive-error",
				});
				cancelSync();
			}
		});
	};

	const handleCloseHost = () => {
		cancelSync();
		setIsHostModalOpen(false);
	};

	const handleCloseClient = () => {
		cancelSync();
		setIsClientModalOpen(false);
	};

	return (
		<>
			<div className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:py-6 sm:first:pt-0 sm:last:pb-0">
				<div>
					<p className="flex items-center gap-2 text-sm font-medium text-foreground">
						<SendIcon className="h-4 w-4" /> Device Sync (P2P)
						<span className="inline-flex items-center rounded-full border border-green-500/20 bg-green-500/10 px-1.5 py-0 text-[10px] font-semibold text-green-600 transition-colors corner-squircle supports-[corner-shape:squircle]:rounded-full">
							Recommended
						</span>
					</p>
					<p className="mt-1 text-xs text-muted-foreground">
						Transfer your links, folders, and workspace theme directly to another device over your
						local network. No cloud required.
					</p>
				</div>
				<div className="grid grid-cols-2 gap-3">
					<SyncOptionButton
						icon={<SendIcon className="h-5 w-5" />}
						title="Send Data"
						description="Host a connection to send data"
						onClick={handleHostSync}
					/>
					<SyncOptionButton
						icon={<DownloadCloudIcon className="h-5 w-5" />}
						title="Receive Data"
						description="Connect with code to receive"
						onClick={handleReceiveSync}
					/>
				</div>
			</div>

			<SyncModalWrapper
				isOpen={isHostModalOpen}
				onClose={handleCloseHost}
				title="Send Data"
				description="Enter this code on your other device to connect and transfer your data."
			>
				<div className="flex w-full flex-col gap-4">
					{syncState === "hosting" ? (
						<>
							<div className="flex h-28 w-full flex-col items-center justify-center gap-2 rounded-xl border border-border bg-muted/30 shadow-sm">
								<span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
									Your Code
								</span>
								{peerId ? (
									<span className="font-mono text-3xl font-bold tracking-[0.25em] text-foreground">
										{peerId}
									</span>
								) : (
									<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
								)}
							</div>
							<div
								className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary"
								role="alert"
								aria-live="polite"
							>
								<Loader2 className="h-4 w-4 animate-spin" />
								Waiting for connection...
							</div>
						</>
					) : syncState === "connecting" ? (
						<div className="flex flex-col items-center justify-center gap-4 py-6">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
								<Loader2 className="h-8 w-8 animate-spin" />
							</div>
							<div className="text-center">
								<h4 className="text-sm font-semibold text-foreground">Connecting...</h4>
								<p className="mt-1 text-xs text-muted-foreground">Waiting for device to confirm.</p>
							</div>
						</div>
					) : syncState === "transferring" ? (
						<div className="flex flex-col items-center justify-center gap-4 py-6">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
								<Loader2 className="h-8 w-8 animate-spin" />
							</div>
							<div className="text-center">
								<h4 className="text-sm font-semibold text-foreground">Transferring...</h4>
								<p className="mt-1 text-xs text-muted-foreground">Sending your library data.</p>
							</div>
						</div>
					) : syncState === "success" ? (
						<div className="flex flex-col items-center justify-center gap-4 py-6">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-600">
								<SendIcon className="h-8 w-8" />
							</div>
							<div className="text-center">
								<h4 className="text-sm font-semibold text-foreground">Transfer Complete!</h4>
								<p className="mt-1 text-xs text-muted-foreground">Data successfully sent.</p>
							</div>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center gap-4 py-6">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
								<AlertCircleIcon className="h-8 w-8" />
							</div>
							<div className="text-center">
								<h4 className="text-sm font-semibold text-foreground">Connection Error</h4>
								<p className="mt-1 text-xs text-muted-foreground">
									The transfer failed or timed out.
								</p>
							</div>
						</div>
					)}
				</div>
			</SyncModalWrapper>

			<SyncModalWrapper
				isOpen={isClientModalOpen}
				onClose={handleCloseClient}
				title="Receive Data"
				description="Enter the 10-character code from your other device to securely merge data."
			>
				<div className="flex w-full flex-col gap-4">
					{syncState === "idle" || syncState === "error" ? (
						<div className="flex w-full flex-col gap-4">
							<Input
								placeholder="e.g. A1B2C3D4E5"
								value={connectCode}
								onChange={(e) => setConnectCode(e.target.value.toUpperCase())}
								className="h-14 bg-background text-center font-mono text-xl font-semibold tracking-[0.2em] uppercase"
								maxLength={10}
								id="receive-code"
								autoComplete="off"
							/>
							<Button
								className="h-12 w-full"
								onClick={handleConnect}
								disabled={connectCode.length !== 10}
							>
								Connect & Sync
							</Button>
							{syncState === "error" && (
								<div className="rounded-lg bg-destructive/10 p-3 text-center text-xs font-medium text-destructive">
									The connection to the host was lost or timed out. Please ensure the code is
									correct and the host is actively waiting.
								</div>
							)}
						</div>
					) : syncState === "connecting" ? (
						<div className="flex flex-col items-center justify-center gap-4 py-6">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
								<Loader2 className="h-8 w-8 animate-spin" />
							</div>
							<div className="text-center">
								<h4 className="text-sm font-semibold text-foreground">Connecting...</h4>
								<p className="mt-1 text-xs text-muted-foreground">
									Locating host on local network.
								</p>
							</div>
						</div>
					) : syncState === "transferring" ? (
						<div className="flex flex-col items-center justify-center gap-4 py-6">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
								<Loader2 className="h-8 w-8 animate-spin" />
							</div>
							<div className="text-center">
								<h4 className="text-sm font-semibold text-foreground">Transferring...</h4>
								<p className="mt-1 text-xs text-muted-foreground">Receiving and merging data.</p>
							</div>
						</div>
					) : syncState === "success" ? (
						<div className="flex flex-col items-center justify-center gap-4 py-6">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-600">
								<DownloadCloudIcon className="h-8 w-8" />
							</div>
							<div className="text-center">
								<h4 className="text-sm font-semibold text-foreground">Sync Complete!</h4>
								<p className="mt-1 text-xs text-muted-foreground">Data merged successfully.</p>
							</div>
						</div>
					) : null}
				</div>
			</SyncModalWrapper>
		</>
	);
}
