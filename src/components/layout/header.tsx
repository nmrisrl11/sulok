import { SulokLogo } from "@/components/logo/sulok-logo";
import { useIsMobile } from "@/hooks";
import { cn } from "@/lib/utils";
import { useLogoStore, useUIStore, type SuloExpression } from "@/stores";
import { AnimatePresence, motion } from "framer-motion";
import { SearchIcon, WandSparklesIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

const navLinks: { to: string; label: string; expression: SuloExpression }[] = [
	{ to: "/about", label: "About", expression: "shy" },
	{ to: "/settings", label: "Settings", expression: "attentive" },
];

export function Header() {
	const setTemporaryExpression = useLogoStore((state) => state.setTemporaryExpression);
	const clearTemporaryExpression = useLogoStore((state) => state.clearTemporaryExpression);
	const isSuloVisible = useLogoStore((state) => state.isSuloVisible);
	const isWhisperVisible = useLogoStore((state) => state.isWhisperVisible);
	const isMobile = useIsMobile();

	return (
		<header className="sticky top-0 z-50 flex items-center justify-between overflow-visible bg-background/90 px-4 pt-[calc(env(safe-area-inset-top)+1rem)] pb-4 backdrop-blur-md md:px-8 md:pt-[calc(env(safe-area-inset-top)+1.5rem)] md:pb-6">
			<SulokLogo />
			<nav className="flex max-w-full shrink-0 items-center gap-2 sm:gap-4">
				<div className="flex h-9 shrink-0 items-center gap-1 rounded-full bg-black/5 py-0.5 pr-1.5 pl-1 shadow-inner sm:h-10 sm:gap-1.5 sm:pr-1.5 dark:bg-white/10">
					<AnimatePresence initial={false}>
						{((isSuloVisible && !isWhisperVisible) || !isMobile) && (
							<motion.div
								initial={{ width: 0, opacity: 0 }}
								animate={{ width: "auto", opacity: 1 }}
								exit={{ width: 0, opacity: 0 }}
								className="flex items-center gap-1 overflow-hidden py-0.5 pl-0.5 sm:gap-1.5"
							>
								{navLinks.map((link) => (
									<NavLink
										key={link.to}
										to={link.to}
										title={link.label}
										onClick={() => window.scrollTo(0, 0)}
										onMouseEnter={() => setTemporaryExpression(link.expression, 10000)}
										onMouseLeave={clearTemporaryExpression}
										className={({ isActive }) =>
											cn(
												"relative flex h-7 shrink-0 items-center justify-center rounded-full px-3 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-8 sm:px-4 sm:text-sm",
												isActive
													? "bg-background text-foreground shadow-engraved"
													: "text-muted-foreground hover:text-foreground",
											)
										}
									>
										{link.label}
									</NavLink>
								))}
								<div className="mx-0.5 h-4 w-px shrink-0 bg-border/50 sm:mx-1" />
							</motion.div>
						)}
					</AnimatePresence>
					<button
						type="button"
						id="command-palette-btn"
						title="Search (Cmd+K / Ctrl+K)"
						onClick={() => {
							// Using dynamic import or direct store access to avoid circular dependency if any
							import("@/stores").then((m) => m.useCommandStore.getState().toggle());
						}}
						onMouseEnter={() => setTemporaryExpression("attentive", 10000)}
						onMouseLeave={clearTemporaryExpression}
						className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:h-8 sm:w-8"
					>
						<SearchIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
						<span className="sr-only">Search (Command Palette)</span>
					</button>
					<button
						type="button"
						id="quick-customize-btn"
						title="Quick Customize (Shift+C)"
						onClick={() => useUIStore.getState().toggleQuickCustomize()}
						onMouseEnter={() => setTemporaryExpression("curious", 10000)}
						onMouseLeave={clearTemporaryExpression}
						className={cn(
							"flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:h-8 sm:w-8",
							useUIStore((state) => state.isQuickCustomizeOpen)
								? "border-0 bg-background text-foreground shadow-engraved"
								: "text-muted-foreground hover:bg-background/50 hover:text-foreground",
						)}
					>
						<WandSparklesIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
						<span className="sr-only">Quick Customize</span>
					</button>
				</div>
			</nav>
		</header>
	);
}
