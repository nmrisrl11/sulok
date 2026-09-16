import { ExplorerSidebar } from "@/features/folders/components/explorer-sidebar";
import { ExplorerToolbar } from "@/features/folders/components/explorer-toolbar";
import { FolderEmptyState } from "@/features/folders/components/folder-empty-state";
import { getHasDataHint } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { HomeSkeleton } from "./home-skeleton";

export function HomeRouteFallback({ className }: { className?: string }) {
	const hasDataHint = getHasDataHint();

	if (hasDataHint) return <HomeSkeleton className={className} />;

	return (
		<main className={cn("flex flex-col gap-6 md:gap-8", className)}>
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-4 px-2 sm:flex-row sm:items-center sm:justify-between sm:px-0">
					<h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
						Your Corner
					</h2>
					<ExplorerSidebar />
				</div>
				<div className="flex w-full min-w-0 flex-col">
					<ExplorerToolbar hasItems={false} hasFolders={false} />
					<div className="custom-scrollbar relative mt-2 max-h-[55vh] overflow-y-auto pr-2 pb-4">
						<FolderEmptyState animate={false} />
					</div>
				</div>
			</div>
		</main>
	);
}
