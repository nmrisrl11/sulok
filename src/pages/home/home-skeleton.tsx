import { Skeleton } from "@/components/ui/skeleton";
import { ExplorerMainSkeleton } from "@/features/folders/components/explorer/explorer-main";
import { cn } from "@/lib/utils";

export function HomeSkeleton({ className }: { className?: string }) {
	return (
		<main className={cn("flex flex-col gap-6 md:gap-8", className)}>
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-4 px-2 sm:flex-row sm:items-center sm:justify-between sm:px-0">
					<h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
						Your Corner
					</h2>
					<nav className="flex w-full flex-row gap-1 overflow-x-auto rounded-xl border border-border/40 bg-muted/30 p-1 shadow-sm backdrop-blur-md supports-[corner-shape:squircle]:rounded-2xl supports-[corner-shape:squircle]:corner-squircle sm:w-auto sm:flex-wrap sm:overflow-visible">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="flex flex-1 shrink-0 items-center justify-center gap-2 rounded-lg bg-muted/20 px-3 py-1.5 supports-[corner-shape:squircle]:rounded-xl supports-[corner-shape:squircle]:corner-squircle sm:flex-none"
							>
								<Skeleton className="size-4 shrink-0" />
								<Skeleton className="h-4 w-16" />
							</div>
						))}
					</nav>
				</div>
				<div className="flex w-full min-w-0 flex-col">
					{/* ExplorerToolbar mock */}
					<div className="mb-6 flex flex-col gap-4">
						<div className="flex min-h-10 flex-row items-center justify-between gap-2 px-1">
							<div className="flex items-center gap-2">
								<Skeleton className="h-5 w-5 rounded-md" />
								<Skeleton className="h-5 w-24" />
							</div>
							<div className="flex shrink-0 items-center gap-1">
								<div className="flex h-8 items-center justify-center rounded-lg bg-muted/20 px-2 supports-[corner-shape:squircle]:rounded-xl supports-[corner-shape:squircle]:corner-squircle sm:px-3">
									<Skeleton className="size-4 sm:mr-2" />
									<Skeleton className="hidden h-4 w-16 sm:block" />
								</div>
								<div className="h-4 w-px bg-border/50" />
								<div className="flex h-8 items-center justify-center rounded-lg bg-muted/20 px-2 supports-[corner-shape:squircle]:rounded-xl supports-[corner-shape:squircle]:corner-squircle sm:px-3">
									<Skeleton className="size-4 sm:mr-2" />
									<Skeleton className="hidden h-4 w-20 sm:block" />
								</div>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-2 rounded-xl border border-border/40 bg-muted/30 p-1 shadow-sm backdrop-blur-md supports-[corner-shape:squircle]:rounded-2xl supports-[corner-shape:squircle]:corner-squircle sm:flex sm:min-h-11 sm:flex-row sm:items-center sm:gap-2">
							<div className="col-span-2 flex items-center gap-2 sm:col-span-1 sm:w-full sm:flex-1">
								<div className="relative flex w-full flex-1 items-center">
									<Skeleton className="h-8 w-full rounded-lg bg-background/50 supports-[corner-shape:squircle]:rounded-xl supports-[corner-shape:squircle]:corner-squircle" />
								</div>
							</div>

							<div className="mx-2 hidden h-4 w-px bg-border/50 sm:block" />

							<div className="col-span-2 grid grid-cols-2 gap-2 sm:col-span-1 sm:flex sm:w-auto sm:flex-none sm:items-center sm:gap-2">
								<Skeleton className="h-8 w-full rounded-lg bg-background/50 supports-[corner-shape:squircle]:rounded-xl supports-[corner-shape:squircle]:corner-squircle sm:w-32 sm:flex-none" />
								<Skeleton className="h-8 w-full rounded-lg bg-background/50 supports-[corner-shape:squircle]:rounded-xl supports-[corner-shape:squircle]:corner-squircle sm:w-45 sm:flex-none" />
							</div>

							<div className="mx-1 hidden h-4 w-px bg-border/50 sm:block" />

							<div className="col-span-2 flex items-center justify-between gap-2 sm:col-span-1 sm:w-auto sm:flex-none sm:justify-end sm:gap-1">
								<div className="flex items-center gap-1">
									<Skeleton className="h-8 w-16 rounded-lg bg-background/50 supports-[corner-shape:squircle]:rounded-xl supports-[corner-shape:squircle]:corner-squircle sm:size-8 sm:w-8" />
									<div className="mx-1 h-4 w-px bg-border/50" />
									<div className="flex shrink-0 items-center gap-1">
										<Skeleton className="size-8 rounded-lg bg-background/50 supports-[corner-shape:squircle]:rounded-xl supports-[corner-shape:squircle]:corner-squircle" />
										<Skeleton className="size-8 rounded-lg bg-background/50 supports-[corner-shape:squircle]:rounded-xl supports-[corner-shape:squircle]:corner-squircle" />
									</div>
								</div>
							</div>
						</div>
					</div>
					{/* SelectionHeader mock */}
					<div className="mb-2 flex items-center justify-between border-b px-3 py-2">
						<div className="flex items-center gap-3">
							<Skeleton className="h-4 w-4 rounded-sm" />
							<Skeleton className="h-4 w-12" />
						</div>
						<Skeleton className="h-4 w-12" />
					</div>
					{/* Main List */}
					<div className="custom-scrollbar relative mt-2 max-h-[55vh] overflow-y-auto pr-2 pb-4">
						<ExplorerMainSkeleton />
					</div>
				</div>
			</div>
		</main>
	);
}
