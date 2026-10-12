import { APP_INFO } from "@/constants/app-info";
import { useSettingsStore } from "@/stores";
import { Fragment } from "react";
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

	const footerItems: FooterItem[] = [
		{
			type: "link",
			label: "About",
			to: "/about",
			title: `Learn more about ${APP_INFO.name}`,
		},
		{
			type: "link",
			label: "Get App",
			to: "/install",
			title: `Get ${APP_INFO.name} on your device`,
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
		</footer>
	);
}
