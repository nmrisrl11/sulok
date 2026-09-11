import { SulokLogo } from "@/components/logo/sulok-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLogoStore } from "@/stores/logo-store";
import { SettingsIcon } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

export function Header() {
	const setTemporaryExpression = useLogoStore((state) => state.setTemporaryExpression);
	const clearTemporaryExpression = useLogoStore((state) => state.clearTemporaryExpression);
	const location = useLocation();

	return (
		<header className="flex items-center justify-between p-4 md:py-6">
			<SulokLogo />
			<nav className="flex items-center gap-2 sm:gap-4">
				<div className="flex items-center gap-1 rounded-full bg-black/5 p-1 shadow-inner dark:bg-white/10">
					<NavLink
						to="/about"
						onMouseEnter={() => setTemporaryExpression("shy", 10000)}
						onMouseLeave={clearTemporaryExpression}
						className={({ isActive }) =>
							cn(
								"cursor-pointer rounded-full px-2 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3 sm:py-1.5 sm:text-sm",
								isActive
									? "bg-background text-foreground shadow-sm"
									: "text-muted-foreground hover:text-foreground",
							)
						}
					>
						About
					</NavLink>
					<NavLink
						to="/updates"
						onMouseEnter={() => setTemporaryExpression("shy", 10000)}
						onMouseLeave={clearTemporaryExpression}
						className={({ isActive }) =>
							cn(
								"cursor-pointer rounded-full px-2 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3 sm:py-1.5 sm:text-sm",
								isActive
									? "bg-background text-foreground shadow-sm"
									: "text-muted-foreground hover:text-foreground",
							)
						}
					>
						Updates
					</NavLink>
				</div>
				<div className="flex items-center gap-1">
					<Button
						variant="ghost"
						size="icon"
						asChild
						className={cn(
							"rounded-full transition-colors",
							location.pathname === "/settings" && "bg-accent",
						)}
					>
						<NavLink to="/settings">
							<SettingsIcon className="h-5 w-5" />
							<span className="sr-only">Settings</span>
						</NavLink>
					</Button>
				</div>
			</nav>
		</header>
	);
}
