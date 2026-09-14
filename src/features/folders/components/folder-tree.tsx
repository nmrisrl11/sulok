import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderRepository } from "@/db/repositories/folder-repository";
import { cn } from "@/lib/utils";
import { useFolderStore } from "@/stores/folder-store";
import { useLiveQuery } from "dexie-react-hooks";
import { InboxIcon, LayersIcon, PlusIcon } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { FolderNode } from "./folder-node";

export function FolderTree() {
	const folders = useLiveQuery(() => FolderRepository.getAll());
	const { openCreateDialog } = useFolderStore();
	const [activeFolderId, setActiveFolderId] = useQueryState(
		"folder",
		parseAsString.withDefault(""),
	);

	if (folders === undefined) {
		return (
			<div className="flex w-full flex-col gap-2 p-4" role="alert" aria-label="Loading folders">
				<Skeleton className="h-8 w-full rounded-md" />
				<Skeleton className="h-8 w-5/6 rounded-md" />
				<Skeleton className="h-8 w-4/6 rounded-md" />
			</div>
		);
	}

	const rootFolders = folders.filter((f) => !f.parentId).sort((a, b) => a.order - b.order);

	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex items-center justify-between px-2 py-1">
				<h3 className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
					Folders
				</h3>
				<Button
					variant="ghost"
					size="icon"
					className="size-6 h-6 w-6 text-muted-foreground"
					onClick={() => openCreateDialog()}
				>
					<PlusIcon className="size-3.5" />
				</Button>
			</div>

			<div className="mb-2 flex flex-col gap-0.5">
				<div
					className={cn(
						"flex cursor-pointer items-center gap-2 rounded-md border border-transparent px-2 py-1.5 transition-colors hover:bg-card",
						activeFolderId === "" && "border-primary/20 bg-card",
					)}
					onClick={() => setActiveFolderId("")}
				>
					<LayersIcon className="size-4 shrink-0 text-muted-foreground" />
					<span className="text-sm font-medium text-foreground/90">All Links</span>
				</div>
				<div
					className={cn(
						"flex cursor-pointer items-center gap-2 rounded-md border border-transparent px-2 py-1.5 transition-colors hover:bg-card",
						activeFolderId === "unorganized" && "border-primary/20 bg-card",
					)}
					onClick={() => setActiveFolderId("unorganized")}
				>
					<InboxIcon className="size-4 shrink-0 text-muted-foreground" />
					<span className="text-sm font-medium text-foreground/90">Unorganized</span>
				</div>
			</div>

			{folders.length === 0 ? (
				<div className="mt-2 border-t border-border/50 px-3 py-4 pt-4 text-center">
					<p className="text-xs text-muted-foreground">No folders yet</p>
				</div>
			) : (
				<div className="flex w-full flex-col">
					{rootFolders.map((folder) => (
						<FolderNode key={folder.id} folder={folder} allFolders={folders} />
					))}
				</div>
			)}
		</div>
	);
}
