import {
	FolderPlusCircleIcon,
	GridIcon,
	ListIcon,
	MergeIcon,
	TrashXMarkIcon,
} from "@/components/icons";
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
	folderIdParser,
	mixDataParser,
	searchQueryParser,
	sortOptionParser,
	typeFilterParser,
	viewModeParser,
	viewParser,
} from "@/lib/search-params";
import { cn } from "@/lib/utils";
import { useConfirmationStore, useFolderStore, useLogoStore } from "@/stores";
import { PlusIcon, SearchIcon } from "lucide-react";
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
	const [folderId] = useQueryState("folder", folderIdParser);
	const [sortOption, setSortOption] = useQueryState("sort", sortOptionParser);
	const [mixData, setMixData] = useQueryState("mix", mixDataParser);
	const [typeFilter, setTypeFilter] = useQueryState("type", typeFilterParser);

	const [localSearch, setLocalSearch] = useDebouncedQuery(searchQuery, setSearchQuery);

	const openCreateDialog = useFolderStore((state) => state.openCreateDialog);
	const confirm = useConfirmationStore((state) => state.confirm);

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

	const hasFiltersActive =
		!!searchQuery || typeFilter !== "all" || sortOption !== "date-desc" || mixData;

	const handleResetFilters = () => {
		setSearchQuery(null);
		setLocalSearch("");
		setTypeFilter("all");
		setSortOption("date-desc");
		setMixData(false);
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
								onClick={() => openCreateDialog(folderId)}
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
									document.dispatchEvent(
										new CustomEvent("open-quick-link", { detail: { folderId } }),
									);
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
			{view !== "trash" && (hasItems || hasFolders || hasFiltersActive) && (
				<div className="grid grid-cols-2 gap-2 rounded-xl border border-border/40 bg-muted/30 p-1 shadow-sm backdrop-blur-md supports-[corner-shape:squircle]:rounded-2xl supports-[corner-shape:squircle]:corner-squircle sm:flex sm:min-h-11 sm:flex-row sm:items-center sm:gap-2">
					{/* Search & Reset */}
					<div className="col-span-2 flex items-center gap-2 sm:col-span-1 sm:w-full sm:flex-1">
						<div className="relative flex w-full flex-1 items-center">
							<SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground sm:left-2" />
							<Input
								id="search-explorer"
								type="search"
								autoComplete="off"
								autoCorrect="off"
								spellCheck="false"
								placeholder="Search your corner..."
								className="h-8 w-full rounded-lg border-0 pl-8 shadow-none focus-visible:ring-0 supports-[corner-shape:squircle]:rounded-xl supports-[corner-shape:squircle]:corner-squircle sm:pl-7"
								value={localSearch}
								onChange={(e) => setLocalSearch(e.target.value)}
							/>
						</div>
					</div>

					{/* Mobile Separator (Only on Desktop) */}
					<div className="mx-2 hidden h-4 w-px bg-border/50 sm:block" />

					{/* Type & Sort Row */}
					<div className="col-span-2 grid grid-cols-2 gap-2 sm:col-span-1 sm:flex sm:w-auto sm:flex-none sm:items-center sm:gap-2">
						<Select
							value={typeFilter}
							onValueChange={(val) => setTypeFilter(val as "all" | "folders" | "links")}
						>
							<SelectTrigger
								className="h-8 w-full rounded-lg border-0 text-sm ring-offset-0 focus:ring-0 focus:ring-offset-0 supports-[corner-shape:squircle]:rounded-xl supports-[corner-shape:squircle]:corner-squircle sm:w-32 sm:flex-none"
								aria-label="Filter by type"
							>
								<SelectValue placeholder="All Types" />
							</SelectTrigger>
							<SelectContent position="popper" align="end">
								<SelectItem value="all">All Types</SelectItem>
								<SelectItem value="folders">Folders Only</SelectItem>
								<SelectItem value="links">Links Only</SelectItem>
							</SelectContent>
						</Select>
						<Select
							value={sortOption}
							onValueChange={(val) =>
								setSortOption(val as "date-desc" | "date-asc" | "name-asc" | "name-desc")
							}
						>
							<SelectTrigger
								className="h-8 w-full rounded-lg border-0 text-sm ring-offset-0 focus:ring-0 focus:ring-offset-0 supports-[corner-shape:squircle]:rounded-xl supports-[corner-shape:squircle]:corner-squircle sm:w-45 sm:flex-none"
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
					</div>

					{/* Desktop Separator */}
					<div className="mx-1 hidden h-4 w-px bg-border/50 sm:block" />

					{/* Actions Row */}
					<div className="col-span-2 flex items-center justify-between gap-2 sm:col-span-1 sm:w-auto sm:flex-none sm:justify-end sm:gap-1">
						<div className="flex items-center gap-1">
							<Button
								variant="ghost"
								size="sm"
								className={cn(
									"h-8 rounded-lg px-3 text-xs font-medium supports-[corner-shape:squircle]:rounded-xl supports-[corner-shape:squircle]:corner-squircle sm:size-8 sm:px-0",
									mixData
										? "border-0 bg-background text-foreground shadow-engraved hover:bg-background"
										: "text-muted-foreground hover:bg-background/50 hover:text-foreground",
								)}
								onClick={() => setMixData(mixData ? false : true)}
								title={mixData ? "Separate Folders and Links" : "Mix Folders and Links"}
							>
								<MergeIcon className="mr-2 size-4 sm:mr-0" />
								<span className="sm:sr-only">{mixData ? "Separate Data" : "Mix Data"}</span>
							</Button>

							<div className="mx-1 h-4 w-px bg-border/50" />

							<div className="flex shrink-0 items-center gap-1">
								<Button
									variant="ghost"
									size="sm"
									title="List View"
									aria-label="List View"
									className={`size-8 rounded-lg px-0 supports-[corner-shape:squircle]:rounded-xl supports-[corner-shape:squircle]:corner-squircle ${viewMode === "list" ? "border-0 bg-background text-foreground shadow-engraved hover:bg-background" : "text-muted-foreground hover:bg-background/50 hover:text-foreground"}`}
									onClick={() => setViewMode("list")}
								>
									<ListIcon className="size-4" />
								</Button>
								<Button
									variant="ghost"
									size="sm"
									title="Grid View"
									aria-label="Grid View"
									className={`size-8 rounded-lg px-0 supports-[corner-shape:squircle]:rounded-xl supports-[corner-shape:squircle]:corner-squircle ${viewMode === "grid" ? "border-0 bg-background text-foreground shadow-engraved hover:bg-background" : "text-muted-foreground hover:bg-background/50 hover:text-foreground"}`}
									onClick={() => setViewMode("grid")}
								>
									<GridIcon className="size-4" />
								</Button>
							</div>
						</div>

						{hasFiltersActive && (
							<div className="flex items-center gap-1">
								<div className="mx-1 hidden h-4 w-px bg-border/50 sm:block" />
								<Button
									variant="ghost"
									size="sm"
									onClick={handleResetFilters}
									className="h-8 shrink-0 rounded-lg px-3 text-xs font-medium text-muted-foreground hover:bg-background hover:text-foreground supports-[corner-shape:squircle]:rounded-xl supports-[corner-shape:squircle]:corner-squircle"
								>
									Clear
								</Button>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
