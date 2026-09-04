import { SiteFavicon } from "@/components/site-favicon";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { APP_INFO } from "@/constants/app-info";
import type { Item } from "@/db/db";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";
import { useConfirmationStore } from "@/stores/confirmation-store";
import { useItemStore } from "@/stores/item-store";
import { useLogoStore } from "@/stores/logo-store";
import { CheckIcon, CopyIcon, Edit2Icon, ExternalLinkIcon, Trash2Icon } from "lucide-react";

export function ItemCard({ item }: { item: Item }) {
	const { deleteItem, openEditDialog } = useItemStore();
	const confirm = useConfirmationStore((state) => state.confirm);
	const { isCopied, copyToClipboard } = useCopyToClipboard();

	const titleToDisplay = item.title || item.url;

	const handleDelete = () => {
		confirm({
			title: "Delete Item",
			description: `Are you sure you want to delete this item from your ${APP_INFO.name}? This action cannot be undone.`,
			confirmText: "Delete",
			onConfirm: async () => {
				await deleteItem(item.id);
				useLogoStore.getState().setTemporaryExpression("unimpressed");
			},
		});
	};

	const handleOpenLink = () => {
		window.open(item.url, "_blank", "noopener,noreferrer");
	};

	return (
		<div className="group hover:bg-card/50 flex items-center justify-between gap-3 rounded-md supports-[corner-shape:squircle]:rounded-xl corner-squircle px-2 py-2 transition-colors">
			<div className="flex items-center gap-3 min-w-0">
				<SiteFavicon url={item.url} className="h-6 w-6 shrink-0" />
				<div className="flex flex-col overflow-hidden">
					<span className="text-foreground truncate text-sm font-medium">{titleToDisplay}</span>
					{item.title && item.title !== item.url && (
						<span className="text-muted-foreground truncate text-xs">{item.url}</span>
					)}
				</div>
			</div>

			<div className="flex items-center opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 shrink-0">
				<Tooltip>
					<TooltipTrigger asChild>
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
					</TooltipTrigger>
					<TooltipContent>
						<p>{isCopied ? "Copied!" : "Copy URL"}</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleOpenLink}>
							<ExternalLinkIcon className="text-muted-foreground h-4 w-4" />
							<span className="sr-only">Open Link</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Open Link</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8"
							onClick={() => openEditDialog(item)}
						>
							<Edit2Icon className="text-muted-foreground h-4 w-4" />
							<span className="sr-only">Edit</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Edit</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 hover:text-destructive"
							onClick={handleDelete}
						>
							<Trash2Icon className="h-4 w-4" />
							<span className="sr-only">Delete</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Delete</p>
					</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
}
