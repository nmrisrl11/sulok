import { SiteFavicon } from "@/components/site-favicon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { APP_INFO } from "@/constants/app-info";
import type { Item } from "@/db/db";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";
import { useConfirmationStore } from "@/stores/confirmation-store";
import { useItemStore } from "@/stores/item-store";
import { useLogoStore } from "@/stores/logo-store";
import {
	CheckIcon,
	CopyIcon,
	Edit2Icon,
	ExternalLinkIcon,
	MoreVerticalIcon,
	Trash2Icon,
} from "lucide-react";
import { memo } from "react";

export const ItemCard = memo(function ItemCard({ item }: { item: Item }) {
	const deleteItem = useItemStore((state) => state.deleteItem);
	const openEditDialog = useItemStore((state) => state.openEditDialog);
	const toggleSelection = useItemStore((state) => state.toggleSelection);

	const isSelected = useItemStore((state) => state.selectedIds.includes(item.id));

	const confirm = useConfirmationStore((state) => state.confirm);
	const { isCopied, copyToClipboard } = useCopyToClipboard();

	const titleToDisplay = item.title || item.url;

	const handleDelete = () => {
		confirm({
			title: "Delete Item",
			description: `Are you sure you want to delete this item from your ${APP_INFO.name}? This action cannot be undone.`,
			confirmText: "Delete",
			onConfirm: async () => {
				try {
					await deleteItem(item.id);
					useLogoStore.getState().setTemporaryExpression("unimpressed");
					notify.success("Removed from your corner", { id: "item-deleted", hideReaction: true });
				} catch (error) {
					console.error("Failed to delete item", error);
					notify.error("Unable to remove link", { id: "item-delete-fail" });
				}
			},
		});
	};

	const handleOpenLink = () => {
		window.open(item.url, "_blank", "noopener,noreferrer");
	};

	return (
		<div
			className={cn(
				"group flex items-center justify-between gap-3 rounded-md px-2 py-2 transition-colors corner-squircle hover:bg-card/50 supports-[corner-shape:squircle]:rounded-xl",
				isSelected && "bg-card/50 shadow-sm ring-1 ring-border",
			)}
		>
			<div className="flex min-w-0 flex-1 items-center gap-3">
				<Checkbox
					checked={isSelected}
					onCheckedChange={() => toggleSelection(item.id)}
					className="shrink-0 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
				/>
				<a
					href={item.url}
					target="_blank"
					rel="noopener noreferrer"
					className="flex min-w-0 flex-1 items-center gap-3 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
				>
					<SiteFavicon url={item.url} logo={item.logo} className="h-6 w-6 shrink-0" />
					<div className="flex flex-col overflow-hidden">
						<span className="line-clamp-2 text-sm font-medium text-foreground decoration-muted-foreground/30 underline-offset-4 hover:underline">
							{titleToDisplay}
						</span>
						{item.title && item.title !== item.url && (
							<span className="truncate font-mono text-[11px] tracking-tight text-muted-foreground">
								{item.url}
							</span>
						)}
					</div>
				</a>
			</div>

			<div className="flex shrink-0 items-center gap-1 sm:gap-2">
				<div className="hidden shrink-0 items-center opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 md:flex">
					<Button
						variant="ghost"
						size="icon"
						className={cn(
							"h-8 w-8 transition-colors",
							isCopied
								? "text-emerald-600 hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/30"
								: "text-muted-foreground hover:text-foreground",
						)}
						onClick={() => copyToClipboard(item.url)}
					>
						{isCopied ? (
							<CheckIcon className="h-4 w-4" aria-hidden="true" />
						) : (
							<CopyIcon className="h-4 w-4" aria-hidden="true" />
						)}
						<span className="sr-only">Copy URL</span>
					</Button>

					<Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleOpenLink}>
						<ExternalLinkIcon className="h-4 w-4 text-muted-foreground" />
						<span className="sr-only">Open Link</span>
					</Button>

					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8"
						onClick={() => openEditDialog(item)}
					>
						<Edit2Icon className="h-4 w-4 text-muted-foreground" />
						<span className="sr-only">Edit</span>
					</Button>

					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 hover:text-destructive"
						onClick={handleDelete}
					>
						<Trash2Icon className="h-4 w-4" />
						<span className="sr-only">Delete</span>
					</Button>
				</div>

				<div className="flex md:hidden">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="h-11 w-11 text-muted-foreground">
								<MoreVerticalIcon className="h-4 w-4" />
								<span className="sr-only">Actions</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-40">
							<DropdownMenuItem
								onClick={() => copyToClipboard(item.url)}
								className="cursor-pointer py-2.5 md:py-1.5"
							>
								<CopyIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/80" />
								<span className="text-[13px]">Copy URL</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={handleOpenLink}
								className="cursor-pointer py-2.5 md:py-1.5"
							>
								<ExternalLinkIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/80" />
								<span className="text-[13px]">Open Link</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => openEditDialog(item)}
								className="cursor-pointer py-2.5 md:py-1.5"
							>
								<Edit2Icon className="mr-2 h-3.5 w-3.5 text-muted-foreground/80" />
								<span className="text-[13px]">Edit</span>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={handleDelete}
								variant="destructive"
								className="cursor-pointer py-2.5 md:py-1.5"
							>
								<Trash2Icon className="mr-2 h-3.5 w-3.5 opacity-70" />
								<span className="text-[13px]">Delete</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	);
});
