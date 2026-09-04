import { Button } from "@/components/ui/button";
import { APP_INFO } from "@/constants/app-info";
import { ItemCardSkeleton } from "@/features/items/components/item-card-skeleton";
import { PlusIcon } from "lucide-react";

export function HomeSkeleton() {
	return (
		<main className="flex flex-col gap-10">
			{/* Action Buttons */}
			<div className="flex items-center gap-3">
				<Button disabled className="gap-2 cursor-pointer">
					<PlusIcon className="h-4 w-4" />
					{`Add to ${APP_INFO.name}`}
				</Button>
			</div>

			{/* Item List Section */}
			<div className="flex flex-col gap-4">
				<h2 className="text-foreground font-sans text-2xl font-bold tracking-tight">Your Corner</h2>

				<div className="flex flex-col gap-2">
					<ItemCardSkeleton />
					<ItemCardSkeleton />
					<ItemCardSkeleton />
				</div>
			</div>
		</main>
	);
}
