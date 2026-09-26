import { Skeleton } from "@/components/ui/skeleton";

export function InstallSkeleton() {
	return (
		<div
			role="alert"
			aria-label="Loading installation page"
			className="relative flex h-full flex-col"
		>
			<div className="mx-auto flex w-full max-w-3xl flex-1 flex-col p-4 text-center">
				{/* Branding / App Icon */}
				<div className="relative mb-6 flex flex-col items-center">
					<Skeleton className="h-20 w-20 rounded-2xl corner-squircle supports-[corner-shape:squircle]:rounded-full" />
					<Skeleton className="mt-4 h-5 w-12 rounded-full" />
				</div>

				{/* Premium Copywriting */}
				<Skeleton className="mx-auto mb-3 h-9 w-48" />
				<div className="mx-auto mb-10 flex w-full max-w-lg flex-col items-center gap-2">
					<Skeleton className="h-4 w-[90%]" />
					<Skeleton className="h-4 w-[80%]" />
				</div>

				{/* Installation CTA Logic */}
				<div className="mx-auto mb-16 flex w-full max-w-sm flex-col items-center gap-4">
					<div className="flex w-full items-center gap-4 rounded-2xl border bg-card p-4 text-left shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-[2rem]">
						<Skeleton className="h-12 w-12 shrink-0 rounded-xl corner-squircle supports-[corner-shape:squircle]:rounded-full" />
						<div className="flex flex-1 flex-col justify-center gap-2">
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-3 w-24" />
						</div>
						<Skeleton className="h-9 w-16 rounded-full" />
					</div>
				</div>

				{/* Features Header */}
				<div className="mt-4 mb-8 flex w-full flex-col items-center gap-2 text-center">
					<Skeleton className="h-7 w-48 sm:h-8" />
					<Skeleton className="h-4 w-72" />
				</div>

				{/* Features Grid */}
				<div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
					{[1, 2, 3].map((index) => (
						<div
							key={index}
							className="flex flex-col items-center rounded-2xl border bg-card p-5 text-center corner-squircle supports-[corner-shape:squircle]:rounded-[2rem]"
						>
							<Skeleton className="mb-4 h-10 w-10 rounded-xl corner-squircle supports-[corner-shape:squircle]:rounded-full" />
							<Skeleton className="mb-3 h-6 w-32" />
							<div className="flex w-full flex-col items-center gap-2">
								<Skeleton className="h-3 w-[90%]" />
								<Skeleton className="h-3 w-[70%]" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
