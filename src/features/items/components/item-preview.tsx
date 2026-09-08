import { SuloMascot } from "@/components/logo/sulo-mascot";
import { Skeleton } from "@/components/ui/skeleton";
import { GlobeIcon, ImageIcon } from "lucide-react";
import type { URLMetadata } from "../hooks/use-metadata";

interface ItemPreviewProps {
	metadata: URLMetadata | null;
	loading: boolean;
	error: string | null;
	url: string;
}

export function ItemPreview({ metadata, loading, error, url }: ItemPreviewProps) {
	if (!url && !loading && !error && !metadata) {
		return (
			<div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-muted/20 p-8 text-center text-muted-foreground corner-squircle supports-[corner-shape:squircle]:rounded-[24px]">
				<GlobeIcon className="h-8 w-8 opacity-20" />
				<div className="flex flex-col gap-1">
					<p className="text-sm font-medium">No preview available</p>
					<p className="text-xs">Enter a URL to see how it will look</p>
				</div>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="flex animate-pulse flex-col gap-3 rounded-md border bg-muted/20 p-4">
				<div className="flex items-center gap-2">
					<Skeleton className="h-4 w-4 rounded-full" />
					<Skeleton className="h-4 w-32" />
				</div>
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-32 w-full rounded-md" />
			</div>
		);
	}

	if (error && !metadata) {
		return (
			<div
				role="alert"
				className="relative flex items-start gap-3 overflow-hidden rounded-md border bg-muted/10 p-3 text-muted-foreground"
			>
				<GlobeIcon className="relative z-10 mt-0.5 h-4 w-4 shrink-0 opacity-50" />
				<div className="relative z-10 flex flex-col gap-0.5 pr-8 leading-tight">
					<span className="text-sm font-medium text-foreground">Preview unavailable</span>
					<span className="text-xs opacity-80">You can still save this URL to your corner.</span>
				</div>
				<SuloMascot
					expression="confused"
					className="pointer-events-none absolute -right-3 -bottom-5 h-16 w-16 -rotate-12"
				/>
			</div>
		);
	}

	if (!metadata) {
		return null;
	}

	const hostname = (() => {
		try {
			return new URL(metadata.url || url).hostname;
		} catch {
			return metadata.url || url;
		}
	})();

	return (
		<div className="flex shrink-0 flex-col overflow-hidden rounded-md border bg-card text-card-foreground shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-[24px]">
			{metadata.image ? (
				<div className="relative aspect-video w-full overflow-hidden border-b bg-muted">
					<img src={metadata.image} alt="Preview" className="h-full w-full object-cover" />
				</div>
			) : (
				<div className="flex aspect-3/1 w-full items-center justify-center border-b bg-muted text-muted-foreground">
					<ImageIcon className="h-8 w-8 opacity-20" />
				</div>
			)}
			<div className="flex flex-col gap-1 p-3 pt-2">
				<div className="flex items-center gap-2 text-xs text-muted-foreground">
					{metadata.logo ? (
						<img src={metadata.logo} alt="" className="h-3.5 w-3.5 rounded-sm object-cover" />
					) : (
						<GlobeIcon className="h-3.5 w-3.5" />
					)}
					<span className="truncate">{hostname}</span>
				</div>
				<h3 className="mt-1 line-clamp-2 text-sm leading-tight font-semibold">
					{metadata.title || "Unknown Title"}
				</h3>
				{metadata.description && (
					<p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
						{metadata.description}
					</p>
				)}
			</div>
		</div>
	);
}
