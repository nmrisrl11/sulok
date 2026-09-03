import { APP_INFO } from "@/constants/app-info";
import { cn } from "@/lib/utils";
import { Link, NavLink } from "react-router-dom";

export function Header() {
	return (
		<header className="flex items-center justify-between py-10 px-6 sm:px-0">
			<Link
				to="/"
				className="font-sans text-3xl font-extrabold italic outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm cursor-pointer"
				style={{ fontVariationSettings: "'WONK' 0, 'SOFT' 0" }}
			>
				{APP_INFO.name}
			</Link>
			<nav className="text-muted-foreground flex items-center gap-6 text-sm font-medium">
				<NavLink
					to="/about"
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
					className="hover:text-foreground transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 py-0.5"
					disabled
					title="Coming soon"
				>
					What's new
				</button>
			</nav>
		</header>
	);
}
