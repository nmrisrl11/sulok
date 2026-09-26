import { FastIcon, OfflineIcon, ScreenAppIcon } from "@/components/icons";
import { SuloMascot } from "@/components/logo/sulo-mascot";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_INFO } from "@/constants/app-info";
import { CHANGELOG_DATA } from "@/data/changelog";
import { useInstallApp } from "@/hooks";
import { CheckCircle2Icon, DownloadIcon, MonitorSmartphoneIcon, ShareIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FEATURES = [
	{
		icon: OfflineIcon,
		title: "Offline Access",
		description: "View and manage your saved links even without an internet connection.",
	},
	{
		icon: ScreenAppIcon,
		title: "Home Screen App",
		description: `Launch ${APP_INFO.name} directly from your device's home screen or dock.`,
	},
	{
		icon: FastIcon,
		title: "Fast Loading",
		description: "Loads instantly because your library is stored locally on your device.",
	},
];

export function InstallPage() {
	const { isInstallable, isInstalled, isIOS, isDesktop, isChecking, promptInstall } =
		useInstallApp();
	const navigate = useNavigate();

	const currentVersion = CHANGELOG_DATA[0].version;

	const renderCTA = () => {
		if (isInstalled) {
			return (
				<div className="flex w-full flex-col items-center gap-3 rounded-2xl border bg-primary/10 p-6 text-center corner-squircle supports-[corner-shape:squircle]:rounded-[3rem]">
					<CheckCircle2Icon className="h-12 w-12 text-primary" />
					<div className="flex flex-col gap-1">
						<h2 className="font-bold text-primary">Already in your corner!</h2>
						<p className="text-sm text-muted-foreground">
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
						<h2 className="font-heading font-medium text-foreground">Install {APP_INFO.name}</h2>
						<p className="text-xs text-muted-foreground">Fast, offline access</p>
					</div>
					<Button
						onClick={promptInstall}
						className="h-9 rounded-full px-5 font-semibold shadow-none"
					>
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
						<h2 className="font-heading text-base font-bold text-foreground">iOS Installation</h2>
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
						<h2 className="font-heading text-base font-bold text-foreground">
							Browser Installation
						</h2>
						<p className="text-sm leading-relaxed text-muted-foreground">
							Add {APP_INFO.name} directly to your desktop. Look for the{" "}
							<strong>install icon</strong> in your address bar, or check your browser's menu for{" "}
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
				<h2 className="font-heading text-base font-bold text-foreground">
					Installation Unavailable
				</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					You might already be inside your corner, or your current browser doesn't support direct
					app installation.
				</p>
			</div>
		);
	};

	return (
		<div className="relative flex h-full flex-col">
			<div className="mx-auto flex w-full max-w-3xl flex-1 animate-in flex-col p-4 text-center duration-700 fade-in slide-in-from-bottom-8">
				{/* Branding / App Icon */}
				<div className="relative mb-6 flex flex-col items-center">
					<div className="relative mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border bg-card corner-squircle supports-[corner-shape:squircle]:rounded-full">
						<SuloMascot expression="attentive" className="h-12 w-12 text-foreground" />
					</div>
					<div className="mt-4 rounded-full border bg-muted/50 px-3 py-1 text-[10px] font-medium tracking-wide text-muted-foreground">
						v{currentVersion}
					</div>
				</div>

				{/* Premium Copywriting */}
				<h1 className="mb-3 font-heading text-3xl font-bold tracking-tight text-foreground">
					Install {APP_INFO.name}
				</h1>
				<p className="mx-auto mb-10 max-w-lg text-base text-balance text-muted-foreground">
					Keep your personal library accessible at all times. Install {APP_INFO.name} to view and
					organize your saved links faster, directly from your home screen.
				</p>

				{/* Installation CTA Logic */}
				<div className="mx-auto mb-16 flex w-full max-w-sm flex-col items-center gap-4">
					{renderCTA()}
				</div>

				{/* Features Header */}
				<div className="mt-4 mb-8 flex w-full flex-col items-center gap-2 text-center">
					<h2 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
						Why install {APP_INFO.name}?
					</h2>
					<p className="text-sm text-muted-foreground">
						Experience a more native and seamless way to access your corner of the web.
					</p>
				</div>

				{/* Features Grid */}
				<div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
					{FEATURES.map((feature, index) => {
						const Icon = feature.icon;
						return (
							<div
								key={index}
								className="flex flex-col items-center rounded-2xl border bg-card p-5 text-center corner-squircle supports-[corner-shape:squircle]:rounded-[2rem]"
							>
								<div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary corner-squircle supports-[corner-shape:squircle]:rounded-full">
									<Icon className="h-5 w-5" />
								</div>
								<h3 className="mb-1 font-heading text-lg font-medium text-foreground">
									{feature.title}
								</h3>
								<p className="text-xs leading-relaxed text-muted-foreground">
									{feature.description}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
