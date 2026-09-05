import { Skeleton } from "@/components/ui/skeleton";

export function AboutSkeleton() {
	return (
		<div className="flex flex-col gap-10 w-full max-w-2xl mx-auto py-8">
			<section className="flex flex-col gap-4 text-center sm:text-left items-center sm:items-start w-full">
				<Skeleton className="h-10 w-32" />
				<Skeleton className="h-7 w-64" />
			</section>

			<div className="h-px bg-border w-full" />

			<section className="flex flex-col gap-8">
				<div className="flex flex-col gap-3">
					<Skeleton className="h-6 w-48" />
					<div className="bg-card border border-border p-5 rounded-lg flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<Skeleton className="h-5 w-24" />
							<Skeleton className="h-4 w-16" />
						</div>
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4 mt-2" />
					</div>
				</div>

				<div className="flex flex-col gap-3">
					<Skeleton className="h-6 w-40" />
					<div className="flex flex-col gap-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-[90%]" />
					</div>
				</div>
			</section>

			<section className="flex flex-col items-center sm:items-start gap-4 mt-8 pt-8 border-t border-border">
				<Skeleton className="h-4 w-24" />
				<div className="flex gap-4">
					<Skeleton className="h-5 w-36" />
					<Skeleton className="h-5 w-32" />
				</div>
			</section>
		</div>
	);
}
