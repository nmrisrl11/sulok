import { SulokLogo } from "@/components/logo/sulok-logo";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { useLogoStore } from "@/stores/logo-store";
import { NavLink } from "react-router-dom";

export function Header() {
	const setTemporaryExpression = useLogoStore((state) => state.setTemporaryExpression);
	const clearTemporaryExpression = useLogoStore((state) => state.clearTemporaryExpression);

	return (
		<header className="flex items-center justify-between p-4 md:py-6">
			<SulokLogo />
			<nav className="flex items-center gap-2 sm:gap-6">
				<div className="flex items-center gap-1 bg-black/5 dark:bg-white/10 rounded-full p-1 shadow-inner">
					<NavLink
						to="/about"
						onMouseEnter={() => setTemporaryExpression("shy", 10000)}
						onMouseLeave={clearTemporaryExpression}
						className={({ isActive }) =>
							cn(
								"transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer rounded-full px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm font-medium",
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
								"transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer rounded-full px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm font-medium",
								isActive
									? "bg-background text-foreground shadow-sm"
									: "text-muted-foreground hover:text-foreground",
							)
						}
					>
						Updates
					</NavLink>
				</div>
				<ModeToggle />
			</nav>
		</header>
	);
}
