import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { FolderRepository } from "@/db/repositories/folder-repository";
import { notify } from "@/lib/notify";
import { SORT_OPTIONS } from "@/pages/home/hooks/use-home-management";
import { useConfirmationStore } from "@/stores/confirmation-store";
import { useFolderStore } from "@/stores/folder-store";
import { useItemStore } from "@/stores/item-store";
import { useLogoStore } from "@/stores/logo-store";
import { useLiveQuery } from "dexie-react-hooks";
import {
	ChevronRightIcon,
	FolderPlusIcon,
	HomeIcon,
	LayoutGridIcon,
	ListIcon,
	PlusIcon,
	SearchIcon,
	TrashIcon,
} from "lucide-react";
import { parseAsString, parseAsStringEnum, useQueryState } from "nuqs";
import { Fragment } from "react";

export function ExplorerToolbar({
	hasItems = true,
	hasFolders = true,
}: {
	hasItems?: boolean;
	hasFolders?: boolean;
}) {
	const [folderId, setFolderId] = useQueryState("folder", parseAsString.withDefault(""));
	const [viewMode, setViewMode] = useQueryState(
		"mode",
		parseAsStringEnum(["list", "grid", "compact"]).withDefault("list"),
	);
	const [searchQuery, setSearchQuery] = useQueryState("q", parseAsString.withDefault(""));
	const [view] = useQueryState("view", parseAsString.withDefault("all"));
	const [sortOption, setSortOption] = useQueryState(
		"sort",
		parseAsStringEnum([...SORT_OPTIONS]).withDefault("date-desc"),
	);

	const { openCreateDialog, emptyTrash: emptyFolderTrash } = useFolderStore();
	const { openCreateDialog: openItemCreateDialog, emptyTrash: emptyItemTrash } = useItemStore();
	const confirm = useConfirmationStore((state) => state.confirm);

	const handleEmptyTrash = () => {
		confirm({
			title: "Empty Recycle Bin",
			description:
				"Are you sure you want to permanently delete all items in the Recycle Bin? This action cannot be undone.",
			confirmText: "Empty Recycle Bin",
			onConfirm: async () => {
				try {
					await emptyFolderTrash();
					await emptyItemTrash();
					useLogoStore.getState().setTemporaryExpression("unimpressed");
					notify.success("Recycle Bin emptied");
				} catch (error) {
					console.error(error);
					notify.error("Failed to empty Recycle Bin");
				}
			},
		});
	};

	// Breadcrumb logic
	// We need to fetch the hierarchy. Since it's local, we can fetch all folders and build the path.
	const allFolders = useLiveQuery(() => FolderRepository.getAll()) || [];

	let breadcrumbs: { id: string; name: string }[] = [];
	if (folderId) {
		let currentFolder = allFolders.find((f) => f.id === folderId);
		while (currentFolder) {
			breadcrumbs.unshift({ id: currentFolder.id, name: currentFolder.name });
			currentFolder = allFolders.find((f) => f.id === currentFolder!.parentId);
		}
	}

	return (
		<div className="mb-6 flex flex-col gap-4">
			{/* Top row: Navigation & Actions */}
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div className="no-scrollbar flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
					<Button
						variant="ghost"
						size="sm"
						className="px-2 text-muted-foreground hover:text-foreground"
						onClick={() => setFolderId("")}
					>
						<HomeIcon className="size-4" />
					</Button>

					{view === "favorites" && !folderId && (
						<>
							<ChevronRightIcon className="size-4 shrink-0 text-muted-foreground/50" />
							<span className="text-sm font-medium">Favorites</span>
						</>
					)}
					{view === "trash" && !folderId && (
						<>
							<ChevronRightIcon className="size-4 shrink-0 text-muted-foreground/50" />
							<span className="text-sm font-medium">Recycle Bin</span>
						</>
					)}

					{breadcrumbs.map((crumb) => (
						<Fragment key={crumb.id}>
							<ChevronRightIcon className="size-4 shrink-0 text-muted-foreground/50" />
							<Button
								variant="ghost"
								size="sm"
								className="px-2"
								onClick={() => setFolderId(crumb.id)}
							>
								{crumb.name}
							</Button>
						</Fragment>
					))}
				</div>

				<div className="flex shrink-0 items-center gap-2">
					{view === "trash" ? (
						(hasItems || hasFolders) && (
							<Button
								variant="outline"
								size="sm"
								onClick={handleEmptyTrash}
								className="text-destructive hover:bg-destructive/10 hover:text-destructive"
							>
								<TrashIcon className="mr-2 size-4" />
								Empty Recycle Bin
							</Button>
						)
					) : (
						<>
							<Button variant="outline" size="sm" onClick={() => openCreateDialog()}>
								<FolderPlusIcon className="mr-2 size-4" />
								New Folder
							</Button>
							<Button size="sm" onClick={() => openItemCreateDialog()}>
								<PlusIcon className="mr-2 size-4" />
								Add Link
							</Button>
						</>
					)}
				</div>
			</div>

			{/* Bottom row: Search & View modes */}
			{view !== "trash" && (
				<div className="flex items-center justify-between gap-4">
					<div className="relative w-full max-w-sm">
						<SearchIcon className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search in this view..."
							className="bg-card pl-9"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<div className="flex shrink-0 items-center gap-1 rounded-md border bg-card p-1">
						<Select
							value={sortOption}
							onValueChange={(val) => setSortOption(val as (typeof SORT_OPTIONS)[number])}
						>
							<SelectTrigger
								className="h-7 w-40 rounded-sm border-0 bg-transparent text-xs ring-offset-0 focus:ring-0 focus:ring-offset-0"
								aria-label="Sort items"
							>
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent position="popper" align="end">
								<SelectItem value="date-desc">Date Added (Newest)</SelectItem>
								<SelectItem value="date-asc">Date Added (Oldest)</SelectItem>
								<SelectItem value="name-asc">Name (A-Z)</SelectItem>
								<SelectItem value="name-desc">Name (Z-A)</SelectItem>
							</SelectContent>
						</Select>
						<div className="mx-1 h-4 w-px bg-border" />
						<Button
							variant={viewMode === "list" ? "secondary" : "ghost"}
							size="icon"
							className="size-7"
							onClick={() => setViewMode("list")}
						>
							<ListIcon className="size-4" />
						</Button>
						<Button
							variant={viewMode === "grid" ? "secondary" : "ghost"}
							size="icon"
							className="size-7"
							onClick={() => setViewMode("grid")}
						>
							<LayoutGridIcon className="size-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
