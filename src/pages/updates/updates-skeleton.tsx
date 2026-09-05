import { Skeleton } from "@/components/ui/skeleton";

export function UpdatesSkeleton() {
	return (
		<div className="flex flex-col gap-12 w-full max-w-3xl mx-auto py-8">
			{/* Header Section */}
			<section className="flex flex-col gap-3 text-center sm:text-left w-full items-center sm:items-start">
				<Skeleton className="h-10 sm:h-12 w-48 mb-1" />
				<Skeleton className="h-7 w-64" />
				<Skeleton className="h-7 w-20 rounded-full mt-1" />
			</section>

			<div className="h-px bg-border w-full" />

			{/* Changelog Entries */}
			<div className="flex flex-col gap-16 w-full">
				{[1, 2].map((i) => (
					<div key={i} className="flex flex-col md:flex-row gap-8 md:gap-12 w-full">
						{/* Left Column */}
						<div className="md:w-1/4 shrink-0 flex flex-col gap-2">
							<Skeleton className="h-7 w-20" />
							<Skeleton className="h-4 w-28" />
						</div>

						{/* Right Column */}
						<div className="md:w-3/4 flex flex-col gap-10">
							<Skeleton className="h-8 w-64 mb-2" />
							<div className="flex flex-col gap-4">
								<Skeleton className="h-4 w-24" />
								<div className="flex flex-col gap-2.5">
									{[1, 2, 3].map((j) => (
										<div key={j} className="flex gap-2.5">
											<Skeleton className="w-1 h-1 rounded-full mt-1.5 shrink-0" />
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
