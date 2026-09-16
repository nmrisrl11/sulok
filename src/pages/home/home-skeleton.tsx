import { Skeleton } from "@/components/ui/skeleton";
import { ExplorerMainSkeleton } from "@/features/folders/components/explorer-main";
import { cn } from "@/lib/utils";

function HomeHeaderArea() {
	return (
		<div className="flex flex-col justify-between gap-4 px-2 sm:flex-row sm:items-center sm:px-0">
			<h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
				Your Corner
			</h2>
		</div>
	);
}

export function HomeSkeleton({ className }: { className?: string }) {
	return (
		<main className={cn("flex flex-col gap-10", className)}>
			<div className="flex flex-col gap-4">
				<HomeHeaderArea />
				<div className="flex flex-col items-start gap-6 md:flex-row md:gap-8">
					<div className="sticky top-2 z-20 w-full shrink-0 rounded-xl border bg-card/80 p-1.5 shadow-sm backdrop-blur-md transition-all md:static md:z-auto md:w-56 md:rounded-lg md:bg-card/30 md:p-2 md:backdrop-blur-none">
						<nav className="flex w-full flex-row gap-1 md:flex-col md:gap-1.5">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="flex flex-1 flex-col items-center justify-center gap-1 rounded-md bg-muted/20 p-2 corner-squircle supports-[corner-shape:squircle]:rounded-xl md:h-9 md:flex-row md:justify-start md:gap-3 md:px-3 md:py-2"
								>
									<Skeleton className="size-5 shrink-0 md:size-4" />
									<Skeleton className="h-2 w-10 md:h-3.5 md:w-16" />
								</div>
							))}
						</nav>
					</div>
					<div className="flex w-full min-w-0 flex-1 flex-col">
						{/* ExplorerToolbar mock */}
						<div className="mb-6 flex flex-col gap-4">
							<div className="flex min-h-10 flex-row items-center justify-between gap-2 px-1">
								<div className="flex items-center gap-2">
									<Skeleton className="h-5 w-5 rounded-md" />
									<Skeleton className="h-5 w-24" />
								</div>
								<div className="flex shrink-0 items-center gap-1">
									<div className="flex h-8 items-center justify-center rounded-md bg-muted/20 px-2 supports-[corner-shape:squircle]:rounded-lg sm:px-3">
										<Skeleton className="size-4 sm:mr-2" />
										<Skeleton className="hidden h-4 w-16 sm:block" />
									</div>
									<div className="h-4 w-px bg-border/50" />
									<div className="flex h-8 items-center justify-center rounded-md bg-muted/20 px-2 supports-[corner-shape:squircle]:rounded-lg sm:px-3">
										<Skeleton className="size-4 sm:mr-2" />
										<Skeleton className="hidden h-4 w-20 sm:block" />
									</div>
								</div>
							</div>
							<div className="flex flex-col gap-1.5 rounded-lg border border-border/40 bg-muted/30 p-1.5 shadow-sm backdrop-blur-md supports-[corner-shape:squircle]:rounded-xl supports-[corner-shape:squircle]:corner-squircle sm:min-h-11 sm:flex-row sm:items-center sm:gap-2">
								<div className="relative flex w-full flex-1 items-center gap-2 px-1 sm:p-0">
									<Skeleton className="size-4 rounded-sm" />
									<Skeleton className="h-4 w-32 bg-background/50" />
								</div>

								<div className="mx-2 h-px bg-border/50 sm:hidden" />

								<div className="flex w-full items-center justify-between gap-2 px-1 sm:w-auto sm:justify-end sm:gap-1 sm:p-0">
									<Skeleton className="h-8 flex-1 rounded-md bg-background/50 supports-[corner-shape:squircle]:rounded-md supports-[corner-shape:squircle]:corner-squircle sm:w-45 sm:flex-none" />
									<div className="mx-1 hidden h-4 w-px bg-border/50 sm:block" />
									<div className="flex shrink-0 items-center gap-1">
										<Skeleton className="size-8 rounded-md bg-background/50 supports-[corner-shape:squircle]:rounded-lg supports-[corner-shape:squircle]:corner-squircle" />
										<Skeleton className="size-8 rounded-md bg-background/50 supports-[corner-shape:squircle]:rounded-lg supports-[corner-shape:squircle]:corner-squircle" />
									</div>
								</div>
							</div>
						</div>
						{/* SelectionHeader mock */}
						<div className="mt-1 flex items-center justify-between px-2 pb-2">
							<div className="flex items-center gap-3">
								<Skeleton className="h-4 w-4 rounded-sm" />
								<Skeleton className="h-4 w-12" />
							</div>
							<Skeleton className="h-4 w-12" />
						</div>
						{/* Main List */}
						<div className="custom-scrollbar relative mt-2 max-h-[calc(100dvh-180px)] overflow-y-auto pr-2 pb-24 md:max-h-[calc(100dvh-130px)] md:pb-32">
							<ExplorerMainSkeleton />
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
