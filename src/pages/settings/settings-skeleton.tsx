import { Skeleton } from "@/components/ui/skeleton";

export function SettingsSkeleton() {
	return (
		<div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 pb-24 md:py-12 md:pb-12 animate-in fade-in duration-500">
			<div className="mb-10 text-center sm:text-left">
				<h1 className="font-heading text-3xl font-bold flex items-center justify-center sm:justify-start gap-2.5">
					<Skeleton className="w-7 h-7 rounded-full" />
					<Skeleton className="h-8 w-32" />
				</h1>
				<Skeleton className="h-5 w-64 mt-3 mx-auto sm:mx-0" />
			</div>

			<div className="flex flex-col gap-10">
				<div className="flex items-center gap-2 overflow-hidden pb-4 border-b border-border/50">
					<Skeleton className="h-9 w-32 rounded-full shrink-0" />
					<Skeleton className="h-9 w-28 rounded-full shrink-0" />
					<Skeleton className="h-9 w-28 rounded-full shrink-0" />
					<Skeleton className="h-9 w-40 rounded-full shrink-0" />
				</div>

				<div className="space-y-8">
					<div className="mb-8">
						<Skeleton className="h-7 w-48 mb-2" />
						<Skeleton className="h-4 w-full max-w-sm" />
					</div>

					<div className="pb-8 border-b border-border/50">
						<div className="mb-4">
							<Skeleton className="h-5 w-32 mb-2" />
							<Skeleton className="h-4 w-64" />
						</div>
						<div className="grid grid-cols-3 gap-3">
							<Skeleton className="h-28 w-full rounded-2xl" />
							<Skeleton className="h-28 w-full rounded-2xl" />
							<Skeleton className="h-28 w-full rounded-2xl" />
						</div>
					</div>

					<div className="pb-8 border-b border-border/50">
						<div className="mb-4">
							<Skeleton className="h-5 w-40 mb-2" />
							<Skeleton className="h-4 w-72" />
						</div>
						<Skeleton className="h-20 w-full rounded-2xl" />
					</div>
				</div>
			</div>
		</div>
	);
}
