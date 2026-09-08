import { Skeleton } from "@/components/ui/skeleton";

export function SettingsSkeleton() {
	return (
		<div className="mx-auto w-full max-w-2xl animate-in px-4 py-8 pb-24 duration-500 fade-in sm:px-6 md:py-12 md:pb-12">
			<div className="mb-10 text-center sm:text-left">
				<h1 className="flex items-center justify-center gap-2.5 font-heading text-3xl font-bold sm:justify-start">
					<Skeleton className="h-8 w-32" />
				</h1>
				<Skeleton className="mx-auto mt-3 h-5 w-64 sm:mx-0" />
			</div>

			<div className="flex flex-col gap-10">
				<div className="flex items-center gap-2 overflow-hidden border-b border-border/50 pb-4">
					<Skeleton className="h-9 w-32 shrink-0 rounded-full" />
					<Skeleton className="h-9 w-28 shrink-0 rounded-full" />
					<Skeleton className="h-9 w-28 shrink-0 rounded-full" />
					<Skeleton className="h-9 w-40 shrink-0 rounded-full" />
				</div>

				<div className="space-y-8">
					<div className="mb-8">
						<Skeleton className="mb-2 h-7 w-48" />
						<Skeleton className="h-4 w-full max-w-sm" />
					</div>

					<div className="border-b border-border/50 pb-8">
						<div className="mb-4">
							<Skeleton className="mb-2 h-5 w-32" />
							<Skeleton className="h-4 w-64" />
						</div>
						<div className="grid grid-cols-3 gap-3">
							<Skeleton className="h-28 w-full rounded-2xl" />
							<Skeleton className="h-28 w-full rounded-2xl" />
							<Skeleton className="h-28 w-full rounded-2xl" />
						</div>
					</div>

					<div className="border-b border-border/50 pb-8">
						<div className="mb-4">
							<Skeleton className="mb-2 h-5 w-40" />
							<Skeleton className="h-4 w-72" />
						</div>
						<Skeleton className="h-20 w-full rounded-2xl" />
					</div>
				</div>
			</div>
		</div>
	);
}
