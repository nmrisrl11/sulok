import { FolderPlusCircleIcon, TrashXMarkIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useDebouncedQuery } from "@/hooks";
import { notify } from "@/lib/notify";
import {
	searchQueryParser,
	sortOptionParser,
	viewModeParser,
	viewParser,
} from "@/lib/search-params";
import { useConfirmationStore, useFolderStore, useLogoStore, useUIStore } from "@/stores";
import { LayoutGridIcon, ListIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { ExplorerBreadcrumb } from "./explorer-breadcrumb";

export function ExplorerToolbar({
	hasItems = true,
	hasFolders = true,
}: {
	hasItems?: boolean;
	hasFolders?: boolean;
}) {
	const [viewMode, setViewMode] = useQueryState("mode", viewModeParser);
	const [searchQuery, setSearchQuery] = useQueryState("q", searchQueryParser);
	const [view] = useQueryState("view", viewParser);
	const [sortOption, setSortOption] = useQueryState("sort", sortOptionParser);

	const [localSearch, setLocalSearch] = useDebouncedQuery(searchQuery, setSearchQuery);

	const { openCreateDialog } = useFolderStore();
	const confirm = useConfirmationStore((state) => state.confirm);
	const setQuickLinkExpanded = useUIStore((state) => state.setQuickLinkExpanded);

	const handleEmptyTrash = () => {
		confirm({
			title: "Empty Recycle Bin",
			description:
				"Are you sure you want to permanently delete all items in the Recycle Bin? This action cannot be undone.",
			confirmText: "Empty Recycle Bin",
			onConfirm: async () => {
				try {
					const { BulkRepository } = await import("@/db/repositories/bulk-repository");
					await BulkRepository.emptyTrash();
					useLogoStore.getState().setTemporaryExpression("unimpressed");
					notify.success("Recycle Bin emptied");
				} catch (error) {
					console.error(error);
					notify.error("Failed to empty Recycle Bin");
				}
			},
		});
	};

	return (
		<div className="mb-6 flex flex-col gap-4">
			{/* Top row: Navigation & Actions */}
			<div className="flex min-h-10 flex-row items-center justify-between gap-2 px-1">
				<div className="flex min-w-0 flex-1 items-center overflow-x-auto">
					<ExplorerBreadcrumb />
				</div>

				<div className="flex shrink-0 items-center">
					{view === "trash" ? (
						(hasItems || hasFolders) && (
							<Button
								variant="ghost"
								size="sm"
								onClick={handleEmptyTrash}
								className="h-8 rounded-md px-2 text-sm font-medium text-destructive/80 hover:bg-destructive/10 hover:text-destructive supports-[corner-shape:squircle]:rounded-lg supports-[corner-shape:squircle]:corner-squircle sm:px-3"
							>
								<TrashXMarkIcon className="mr-0 size-4 sm:mr-2" />
								<span className="hidden sm:inline">Empty Recycle Bin</span>
							</Button>
						)
					) : view !== "favorites" ? (
						<div className="flex items-center gap-1">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => openCreateDialog()}
								className="h-8 rounded-md px-2 text-sm font-medium hover:bg-background hover:shadow-sm supports-[corner-shape:squircle]:rounded-lg supports-[corner-shape:squircle]:corner-squircle sm:px-3"
							>
								<FolderPlusCircleIcon className="mr-0 size-4 text-muted-foreground sm:mr-2" />
								<span className="hidden sm:inline">New Folder</span>
							</Button>
							<div className="h-4 w-px bg-border/50" />
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									setQuickLinkExpanded(true);
									setTimeout(() => {
										document.getElementById("quick-link-input")?.focus();
									}, 100);
								}}
								className="h-8 rounded-md px-2 text-sm font-medium hover:bg-background hover:shadow-sm supports-[corner-shape:squircle]:rounded-lg supports-[corner-shape:squircle]:corner-squircle sm:px-3"
							>
								<PlusIcon className="mr-0 size-4 text-muted-foreground sm:mr-2" />
								<span className="hidden sm:inline">Add to corner</span>
							</Button>
						</div>
					) : null}
				</div>
			</div>

			{/* Bottom row: Search & View modes */}
			{view !== "trash" && (hasItems || hasFolders || !!searchQuery) && (
				<div className="flex flex-col gap-1.5 rounded-lg border border-border/40 bg-muted/30 p-1.5 shadow-sm backdrop-blur-md supports-[corner-shape:squircle]:rounded-xl supports-[corner-shape:squircle]:corner-squircle sm:min-h-11 sm:flex-row sm:items-center sm:gap-2">
					{/* Search */}
					<div className="relative flex w-full flex-1 items-center px-1 sm:p-0">
						<SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground sm:left-2" />
						<Input
							id="search-explorer"
							type="search"
							placeholder="Search your corner..."
							className="h-8 rounded-md border-0 pl-8 shadow-none focus-visible:ring-0 supports-[corner-shape:squircle]:rounded-md supports-[corner-shape:squircle]:corner-squircle sm:pl-7"
							value={localSearch}
							onChange={(e) => setLocalSearch(e.target.value)}
						/>
					</div>

					{/* Mobile Separator */}
					<div className="mx-2 h-px bg-border/50 sm:hidden" />

					{/* View Modes */}
					<div className="flex w-full items-center justify-between gap-2 px-1 sm:w-auto sm:justify-end sm:gap-1 sm:p-0">
						<Select
							value={sortOption}
							onValueChange={(val) =>
								setSortOption(val as "date-desc" | "date-asc" | "name-asc" | "name-desc")
							}
						>
							<SelectTrigger
								className="h-8 flex-1 rounded-md border-0 text-sm ring-offset-0 focus:ring-0 focus:ring-offset-0 supports-[corner-shape:squircle]:rounded-md supports-[corner-shape:squircle]:corner-squircle sm:w-45 sm:flex-none"
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
						<div className="mx-1 hidden h-4 w-px bg-border/50 sm:block" />
						<div className="flex shrink-0 items-center gap-1">
							<Button
								variant="ghost"
								size="sm"
								className={`size-8 rounded-md px-0 supports-[corner-shape:squircle]:rounded-lg supports-[corner-shape:squircle]:corner-squircle ${viewMode === "list" ? "bg-background shadow-sm hover:bg-background" : "hover:bg-background/50"}`}
								onClick={() => setViewMode("list")}
							>
								<ListIcon className="size-4" />
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className={`size-8 rounded-md px-0 supports-[corner-shape:squircle]:rounded-lg supports-[corner-shape:squircle]:corner-squircle ${viewMode === "grid" ? "bg-background shadow-sm hover:bg-background" : "hover:bg-background/50"}`}
								onClick={() => setViewMode("grid")}
							>
								<LayoutGridIcon className="size-4" />
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
