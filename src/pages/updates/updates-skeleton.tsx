import { Skeleton } from "@/components/ui/skeleton";

export function UpdatesSkeleton() {
	return (
		<div className="relative flex h-full flex-col">
			<div className="mx-auto flex w-full max-w-3xl flex-col gap-12 px-4 pt-6 pb-24 md:px-0 md:pt-12 lg:pb-12">
				{/* Header Section */}
				<section className="flex w-full flex-col items-center gap-3 text-center sm:items-start sm:text-left">
					<Skeleton className="h-10 w-48 sm:h-12" />
					<Skeleton className="h-7 w-64" />
					<Skeleton className="mt-1 h-7 w-20 rounded-full" />
				</section>

				<div className="h-px w-full bg-border" />

				{/* Changelog Entries */}
				<div className="flex w-full flex-col gap-16">
					{[1, 2].map((i) => (
						<div key={i} className="flex w-full flex-col gap-8 md:flex-row md:gap-12">
							{/* Left Column: Version & Date */}
							<div className="flex shrink-0 flex-col gap-1 md:w-1/4">
								<div className="sticky top-[calc(6rem+env(safe-area-inset-top))] flex flex-col gap-1 md:top-[calc(8rem+env(safe-area-inset-top))]">
									<Skeleton className="h-7 w-20" />
									<Skeleton className="h-4 w-28" />
								</div>
							</div>

							{/* Right Column: Changes */}
							<div className="flex flex-col gap-10 md:w-3/4">
								<Skeleton className="h-8 w-64" />
								<div className="flex flex-col gap-10">
									{[1, 2].map((groupIndex) => (
										<div key={groupIndex} className="flex flex-col gap-4">
											<Skeleton className="h-4 w-24" />
											<div className="flex flex-col gap-2.5">
												{[1, 2, 3].map((j) => (
													<div key={j} className="flex gap-2.5">
														<Skeleton className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-foreground/30" />
														<Skeleton className="h-4 w-full max-w-md" />
													</div>
												))}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Desktop Fixed Sidebar (TOC) Skeleton */}
			<aside className="fixed top-1/2 right-4 hidden w-48 -translate-y-1/2 flex-col gap-4 xl:flex 2xl:right-16 2xl:w-64">
				<Skeleton className="mx-1.5 h-6 w-32" />
				<div className="flex flex-col gap-2">
					{[1, 2, 3, 4, 5].map((i) => (
						<div key={i} className="flex items-center gap-3 py-1">
							<Skeleton className="h-2 w-2 rounded-full" />
							<Skeleton className="h-4 w-16" />
						</div>
					))}
				</div>
			</aside>

			{/* Mobile FAB Trigger Skeleton */}
			<div className="fixed top-1/2 right-4 z-40 -translate-y-1/2 lg:hidden">
				<Skeleton className="h-12 w-12 rounded-full shadow-lg" />
			</div>
		</div>
	);
}
