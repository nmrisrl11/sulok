import { Skeleton } from "@/components/ui/skeleton";

export function GuideSkeleton() {
	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 pt-6 md:px-6 md:pt-12">
			<section className="flex w-full flex-col items-center gap-4 text-center sm:items-start sm:text-left">
				<Skeleton className="h-10 w-64" />
				<Skeleton className="h-6 w-96" />
			</section>

			<div className="h-px w-full bg-border" />

			<section className="flex flex-col gap-8">
				<Skeleton className="h-62.5 w-full rounded-xl supports-[corner-shape:squircle]:rounded-3xl supports-[corner-shape:squircle]:corner-squircle" />
				<Skeleton className="h-62.5 w-full rounded-xl supports-[corner-shape:squircle]:rounded-3xl supports-[corner-shape:squircle]:corner-squircle" />
				<Skeleton className="h-62.5 w-full rounded-xl supports-[corner-shape:squircle]:rounded-3xl supports-[corner-shape:squircle]:corner-squircle" />
			</section>
		</div>
	);
}
