import { Skeleton } from "@/components/ui/skeleton";

export function InstallSkeleton() {
	return (
		<div
			role="alert"
			aria-label="Loading installation page"
			className="relative flex h-full flex-col"
		>
			<div className="container mx-auto px-4 py-12 md:px-8 md:py-20 lg:max-w-6xl">
				<div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
					{/* Left Column: Branding and Details */}
					<div className="w-full lg:max-w-90 lg:border-r lg:border-border/60 lg:pr-12">
						<div className="flex flex-col lg:sticky lg:top-32 lg:pb-12">
							<Skeleton className="mb-8 h-24 w-24 rounded-[2rem] corner-squircle supports-[corner-shape:squircle]:rounded-full" />
							<Skeleton className="mb-4 h-12 w-48 sm:h-14" />
							<div className="mb-10 flex flex-col gap-2">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-3/4" />
							</div>

							<div className="flex flex-col gap-4">
								{[1, 2, 3].map((i) => (
									<div key={i} className="flex items-center justify-between gap-4">
										<Skeleton className="h-4 w-32" />
										<Skeleton className="h-4 w-20" />
									</div>
								))}
							</div>

							<div className="mt-8 border-t border-border/50 pt-8">
								<Skeleton className="h-4 w-48" />
							</div>
						</div>
					</div>

					{/* Right Column: Installation Sections */}
					<div className="flex flex-1 flex-col gap-14">
						{/* PWA Section */}
						<div className="flex flex-col gap-6">
							<div>
								<Skeleton className="h-8 w-64" />
								<Skeleton className="mt-2 h-4 w-full max-w-md" />
							</div>

							<div className="flex flex-col gap-6">
								{[1, 2, 3].map((i) => (
									<div key={i} className="flex items-start gap-4">
										<Skeleton className="mt-0.5 h-9 w-9 shrink-0 rounded-full" />
										<div className="flex w-full flex-col gap-2">
											<Skeleton className="h-4 w-32" />
											<Skeleton className="h-3 w-full max-w-sm" />
										</div>
									</div>
								))}
							</div>

							<div className="max-w-md pt-2">
								<div className="flex w-full items-center gap-4 rounded-2xl border bg-card p-4 text-left shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-[2rem]">
									<Skeleton className="h-12 w-12 shrink-0 rounded-xl corner-squircle supports-[corner-shape:squircle]:rounded-full" />
									<div className="flex flex-1 flex-col justify-center gap-2">
										<Skeleton className="h-4 w-28" />
										<Skeleton className="h-3 w-24" />
									</div>
									<Skeleton className="h-9 w-16 rounded-full" />
								</div>
							</div>
						</div>

						<div className="border-t border-border/50"></div>

						{/* Extension Section */}
						<div className="flex flex-col gap-6">
							<div>
								<div className="flex items-center gap-3">
									<Skeleton className="h-8 w-56" />
									<Skeleton className="h-5 w-12 rounded-full" />
								</div>
								<Skeleton className="mt-2 h-4 w-full max-w-md" />
							</div>

							<div className="flex flex-col gap-6">
								{[1, 2, 3].map((i) => (
									<div key={i} className="flex items-start gap-4">
										<Skeleton className="mt-0.5 h-9 w-9 shrink-0 rounded-full" />
										<div className="flex w-full flex-col gap-2">
											<Skeleton className="h-4 w-36" />
											<Skeleton className="h-3 w-full max-w-sm" />
										</div>
									</div>
								))}
							</div>

							<div className="mt-2 flex max-w-xl flex-col gap-5 rounded-3xl border p-6 corner-squircle supports-[corner-shape:squircle]:rounded-[2rem]">
								<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
									<div className="flex flex-col gap-2">
										<Skeleton className="h-5 w-32" />
										<Skeleton className="h-3 w-48" />
									</div>
									<Skeleton className="h-10 w-36 rounded-full" />
								</div>
								<div className="mt-2 border-t pt-5">
									<div className="flex flex-col gap-3">
										<Skeleton className="h-3 w-full" />
										<Skeleton className="h-3 w-5/6" />
										<Skeleton className="h-3 w-4/6" />
										<Skeleton className="h-3 w-[90%]" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
