import { SulokLogo } from "@/components/logo/sulok-logo";
import { useIsMobile } from "@/hooks";
import { cn } from "@/lib/utils";
import { useLogoStore, useUIStore, type SuloExpression } from "@/stores";
import { AnimatePresence, motion } from "framer-motion";
import { WandSparklesIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

const navLinks: { to: string; label: string; expression: SuloExpression }[] = [
	{ to: "/updates", label: "Updates", expression: "excited" },
	{ to: "/settings", label: "Settings", expression: "attentive" },
];

export function Header() {
	const setTemporaryExpression = useLogoStore((state) => state.setTemporaryExpression);
	const clearTemporaryExpression = useLogoStore((state) => state.clearTemporaryExpression);
	const isWhisperVisible = useLogoStore((state) => state.isWhisperVisible);
	const isMobile = useIsMobile();

	return (
		<header className="sticky top-0 z-50 flex items-center justify-between bg-background/90 px-4 pt-[calc(env(safe-area-inset-top)+1rem)] pb-4 backdrop-blur-md md:px-8 md:pt-[calc(env(safe-area-inset-top)+1.5rem)] md:pb-6">
			<SulokLogo />
			<nav className="flex items-center gap-2 sm:gap-4">
				<div className="flex items-center gap-1 rounded-full bg-black/5 p-1 shadow-inner dark:bg-white/10">
					<AnimatePresence initial={false}>
						{(!isWhisperVisible || !isMobile) && (
							<motion.div
								initial={{ width: 0, opacity: 0 }}
								animate={{ width: "auto", opacity: 1 }}
								exit={{ width: 0, opacity: 0 }}
								className="flex items-center gap-1 overflow-hidden"
							>
								{navLinks.map((link) => (
									<NavLink
										key={link.to}
										to={link.to}
										title={link.label}
										onMouseEnter={() => setTemporaryExpression(link.expression, 10000)}
										onMouseLeave={clearTemporaryExpression}
										className={({ isActive }) =>
											cn(
												"cursor-pointer rounded-full px-2 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3 sm:py-1.5 sm:text-sm",
												isActive
													? "bg-background text-foreground shadow-engraved"
													: "text-muted-foreground hover:text-foreground",
											)
										}
									>
										{link.label}
									</NavLink>
								))}
								<div className="mx-0.5 h-4 w-px shrink-0 bg-border/50" />
							</motion.div>
						)}
					</AnimatePresence>
					<button
						type="button"
						id="quick-customize-btn"
						onClick={() => useUIStore.getState().toggleQuickCustomize()}
						onMouseEnter={() => setTemporaryExpression("curious", 10000)}
						onMouseLeave={clearTemporaryExpression}
						className={cn(
							"flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:h-8 sm:w-8",
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
