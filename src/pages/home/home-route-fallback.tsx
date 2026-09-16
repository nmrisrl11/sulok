import { ExplorerSidebar } from "@/features/folders/components/explorer-sidebar";
import { ExplorerToolbar } from "@/features/folders/components/explorer-toolbar";
import { FolderEmptyState } from "@/features/folders/components/folder-empty-state";
import { getHasDataHint } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { HomeSkeleton } from "./home-skeleton";

function HomeHeaderArea() {
	return (
		<div className="flex flex-col justify-between gap-4 px-2 sm:flex-row sm:items-center sm:px-0">
			<h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
				Your Corner
			</h2>
		</div>
	);
}

export function HomeRouteFallback({ className }: { className?: string }) {
	const hasDataHint = getHasDataHint();

	if (hasDataHint) return <HomeSkeleton className={className} />;

	return (
		<main className={cn("flex flex-col gap-10", className)}>
			<div className="flex flex-col gap-4">
				<HomeHeaderArea />
				<div className="flex flex-col items-start gap-6 md:flex-row md:gap-8">
					<div className="sticky top-2 z-20 w-full shrink-0 rounded-xl border bg-card/80 p-1.5 shadow-sm backdrop-blur-md transition-all md:static md:z-auto md:w-56 md:rounded-lg md:bg-card/30 md:p-2 md:backdrop-blur-none">
						<ExplorerSidebar />
					</div>
					<div className="flex w-full min-w-0 flex-1 flex-col">
						<ExplorerToolbar hasItems={false} hasFolders={false} />
						<div className="custom-scrollbar relative mt-2 max-h-[calc(100dvh-180px)] overflow-y-auto pr-2 pb-24 md:max-h-[calc(100dvh-130px)] md:pb-32">
							<FolderEmptyState animate={false} />
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
