import { Skeleton } from "@/components/ui/skeleton";

export function UpdatesSkeleton() {
	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-12 py-8">
			{/* Header Section */}
			<section className="flex w-full flex-col items-center gap-3 text-center sm:items-start sm:text-left">
				<Skeleton className="mb-1 h-10 w-48 sm:h-12" />
				<Skeleton className="h-7 w-64" />
				<Skeleton className="mt-1 h-7 w-20 rounded-full" />
			</section>

			<div className="h-px w-full bg-border" />

			{/* Changelog Entries */}
			<div className="flex w-full flex-col gap-16">
				{[1, 2].map((i) => (
					<div key={i} className="flex w-full flex-col gap-8 md:flex-row md:gap-12">
						{/* Left Column */}
						<div className="flex shrink-0 flex-col gap-2 md:w-1/4">
							<Skeleton className="h-7 w-20" />
							<Skeleton className="h-4 w-28" />
						</div>

						{/* Right Column */}
						<div className="flex flex-col gap-10 md:w-3/4">
							<Skeleton className="mb-2 h-8 w-64" />
							<div className="flex flex-col gap-4">
								<Skeleton className="h-4 w-24" />
								<div className="flex flex-col gap-2.5">
									{[1, 2, 3].map((j) => (
										<div key={j} className="flex gap-2.5">
											<Skeleton className="mt-1.5 h-1 w-1 shrink-0 rounded-full" />
											<Skeleton className="h-4 w-full max-w-md" />
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
