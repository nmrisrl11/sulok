import { Button } from "@/components/ui/button";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";
import { HardDriveIcon, ShieldAlertIcon, ShieldCheckIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function BrowserStorageSetting() {
	const [storageUsage, setStorageUsage] = useState<number | null>(null);
	const [storageQuota, setStorageQuota] = useState<number | null>(null);
	const [isPersisted, setIsPersisted] = useState(false);

	useEffect(() => {
		const checkStorage = async () => {
			if (navigator.storage && navigator.storage.estimate) {
				const estimate = await navigator.storage.estimate();
				setStorageUsage(estimate.usage || 0);
				setStorageQuota(estimate.quota || 0);
			}
			if (navigator.storage && navigator.storage.persisted) {
				const persisted = await navigator.storage.persisted();
				setIsPersisted(persisted);
			}
		};
		checkStorage();
	}, []);

	const handleRequestPersist = async () => {
		if (navigator.storage && navigator.storage.persist) {
			const persisted = await navigator.storage.persist();
			setIsPersisted(persisted);

			if (persisted) {
				notify.success("Protection Enabled", {
					id: "storage-protection-success",
					description: "Your data is now protected from automatic browser eviction.",
				});
			} else {
				notify.info("Action Required", {
					id: "storage-protection-info",
					description:
						"Could not enable protection automatically. Try installing the app or bookmarking it, as browsers restrict this feature.",
				});
			}
		} else {
			notify.error("Unsupported Browser", {
				id: "storage-protection-error",
				description: "Storage persistence is not supported by your current browser.",
			});
		}
	};

	const formatBytes = (bytes: number) => {
		if (bytes === 0) return "0 B";
		const k = 1024;
		const sizes = ["B", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	const usagePercentage = storageUsage && storageQuota ? (storageUsage / storageQuota) * 100 : 0;

	return (
		<div className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:py-6 sm:first:pt-0 sm:last:pb-0">
			<div>
				<p className="flex items-center gap-2 text-sm font-medium text-foreground">
					<HardDriveIcon className="h-4 w-4" /> Local Storage
				</p>
				<p className="mt-1 w-full text-xs text-muted-foreground sm:max-w-[85%]">
					Monitor your library's storage usage. Browsers may automatically clear unprotected data to
					free up space.
				</p>
			</div>

			<div className="grid gap-3 sm:grid-cols-2">
				<div className="flex flex-col justify-center gap-2 rounded-xl border border-border/50 bg-background p-3 corner-squircle supports-[corner-shape:squircle]:rounded-4xl sm:p-4">
					<div className="flex items-center justify-between text-xs font-medium">
						<span className="text-muted-foreground">Usage</span>
						<span className="text-foreground">
							{storageUsage !== null ? formatBytes(storageUsage) : "Calculating..."}
							{storageQuota ? ` / ${formatBytes(storageQuota)}` : ""}
						</span>
					</div>
					<div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
						<div
							className={cn(
								"h-full rounded-full transition-all duration-500",
								usagePercentage > 80 ? "bg-destructive" : "bg-primary",
							)}
							style={{ width: `${Math.max(usagePercentage, 1)}%` }}
						/>
					</div>
				</div>

				<div
					className={cn(
						"flex flex-col justify-center rounded-xl border border-border/50 p-3 corner-squircle supports-[corner-shape:squircle]:rounded-4xl sm:p-4",
						isPersisted
							? "border-green-500/20 bg-green-500/5"
							: "border-amber-500/20 bg-amber-500/5",
					)}
				>
					<div className="flex items-center justify-between gap-3">
						<div className="space-y-0.5">
							<p
								className={cn(
									"flex items-center gap-1.5 text-xs font-semibold",
									isPersisted
										? "text-green-600 dark:text-green-500"
										: "text-amber-600 dark:text-amber-500",
								)}
							>
								{isPersisted ? (
									<ShieldCheckIcon className="h-3.5 w-3.5" />
								) : (
									<ShieldAlertIcon className="h-3.5 w-3.5" />
								)}
								{isPersisted ? "Data Protected" : "Data At Risk"}
							</p>
							<p className="text-[10px] leading-snug text-muted-foreground">
								{isPersisted ? "Browser eviction prevented." : "May be cleared by browser."}
							</p>
						</div>
						{!isPersisted && (
							<Button size="sm" onClick={handleRequestPersist} className="text-xs">
								Protect
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
