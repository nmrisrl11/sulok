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
import { useIsMobile } from "@/hooks";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { forwardRef, Fragment, type ElementType } from "react";

const DroppableBreadcrumbNode = forwardRef<
	HTMLButtonElement,
	React.ButtonHTMLAttributes<HTMLButtonElement> & {
		folderId: string | null;
		isVirtualRoot?: string;
	}
>(({ folderId, isVirtualRoot, className, children, ...props }, ref) => {
	const { setNodeRef, isOver } = useDroppable({
		id: `drop-breadcrumb-${folderId ?? "root"}`,
		data: { type: "breadcrumb", folderId, isVirtualRoot },
	});

	return (
		<button
			type="button"
			ref={(node) => {
				setNodeRef(node);
				if (typeof ref === "function") ref(node);
				else if (ref) ref.current = node;
			}}
			className={cn(
				"flex items-center gap-1.5 transition-colors outline-none",
				"focus-visible:text-foreground focus-visible:underline focus-visible:decoration-ring focus-visible:decoration-2 focus-visible:underline-offset-4",
				isOver && "text-primary underline decoration-primary decoration-2 underline-offset-4",
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
});
DroppableBreadcrumbNode.displayName = "DroppableBreadcrumbNode";

function DroppableLeafNode({
	folderId,
	children,
	className,
	isVirtualRoot,
}: {
	folderId: string | null;
	children: React.ReactNode;
	className?: string;
	isVirtualRoot?: string;
}) {
	const { setNodeRef, isOver } = useDroppable({
		id: `drop-breadcrumb-${folderId ?? "root"}`,
		data: { type: "breadcrumb", folderId, isVirtualRoot },
	});

	return (
		<span
			ref={setNodeRef}
			className={cn(
				isOver && "text-primary underline decoration-primary decoration-2 underline-offset-4",
				className,
			)}
		>
			{children}
		</span>
	);
}

interface FolderBreadcrumbsProps {
	currentFolderId: string | null;
	allFolders: Folder[];
	onNavigate: (folderId: string | null) => void;

	rootLabel?: string;
	rootIcon?: ElementType;
	rootClassName?: string;
	disableRootDrop?: string;

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
	disableRootDrop,
	itemsToDisplay,
	hideBreadcrumbs = false,
	hideDropdown = false,
	leafClassName = "max-w-37.5 sm:max-w-50 md:max-w-none",
	linkClassName = "max-w-25 sm:max-w-none",
}: FolderBreadcrumbsProps) {
	const isMobile = useIsMobile();
	const displayCount = itemsToDisplay ?? (isMobile ? 3 : 6);

	let breadcrumbs: { id: string; name: string }[] = [];
	if (currentFolderId) {
		let currentFolder = allFolders.find((f) => f.id === currentFolderId);
		while (currentFolder) {
			breadcrumbs.unshift({ id: currentFolder.id, name: currentFolder.name });
			currentFolder = allFolders.find((f) => f.id === currentFolder?.parentId);
		}
	}

	const isTruncated = breadcrumbs.length > displayCount;
	const visibleBreadcrumbs = isTruncated ? breadcrumbs.slice(-displayCount) : breadcrumbs;
	const hiddenBreadcrumbs = isTruncated ? breadcrumbs.slice(0, -displayCount) : [];

	return (
		<Breadcrumb>
			<BreadcrumbList className="flex-nowrap sm:flex-wrap">
				<BreadcrumbItem>
					{!currentFolderId ? (
						<BreadcrumbPage className={rootClassName}>
							<DroppableLeafNode
								folderId={null}
								isVirtualRoot={disableRootDrop}
								className="flex items-center gap-1.5"
							>
								<RootIcon className="size-4 shrink-0" />
								{rootLabel}
							</DroppableLeafNode>
						</BreadcrumbPage>
					) : (
						<BreadcrumbLink asChild className="cursor-pointer hover:text-foreground">
							<DroppableBreadcrumbNode
								folderId={null}
								isVirtualRoot={disableRootDrop}
								onClick={() => onNavigate(null)}
							>
								<RootIcon className="size-4 shrink-0" />
								<span>{rootLabel}</span>
							</DroppableBreadcrumbNode>
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
										<DropdownMenuTrigger className="flex items-center gap-1 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
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
											<DroppableLeafNode folderId={crumb.id}>{crumb.name}</DroppableLeafNode>
										</BreadcrumbPage>
									) : (
										<BreadcrumbLink
											asChild
											className={cn("cursor-pointer truncate hover:text-foreground", linkClassName)}
										>
											<DroppableBreadcrumbNode
												folderId={crumb.id}
												onClick={() => onNavigate(crumb.id)}
											>
												{crumb.name}
											</DroppableBreadcrumbNode>
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
