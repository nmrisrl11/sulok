import { Button } from "@/components/ui/button";
import { APP_INFO } from "@/constants/app-info";
import { ItemRepository } from "@/db/repositories/item-repository";
import { ItemCard } from "@/features/items/components/item-card";
import { cn } from "@/lib/utils";
import { useItemStore } from "@/stores/item-store";
import { useLiveQuery } from "dexie-react-hooks";
import { AlertCircle, PlusIcon } from "lucide-react";
import React from "react";

import { ItemCardSkeleton } from "@/features/items/components/item-card-skeleton";
import { ItemEmptyState } from "@/features/items/components/item-empty-state";

class ErrorBoundary extends React.Component<
	{ children: React.ReactNode },
	{ hasError: boolean; error: Error | null }
> {
	constructor(props: { children: React.ReactNode }) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error) {
		return { hasError: true, error };
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="py-8 text-center text-destructive border-dashed border-2 border-destructive/50 rounded-md flex flex-col items-center gap-2">
					<AlertCircle className="h-8 w-8 mb-2 opacity-80" />
					<p className="font-medium">Failed to load items</p>
					<p className="text-sm opacity-80">{this.state.error?.message}</p>
				</div>
			);
		}
		return this.props.children;
	}
}

function MainContentInner() {
	const items = useLiveQuery(() => ItemRepository.queryAllSorted());

	if (items === undefined) {
		return (
			<div className="flex flex-col gap-2">
				<ItemCardSkeleton />
				<ItemCardSkeleton />
				<ItemCardSkeleton />
			</div>
		);
	}

	if (items.length === 0) {
		return <ItemEmptyState />;
	}

	return (
		<>
			{items.map((item) => (
				<ItemCard key={item.id} item={item} />
			))}
		</>
	);
}

export function MainContent({ className }: { className?: string }) {
	const { openCreateDialog } = useItemStore();

	return (
		<main className={cn("flex flex-col gap-10", className)}>
			{/* Action Buttons */}
			<div className="flex items-center gap-3">
				<Button onClick={openCreateDialog} className="gap-2">
					<PlusIcon className="h-4 w-4" />
					{`Add to ${APP_INFO.name}`}
				</Button>
				<Button variant="outline" disabled title="Coming soon">
					Import (Coming soon)
				</Button>
				<Button variant="outline" disabled title="Coming soon">
					Export (Coming soon)
				</Button>
			</div>

			{/* Item List Section */}
			<div className="flex flex-col gap-4">
				<h2 className="text-foreground font-sans text-2xl font-bold tracking-tight">Your Corner</h2>

				<div className="flex flex-col gap-2">
					<ErrorBoundary>
						<MainContentInner />
					</ErrorBoundary>
				</div>
			</div>
		</main>
	);
}
