import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { APP_INFO } from "@/constants/app-info";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/stores";

export function ReferralTrackingSetting() {
	const { settings, updateSettings } = useSettingsStore();

	return (
		<div className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:py-6 sm:first:pt-0 sm:last:pb-0">
			<div className="space-y-1">
				<div className="flex items-center justify-between gap-4">
					<Label
						htmlFor="referral-tracking"
						className="cursor-pointer text-sm font-medium text-foreground"
					>
						Referral Tracking
					</Label>
					<Switch
						id="referral-tracking"
						checked={settings.privacySettings?.enableReferralTracking ?? false}
						onCheckedChange={(checked) =>
							updateSettings({
								privacySettings: {
									...settings.privacySettings,
									enableReferralTracking: checked,
								},
							})
						}
					/>
				</div>
				<p className="w-full text-xs text-muted-foreground sm:max-w-[85%]">
					Support {APP_INFO.name} by anonymously letting websites know you discovered them here.
					This appends a small tag to external links when you open them.
				</p>
			</div>
			<div className="rounded-xl border border-border/50 bg-muted/30 p-3 text-xs corner-squircle supports-[corner-shape:squircle]:rounded-2xl">
				<span className="font-medium text-foreground">Preview: </span>
				<span className="text-muted-foreground">https://example.com/</span>
				<span
					className={cn(
						"transition-all duration-300",
						settings.privacySettings?.enableReferralTracking
							? "font-medium text-primary"
							: "text-muted-foreground/50 line-through",
					)}
				>
					?ref={APP_INFO.name.toLowerCase()}
				</span>
			</div>
		</div>
	);
}
