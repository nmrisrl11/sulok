import { SuloMascot } from "@/components/logo/sulo-mascot";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import type { ChangelogRelease } from "@/data/changelog";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ListIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function UpdatesMinimap({ releases }: { releases: ChangelogRelease[] }) {
	const [activeVersion, setActiveVersion] = useState(releases[0]?.version);
	const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				const visibleEntries = entries.filter((e) => e.isIntersecting);
				if (visibleEntries.length > 0) {
					visibleEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
					setActiveVersion(visibleEntries[0].target.id.replace("v", ""));
				}
			},
			{ rootMargin: "-10% 0px -70% 0px" },
		);

		releases.forEach((release) => {
			const el = document.getElementById(`v${release.version}`);
			if (el) observer.observe(el);
		});

		return () => observer.disconnect();
	}, [releases]);
	const handleScrollTo = (version: string) => {
		window.history.pushState(null, "", `#v${version}`);

		const performScroll = () => {
			const el = document.getElementById(`v${version}`);
			if (el) {
				el.scrollIntoView({ behavior: "smooth" });
			}
		};

		if (isMobileDrawerOpen) {
			setIsMobileDrawerOpen(false);
		}

		performScroll();
	};

	const renderList = (idSuffix: string) => {
		const activeIndex = releases.findIndex((r) => r.version === activeVersion);

		return (
			<ul className="relative flex flex-col">
				{releases.map((release, index) => {
					const isActive = activeVersion === release.version;
					const isSeen = index <= activeIndex;
					const isLast = index === releases.length - 1;

					return (
						<li
							key={release.version}
							className={cn("relative flex items-center", isActive ? "z-50" : "z-10")}
						>
							{/* Active Pill Background */}
							{isActive && (
								<motion.div
									layoutId={`minimap-pill-${idSuffix}`}
									className="absolute inset-0 z-0 rounded-lg bg-muted shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-2xl"
									transition={{ type: "spring", stiffness: 400, damping: 30 }}
								/>
							)}

							<button
								type="button"
								onClick={() => handleScrollTo(release.version)}
								className={cn(
									"group relative flex w-full items-stretch rounded-xl p-1.5 transition-colors",
									isActive ? "z-20" : "z-10",
								)}
							>
								{/* Rail Container */}
								<div className="relative flex w-10 shrink-0 flex-col items-center justify-center">
									{/* Background Unseen Rail */}
									<div
										className={cn(
											"absolute left-1/2 -z-10 w-px -translate-x-1/2 bg-border",
											index === 0 ? "top-1/2" : "-top-1.5",
											isLast ? "bottom-1/2" : "-bottom-1.5",
										)}
									/>

									{/* Active Seen Rail */}
									{isSeen && (
										<div
											className={cn(
												"absolute left-1/2 z-0 w-px -translate-x-1/2 bg-primary",
												index === 0 ? "top-1/2" : "-top-1.5",
												isActive ? "bottom-1/2" : "-bottom-1.5",
											)}
										/>
									)}

									{/* Indicator / Dot */}
									<div className="relative z-10 flex h-6 w-6 items-center justify-center">
										{isActive ? (
											<motion.div
												layoutId={`minimap-indicator-${idSuffix}`}
												className="absolute z-20 flex h-6 w-6 items-center justify-center rounded-md bg-background shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-xl"
												transition={{ type: "spring", stiffness: 400, damping: 30 }}
											>
												<div className="h-4 w-4 text-primary">
													<SuloMascot expression="happy" />
												</div>
											</motion.div>
										) : (
											<div
												className={cn(
													"h-1.5 w-1.5 rounded-full transition-colors delay-150 duration-300",
													isSeen ? "bg-primary" : "bg-border group-hover:bg-foreground/30",
												)}
											/>
										)}
									</div>
								</div>

								{/* Text Label */}
								<div className="flex flex-1 items-center pr-3">
									<span
										className={cn(
											"text-left text-sm font-medium transition-colors",
											isActive
												? "font-bold text-foreground"
												: "text-muted-foreground group-hover:text-foreground",
										)}
									>
										v{release.version}
									</span>
								</div>
							</button>
						</li>
					);
				})}
			</ul>
		);
	};

	return (
		<>
			{/* Desktop Fixed Sidebar */}
			<aside className="fixed top-1/2 right-4 hidden w-48 -translate-y-1/2 flex-col gap-4 xl:flex 2xl:right-16 2xl:w-64">
				<h3 className="px-1.5 font-heading text-lg font-bold">Version History</h3>
				<div className="custom-scrollbar max-h-[70dvh] overflow-x-hidden overflow-y-auto pb-4">
					{renderList("desktop")}
				</div>
			</aside>

			{/* Mobile FAB Trigger & Drawer */}
			<div className="fixed top-1/2 right-4 z-40 -translate-y-1/2 lg:hidden">
				<Drawer open={isMobileDrawerOpen} onOpenChange={setIsMobileDrawerOpen} modal={false}>
					<DrawerTrigger asChild>
						<Button
							size="icon"
							className="h-12 w-12 rounded-full shadow-lg shadow-black/10 dark:shadow-black/40"
						>
							<ListIcon className="h-5 w-5" />
						</Button>
					</DrawerTrigger>
					<DrawerContent>
						<DrawerHeader className="text-left">
							<DrawerTitle className="font-heading text-xl font-bold">Version History</DrawerTitle>
						</DrawerHeader>
						<div
							className="custom-scrollbar max-h-[60vh] overflow-y-auto p-6 pt-2 pb-10"
							data-vaul-no-drag
						>
							{renderList("mobile")}
						</div>
					</DrawerContent>
				</Drawer>
			</div>
		</>
	);
}
