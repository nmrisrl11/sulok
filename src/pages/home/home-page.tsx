import { ErrorBoundary } from "@/components/error-boundary";
import { Button } from "@/components/ui/button";
import { APP_INFO } from "@/constants/app-info";
import { ItemRepository } from "@/db/repositories/item-repository";
import { ItemCard } from "@/features/items/components/item-card";
import { ItemEmptyState } from "@/features/items/components/item-empty-state";
import { cn } from "@/lib/utils";
import { useItemStore } from "@/stores/item-store";
import { useLogoStore } from "@/stores/logo-store";
import { useLiveQuery } from "dexie-react-hooks";
import { PlusIcon } from "lucide-react";
import { HomeRouteFallback } from "./home-route-fallback";

export function HomePage({ className }: { className?: string }) {
	const items = useLiveQuery(() => ItemRepository.queryAllSorted());
	const { openCreateDialog } = useItemStore();
	const { setTemporaryExpression, clearTemporaryExpression } = useLogoStore();

	if (items === undefined) {
		return <HomeRouteFallback />;
	}

	return (
		<main className={cn("flex flex-col gap-10", className)}>
			{/* Action Buttons */}
			<div className="flex items-center gap-3">
				<Button
					onClick={openCreateDialog}
					onMouseEnter={() => setTemporaryExpression("excited", 99999)}
					onMouseLeave={clearTemporaryExpression}
					className="gap-2 cursor-pointer"
				>
					<PlusIcon className="h-4 w-4" />
					{`Add to ${APP_INFO.name}`}
				</Button>
			</div>

			{/* Item List Section */}
			<div className="flex flex-col gap-4">
				<h2 className="text-foreground font-sans text-2xl font-bold tracking-tight">Your Corner</h2>

				<div className="flex flex-col gap-2">
					<ErrorBoundary>
						{items.length === 0 ? (
							<ItemEmptyState />
						) : (
							items.map((item) => <ItemCard key={item.id} item={item} />)
						)}
					</ErrorBoundary>
				</div>
			</div>
		</main>
	);
}
