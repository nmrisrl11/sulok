import { ItemEmptyState } from "@/features/items/components/item-empty-state";
import { getHasDataHint } from "@/lib/storage";
import { HomeSkeleton } from "./home-skeleton";

export function HomeRouteFallback() {
	const hasDataHint = getHasDataHint();

	if (hasDataHint) return <HomeSkeleton />;

	return (
		<main className="flex flex-col gap-10">
			<div className="flex flex-col gap-4">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2 sm:px-0">
					<h2 className="text-foreground font-sans text-2xl font-bold tracking-tight">
						Your Corner
					</h2>
				</div>

				<div className="flex flex-col gap-2">
					<ItemEmptyState disabled />
				</div>
			</div>
		</main>
	);
}
