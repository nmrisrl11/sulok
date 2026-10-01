import { ExternalLinkIcon, FastIcon, OfflineIcon, ScreenAppIcon } from "@/components/icons";
import { SuloMascot } from "@/components/logo/sulo-mascot";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_INFO } from "@/constants/app-info";
import { CHANGELOG_DATA } from "@/data/changelog";
import EXT_MANIFEST from "@/extension/manifest.json";
import { useInstallApp } from "@/hooks";
import { useSettingsStore } from "@/stores";
import {
	CheckCircle2Icon,
	DownloadCloudIcon,
	DownloadIcon,
	MonitorSmartphoneIcon,
	MousePointerClickIcon,
	ShareIcon,
	ZapIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const appFeatures = [
	{
		title: "Offline Access",
		description: "View and manage your saved links even without an internet connection.",
		icon: OfflineIcon,
	},
	{
		title: "Native Experience",
		description: `Launch ${APP_INFO.name} directly from your device's home screen or dock, just like a native app.`,
		icon: ScreenAppIcon,
	},
	{
		title: "Lightning Fast",
		description: "Loads instantly because your library is stored directly on your device.",
		icon: FastIcon,
	},
];

const extensionFeatures = [
	{
		title: "Zero-Click Saving",
		description:
			"Right-click anywhere to save articles and links directly into your library using Context Menus.",
		icon: MousePointerClickIcon,
	},
	{
		title: "Instant Popup",
		description: "A beautifully fast, searchable folder interface right in your browser toolbar.",
		icon: ZapIcon,
	},
	{
		title: "Smart Context",
		description:
			"Intelligently detects duplicates and warns you if a link is already in your Recycle Bin.",
		icon: CheckCircle2Icon,
	},
];

function InstallAppCTA() {
	const { isInstallable, isInstalled, isIOS, isDesktop, isChecking, promptInstall } =
		useInstallApp();
	const navigate = useNavigate();

	if (isInstalled) {
		return (
			<div className="flex w-full flex-col items-center gap-3 rounded-2xl border bg-primary/10 p-6 text-center corner-squircle supports-[corner-shape:squircle]:rounded-[3rem]">
				<CheckCircle2Icon className="h-10 w-10 text-primary" />
				<div className="flex flex-col gap-1">
					<h3 className="font-bold text-primary">Already in your corner!</h3>
					<p className="text-sm text-primary/80">
						You are currently using the installed version of {APP_INFO.name}.
					</p>
				</div>
				<Button className="mt-2 w-full" onClick={() => navigate("/")}>
					Open Library
				</Button>
			</div>
		);
	}

	if (isInstallable) {
		return (
			<div className="flex w-full items-center gap-4 rounded-2xl border bg-card p-4 text-left shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-[2rem]">
				<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary corner-squircle supports-[corner-shape:squircle]:rounded-full">
					<DownloadIcon className="h-6 w-6" />
				</div>
				<div className="flex flex-1 flex-col">
					<h3 className="font-heading font-medium text-foreground">Install {APP_INFO.name}</h3>
					<p className="text-xs text-muted-foreground">Fast, offline access</p>
				</div>
				<Button onClick={promptInstall} className="h-9 rounded-full px-5 font-semibold shadow-none">
					Get
				</Button>
			</div>
		);
	}

	if (isIOS) {
		return (
			<div className="flex w-full flex-col items-center gap-4 rounded-2xl border bg-card p-6 text-center shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-[3rem]">
				<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary corner-squircle supports-[corner-shape:squircle]:rounded-full">
					<ShareIcon className="h-6 w-6" />
				</div>
				<div className="flex flex-col gap-1">
					<h3 className="font-heading text-base font-bold text-foreground">iOS Installation</h3>
					<p className="text-sm leading-relaxed text-muted-foreground">
						Bring {APP_INFO.name} to your device. Tap the{" "}
						<strong className="text-foreground">Share</strong> icon below, then select{" "}
						<strong className="text-foreground">Add to Home Screen</strong>.
					</p>
				</div>
			</div>
		);
	}

	if (isChecking) {
		return (
			<div
				role="alert"
				aria-label="Checking installation status"
				className="flex w-full items-center gap-4 rounded-2xl border bg-card p-4 text-left shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-[2rem]"
			>
				<Skeleton className="h-12 w-12 shrink-0 rounded-xl corner-squircle supports-[corner-shape:squircle]:rounded-full" />
				<div className="flex flex-1 flex-col justify-center gap-2">
					<Skeleton className="h-4 w-28" />
					<Skeleton className="h-3 w-24" />
				</div>
				<Skeleton className="h-9 w-16 rounded-full" />
			</div>
		);
	}

	if (isDesktop) {
		return (
			<div className="flex w-full flex-col items-center gap-4 rounded-2xl border bg-card p-6 text-center shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-[3rem]">
				<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary corner-squircle supports-[corner-shape:squircle]:rounded-full">
					<MonitorSmartphoneIcon className="h-6 w-6" />
				</div>
				<div className="flex flex-col gap-1">
					<h3 className="font-heading text-base font-bold text-foreground">Browser Installation</h3>
					<p className="text-sm leading-relaxed text-muted-foreground">
						Add {APP_INFO.name} directly to your desktop. Look for the <strong>install icon</strong>{" "}
						in your address bar, or check your browser's menu for{" "}
						<strong className="text-foreground">Install App</strong>.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex w-full flex-col items-center gap-2 rounded-2xl border bg-muted p-6 text-center corner-squircle supports-[corner-shape:squircle]:rounded-[3rem]">
			<div className="mb-1 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary corner-squircle supports-[corner-shape:squircle]:rounded-full">
				<MonitorSmartphoneIcon className="h-5 w-5" />
			</div>
			<h3 className="font-heading text-base font-bold text-foreground">Installation Unavailable</h3>
			<p className="text-sm leading-relaxed text-muted-foreground">
				You might already be inside your corner, or your current browser doesn't support direct app
				installation.
			</p>
		</div>
	);
}

function ExtensionInstallCTA({ version }: { version: string }) {
	const downloadUrl = `${APP_INFO.githubReleasesUrl}/download/v${version}/sulok-extension-v${version}.zip`;

	return (
		<div className="mt-2 flex max-w-xl flex-col gap-5 rounded-3xl border border-primary/20 bg-primary/3 p-6 corner-squircle supports-[corner-shape:squircle]:rounded-[2rem]">
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div className="flex flex-col gap-1">
					<h3 className="font-bold text-foreground">Manual Installation</h3>
					<p className="text-xs font-medium text-muted-foreground">
						Requires Developer Mode in Chromium browsers
					</p>
				</div>
				<div>
					<Button asChild className="h-10 shrink-0 rounded-full px-6 font-semibold shadow-none">
						<a href={downloadUrl} target="_blank" rel="noopener noreferrer">
							<DownloadCloudIcon className="mr-2 h-4 w-4" />
							Download .zip
						</a>
					</Button>
				</div>
			</div>

			<div className="flex flex-col gap-3 border-t border-primary/10 pt-5 text-[13px] leading-relaxed text-muted-foreground">
				<ol className="ml-5 list-decimal space-y-2">
					<li>Download and unzip the file to a permanent folder on your computer.</li>
					<li>
						Type{" "}
						<code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
							chrome://extensions
						</code>{" "}
						in your URL bar.
					</li>
					<li>
						Toggle <strong className="text-foreground">Developer mode</strong> (top right).
					</li>
					<li>
						Click <strong className="text-foreground">Load unpacked</strong> and select your
						unzipped folder.
					</li>
				</ol>
			</div>
		</div>
	);
}

export function InstallPage() {
	const currentAppVersion = CHANGELOG_DATA[0].version;
	const currentExtVersion = EXT_MANIFEST.version;
	const extReleaseDate = "October 2026";

	return (
		<div className="relative flex h-full flex-col">
			<div className="container mx-auto px-4 py-12 md:px-8 md:py-20 lg:max-w-6xl">
				<div className="flex animate-in flex-col gap-12 duration-700 fade-in slide-in-from-bottom-8 lg:flex-row lg:gap-20">
					{/* Left Column: Branding and Details */}
					<div className="w-full lg:max-w-90 lg:border-r lg:border-border/60 lg:pr-12">
						<div className="flex flex-col lg:sticky lg:top-32 lg:pb-12">
							{/* Logo */}
							<div className="mb-8 flex h-24 w-24 items-center justify-center overflow-hidden rounded-[2rem] border bg-card shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-full">
								<SuloMascot
									expression={useSettingsStore(
										(state) => state.settings.suloSettings.expressionInstallPage,
									)}
									className="h-14 w-14 text-foreground"
								/>
							</div>

							{/* Header */}
							<h1 className="mb-4 font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
								Get{" "}
								<span className="italic" style={{ fontVariationSettings: "'WONK' 0, 'SOFT' 0" }}>
									{APP_INFO.name}
								</span>
							</h1>
							<p className="mb-10 text-base leading-relaxed text-muted-foreground">
								Choose how you want to experience your corner of the web. Install the local-first
								web app for full offline access, or get the browser extension for seamless saving.
							</p>

							{/* Version Details */}
							<dl className="space-y-4 text-sm text-muted-foreground">
								<div className="flex items-center justify-between gap-4">
									<dt className="font-medium text-foreground">Web App Version</dt>
									<dd className="font-mono text-xs">{currentAppVersion}</dd>
								</div>
								<div className="flex items-center justify-between gap-4">
									<dt className="font-medium text-foreground">Extension Version</dt>
									<dd className="font-mono text-xs">{currentExtVersion}</dd>
								</div>
								<div className="flex items-center justify-between gap-4">
									<dt className="font-medium text-foreground">Extension Status</dt>
									<dd>Beta ({extReleaseDate})</dd>
								</div>
							</dl>

							<div className="mt-8 border-t border-border/50 pt-8">
								<a
									href={APP_INFO.githubReleasesUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
								>
									View all extension releases <ExternalLinkIcon className="h-3 w-3" />
								</a>
							</div>
						</div>
					</div>

					{/* Right Column: Installation Sections */}
					<div className="flex flex-1 flex-col gap-14">
						{/* PWA Section */}
						<div className="flex flex-col gap-6">
							<div>
								<h2 className="font-heading text-2xl font-bold text-foreground">
									Desktop & Mobile App
								</h2>
								<p className="mt-2 text-sm text-muted-foreground">
									The complete standalone application. Fast, offline access directly from your
									device's home screen or dock.
								</p>
							</div>

							<ul className="flex flex-col gap-6">
								{appFeatures.map((feature) => (
									<li key={feature.title} className="flex items-start gap-4">
										<div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
											<feature.icon className="h-4 w-4" />
										</div>
										<div className="flex flex-col gap-1">
											<strong className="font-medium text-foreground">{feature.title}</strong>
											<span className="text-sm leading-relaxed text-muted-foreground">
												{feature.description}
											</span>
										</div>
									</li>
								))}
							</ul>

							{/* CTA Wrapper */}
							<div className="max-w-md pt-2">
								<InstallAppCTA />
							</div>
						</div>

						{/* Separator */}
						<div className="border-t border-border/50"></div>

						{/* Extension Section */}
						<div className="flex flex-col gap-6">
							<div>
								<div className="flex items-center gap-3">
									<h2 className="font-heading text-2xl font-bold text-foreground">
										Browser Extension
									</h2>
									<span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-primary uppercase">
										Beta
									</span>
								</div>
								<p className="mt-2 text-sm text-muted-foreground">
									The perfect companion. Save links instantly and organize your corner without
									leaving your current tab.
								</p>
							</div>

							<ul className="flex flex-col gap-6">
								{extensionFeatures.map((feature) => (
									<li key={feature.title} className="flex items-start gap-4">
										<div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
											<feature.icon className="h-4 w-4" />
										</div>
										<div className="flex flex-col gap-1">
											<strong className="font-medium text-foreground">{feature.title}</strong>
											<span className="text-sm leading-relaxed text-muted-foreground">
												{feature.description}
											</span>
										</div>
									</li>
								))}
							</ul>

							{/* Extension Download area */}
							<ExtensionInstallCTA version={currentExtVersion} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
