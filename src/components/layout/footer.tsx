import { NomiBot } from "@/components/nomi-bot";
import { APP_INFO } from "@/constants/app-info";
import { useSettingsStore } from "@/stores";
import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type FooterItem =
	| {
			type: "link";
			label: string;
			to: string;
			title?: string;
	  }
	| {
			type: "button";
			label: string;
			onClick: () => void;
	  };

export function Footer() {
	const updateSettings = useSettingsStore((state) => state.updateSettings);
	const navigate = useNavigate();
	const [isBotHovered, setIsBotHovered] = useState(false);

	const footerItems: FooterItem[] = [
		{
			type: "link",
			label: "Get App",
			to: "/install",
			title: `Get ${APP_INFO.name} on your device`,
		},
		{
			type: "link",
			label: "Guide",
			to: "/guide",
			title: `Tips and tricks for ${APP_INFO.name}`,
		},
		{
			type: "link",
			label: "Updates",
			to: "/updates",
			title: `View ${APP_INFO.name} release notes and updates`,
		},
		{
			type: "button",
			label: "App Tour",
			onClick: () => {
				updateSettings({ onboardingStatus: "in_progress", onboardingStep: 0 });
				navigate("/");
			},
		},
	];

	return (
		<footer className="mt-auto flex w-full justify-center text-muted-foreground">
			<div className="flex flex-col items-center justify-center gap-y-2">
				<div className="flex flex-wrap items-center justify-center gap-x-2 text-center text-[0.8rem] font-medium">
					{footerItems.map((item, index) => {
						const commonClasses = "-m-3 p-3 transition-colors hover:text-foreground";

						return (
							<Fragment key={item.label}>
								{item.type === "link" ? (
									<Link
										to={item.to}
										onClick={() => window.scrollTo(0, 0)}
										className={commonClasses}
										title={item.title}
									>
										{item.label}
									</Link>
								) : (
									<button
										type="button"
										onClick={item.onClick}
										className={`${commonClasses} cursor-pointer`}
									>
										{item.label}
									</button>
								)}
								{index < footerItems.length - 1 && (
									<span className="text-muted-foreground/30">•</span>
								)}
							</Fragment>
						);
					})}
				</div>
				<span className="flex items-center text-[0.8rem]">
					Developed by:
					<a
						href="https://www.nmrisrl.dev/"
						target="_blank"
						rel="noopener noreferrer"
						title="Visit Developer's Website"
						onMouseEnter={() => setIsBotHovered(true)}
						onMouseLeave={() => setIsBotHovered(false)}
						className="group ml-1 flex items-center font-medium transition-colors hover:text-foreground"
					>
						Nomer with{" "}
						<NomiBot
							isHovered={isBotHovered}
							className="ml-1 h-5 w-5"
							showBody={false}
							headBounce={false}
							eyeAnimation="look-left"
						/>
					</a>
				</span>
			</div>
		</footer>
	);
}
