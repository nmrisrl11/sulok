import { SulokLogo } from "@/components/logo/sulok-logo";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { useLogoStore } from "@/stores/logo-store";
import { NavLink } from "react-router-dom";

export function Header() {
	const setTemporaryExpression = useLogoStore((state) => state.setTemporaryExpression);
	const clearTemporaryExpression = useLogoStore((state) => state.clearTemporaryExpression);

	return (
		<header className="flex items-center justify-between py-10 px-6 sm:px-0">
			<SulokLogo />
			<nav className="text-muted-foreground flex items-center gap-6 text-sm font-medium">
				<NavLink
					to="/about"
					onMouseEnter={() => setTemporaryExpression("shy", 10000)}
					onMouseLeave={clearTemporaryExpression}
					className={({ isActive }) =>
						cn(
							"transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 py-0.5",
							isActive ? "text-primary" : "hover:text-foreground",
						)
					}
				>
					About
				</NavLink>
				<button
					type="button"
					onMouseEnter={() => setTemporaryExpression("shy", 10000)}
					onMouseLeave={clearTemporaryExpression}
					className="hover:text-foreground transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 py-0.5"
					disabled
					title="Coming soon"
				>
					What's new
				</button>
				<ModeToggle />
			</nav>
		</header>
	);
}
