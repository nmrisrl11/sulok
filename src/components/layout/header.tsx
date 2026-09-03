export function Header() {
	return (
		<header className="flex items-center justify-between py-10 px-6 sm:px-0">
			<div
				className="font-sans text-3xl font-extrabold italic"
				style={{ fontVariationSettings: "'WONK' 0, 'SOFT' 0" }}
			>
				Sulok
			</div>
			<nav className="text-muted-foreground flex items-center gap-6 text-sm font-medium">
				<a href="#" className="hover:text-foreground transition-colors">
					About
				</a>
				<a href="#" className="hover:text-foreground transition-colors">
					What's new
				</a>
			</nav>
		</header>
	);
}
