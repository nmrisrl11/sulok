import { APP_INFO } from "@/constants/app-info";

export function Header() {
	return (
		<header className="flex items-center justify-between py-10 px-6 sm:px-0">
			<div
				className="font-sans text-3xl font-extrabold italic"
				style={{ fontVariationSettings: "'WONK' 0, 'SOFT' 0" }}
			>
				{APP_INFO.name}
			</div>
			<nav className="text-muted-foreground flex items-center gap-6 text-sm font-medium">
				<button type="button" className="hover:text-foreground transition-colors cursor-pointer">
					About
				</button>
				<button type="button" className="hover:text-foreground transition-colors cursor-pointer">
					What's new
				</button>
			</nav>
		</header>
	);
}
