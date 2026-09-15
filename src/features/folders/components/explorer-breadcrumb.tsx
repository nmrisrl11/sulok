import { FolderLinkIcon, FollowFolderIcon, RecycleBinIcon } from "@/components/icons";
import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FolderRepository } from "@/db/repositories/folder-repository";
import { folderIdParser, viewParser } from "@/lib/search-params";
import { useLiveQuery } from "dexie-react-hooks";
import { useQueryState } from "nuqs";
import { Fragment } from "react";

export function ExplorerBreadcrumb() {
	const [folderId, setFolderId] = useQueryState("folder", folderIdParser);
	const [view, setView] = useQueryState("view", viewParser);

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

	const ITEMS_TO_DISPLAY = 3;
	const isTruncated = breadcrumbs.length > ITEMS_TO_DISPLAY;
	const visibleBreadcrumbs = isTruncated ? breadcrumbs.slice(-ITEMS_TO_DISPLAY) : breadcrumbs;
	const hiddenBreadcrumbs = isTruncated ? breadcrumbs.slice(0, -ITEMS_TO_DISPLAY) : [];

	return (
		<Breadcrumb>
			<BreadcrumbList className="flex-nowrap sm:flex-wrap">
				{view === "favorites" ? (
					<BreadcrumbItem>
						<BreadcrumbPage className="flex items-center gap-1.5 text-base font-semibold">
							<FollowFolderIcon className="size-4" />
							Favorites
						</BreadcrumbPage>
					</BreadcrumbItem>
				) : view === "trash" ? (
					<BreadcrumbItem>
						<BreadcrumbPage className="flex items-center gap-1.5 text-base font-semibold">
							<RecycleBinIcon className="size-4" />
							Recycle Bin
						</BreadcrumbPage>
					</BreadcrumbItem>
				) : (
					<BreadcrumbItem>
						{!folderId ? (
							<BreadcrumbPage className="flex items-center gap-1.5 text-base font-semibold">
								<FolderLinkIcon className="size-4" />
								Library
							</BreadcrumbPage>
						) : (
							<BreadcrumbLink
								asChild
								className="cursor-pointer hover:text-foreground"
								onClick={() => {
									setFolderId(null);
									setView(null);
								}}
							>
								<span className="flex items-center gap-1.5">
									<FolderLinkIcon className="size-4" />
									Library
								</span>
							</BreadcrumbLink>
						)}
					</BreadcrumbItem>
				)}

				{isTruncated && view !== "favorites" && view !== "trash" && (
					<>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<DropdownMenu>
								<DropdownMenuTrigger className="flex items-center gap-1 focus:outline-none">
									<BreadcrumbEllipsis className="size-4" />
									<span className="sr-only">Toggle menu</span>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									{hiddenBreadcrumbs.map((crumb) => (
										<DropdownMenuItem
											key={crumb.id}
											onClick={() => setFolderId(crumb.id)}
											className="cursor-pointer"
										>
											{crumb.name}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</BreadcrumbItem>
					</>
				)}

				{visibleBreadcrumbs.map((crumb, index) => (
					<Fragment key={crumb.id}>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							{index === visibleBreadcrumbs.length - 1 ? (
								<BreadcrumbPage className="max-w-37.5 truncate sm:max-w-50 md:max-w-none">
									{crumb.name}
								</BreadcrumbPage>
							) : (
								<BreadcrumbLink
									asChild
									className="max-w-25 cursor-pointer truncate hover:text-foreground sm:max-w-none"
									onClick={() => setFolderId(crumb.id)}
								>
									<span>{crumb.name}</span>
								</BreadcrumbLink>
							)}
						</BreadcrumbItem>
					</Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
