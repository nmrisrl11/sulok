import { Skeleton } from "@/components/ui/skeleton";

export function SettingsSkeleton() {
	return (
		<div className="mx-auto w-full max-w-2xl px-4 pt-6 md:px-6 md:pt-12">
			<div className="mb-10 text-center sm:text-left">
				<h1 className="flex items-center justify-center gap-2.5 font-heading text-3xl font-bold sm:justify-start">
					<Skeleton className="h-8 w-32" />
				</h1>
				<Skeleton className="mx-auto mt-2 h-5 w-64 sm:mx-0" />
			</div>

			<div className="flex flex-col gap-10">
				<nav className="custom-scrollbar flex snap-x items-center gap-2 overflow-x-auto border-b border-border/50 pb-4">
					<Skeleton className="h-9 w-36 shrink-0 rounded-full corner-squircle supports-[corner-shape:squircle]:rounded-2xl" />
					<Skeleton className="h-9 w-32 shrink-0 rounded-full corner-squircle supports-[corner-shape:squircle]:rounded-2xl" />
					<Skeleton className="h-9 w-28 shrink-0 rounded-full corner-squircle supports-[corner-shape:squircle]:rounded-2xl" />
					<Skeleton className="h-9 w-44 shrink-0 rounded-full corner-squircle supports-[corner-shape:squircle]:rounded-2xl" />
				</nav>

				<main className="min-w-0 flex-1">
					<div className="animate-in space-y-8 duration-300 fade-in slide-in-from-bottom-2">
						<div>
							<Skeleton className="mb-2 h-7 w-48" />
							<Skeleton className="h-4 w-full max-w-md" />
							<Skeleton className="mt-2 h-4 w-64" />
						</div>

						<div className="space-y-10">
							<div className="space-y-4">
								<Skeleton className="h-3 w-32" />
								<Skeleton className="h-44 w-full rounded-3xl corner-squircle supports-[corner-shape:squircle]:rounded-[2rem]" />
							</div>

							<div className="space-y-4">
								<Skeleton className="h-3 w-36" />
								<Skeleton className="h-44 w-full rounded-3xl corner-squircle supports-[corner-shape:squircle]:rounded-[2rem]" />
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
