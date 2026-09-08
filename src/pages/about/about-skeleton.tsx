import { Skeleton } from "@/components/ui/skeleton";

export function AboutSkeleton() {
	return (
		<div className="mx-auto flex w-full max-w-2xl flex-col gap-10 py-8">
			<section className="flex w-full flex-col items-center gap-4 text-center sm:items-start sm:text-left">
				<Skeleton className="h-10 w-32" />
				<Skeleton className="h-7 w-64" />
			</section>

			<div className="h-px w-full bg-border" />

			<section className="flex flex-col gap-8">
				<div className="flex flex-col gap-3">
					<Skeleton className="h-6 w-48" />
					<div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-5">
						<div className="flex items-center gap-2">
							<Skeleton className="h-5 w-24" />
							<Skeleton className="h-4 w-16" />
						</div>
						<Skeleton className="h-4 w-full" />
						<Skeleton className="mt-2 h-4 w-3/4" />
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

			<section className="mt-8 flex flex-col items-center gap-4 border-t border-border pt-8 sm:items-start">
				<Skeleton className="h-4 w-24" />
				<div className="flex gap-4">
					<Skeleton className="h-5 w-36" />
					<Skeleton className="h-5 w-32" />
				</div>
			</section>
		</div>
	);
}
