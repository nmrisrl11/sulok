import { FolderLinkIcon } from "@/components/icons";
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
import type { Folder } from "@/db/db";
import { cn } from "@/lib/utils";
import { Fragment } from "react";

interface FolderBreadcrumbsProps {
	currentFolderId: string | null;
	allFolders: Folder[];
	onNavigate: (folderId: string | null) => void;

	rootLabel?: string;
	rootIcon?: React.ElementType;
	rootClassName?: string;

	itemsToDisplay?: number;
	hideBreadcrumbs?: boolean;
	hideDropdown?: boolean;

	leafClassName?: string;
	linkClassName?: string;
}

export function FolderBreadcrumbs({
	currentFolderId,
	allFolders,
	onNavigate,
	rootLabel = "Library",
	rootIcon: RootIcon = FolderLinkIcon,
	rootClassName = "text-base font-semibold",
	itemsToDisplay = 3,
	hideBreadcrumbs = false,
	hideDropdown = false,
	leafClassName = "max-w-37.5 sm:max-w-50 md:max-w-none",
	linkClassName = "max-w-25 sm:max-w-none",
}: FolderBreadcrumbsProps) {
	let breadcrumbs: { id: string; name: string }[] = [];
	if (currentFolderId) {
		let currentFolder = allFolders.find((f) => f.id === currentFolderId);
		while (currentFolder) {
			breadcrumbs.unshift({ id: currentFolder.id, name: currentFolder.name });
			currentFolder = allFolders.find((f) => f.id === currentFolder?.parentId);
		}
	}

	const isTruncated = breadcrumbs.length > itemsToDisplay;
	const visibleBreadcrumbs = isTruncated ? breadcrumbs.slice(-itemsToDisplay) : breadcrumbs;
	const hiddenBreadcrumbs = isTruncated ? breadcrumbs.slice(0, -itemsToDisplay) : [];

	return (
		<Breadcrumb>
			<BreadcrumbList className="flex-nowrap sm:flex-wrap">
				<BreadcrumbItem>
					{!currentFolderId ? (
						<BreadcrumbPage className={cn("flex items-center gap-1.5", rootClassName)}>
							<RootIcon className="size-4 shrink-0" />
							{rootLabel}
						</BreadcrumbPage>
					) : (
						<BreadcrumbLink
							asChild
							className="cursor-pointer hover:text-foreground"
							onClick={() => onNavigate(null)}
						>
							<button type="button" className="flex items-center gap-1.5">
								<RootIcon className="size-4 shrink-0" />
								{rootLabel}
							</button>
						</BreadcrumbLink>
					)}
				</BreadcrumbItem>

				{!hideBreadcrumbs && (
					<>
						{isTruncated && !hideDropdown && (
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
													onClick={() => onNavigate(crumb.id)}
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
										<BreadcrumbPage className={cn("truncate", leafClassName)}>
											{crumb.name}
										</BreadcrumbPage>
									) : (
										<BreadcrumbLink
											asChild
											className={cn("cursor-pointer truncate hover:text-foreground", linkClassName)}
											onClick={() => onNavigate(crumb.id)}
										>
											<button type="button">{crumb.name}</button>
										</BreadcrumbLink>
									)}
								</BreadcrumbItem>
							</Fragment>
						))}
					</>
				)}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
