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
			<div className="flex flex-col items-center justify-center gap-2 border border-dashed p-8 text-center bg-muted/20 text-muted-foreground rounded-md supports-[corner-shape:squircle]:rounded-[24px] corner-squircle">
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
			<div className="flex flex-col gap-3 rounded-md border p-4 bg-muted/20 animate-pulse">
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
			<div className="relative flex items-start gap-3 rounded-md border p-3 text-muted-foreground bg-muted/10 overflow-hidden">
				<GlobeIcon className="h-4 w-4 mt-0.5 shrink-0 opacity-50 relative z-10" />
				<div className="flex flex-col gap-0.5 leading-tight relative z-10 pr-8">
					<span className="text-sm font-medium text-foreground">Preview unavailable</span>
					<span className="text-xs opacity-80">You can still save this URL to your corner.</span>
				</div>
				<SuloMascot
					expression="confused"
					className="absolute -bottom-5 -right-3 w-16 h-16 -rotate-12 pointer-events-none"
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
		<div className="flex flex-col shrink-0 overflow-hidden rounded-md supports-[corner-shape:squircle]:rounded-[24px] corner-squircle border bg-card text-card-foreground shadow-sm">
			<div className="flex flex-col gap-1 p-3 pb-2">
				<div className="flex items-center gap-2 text-xs text-muted-foreground">
					{metadata.logo ? (
						<img src={metadata.logo} alt="" className="h-3.5 w-3.5 rounded-sm object-cover" />
					) : (
						<GlobeIcon className="h-3.5 w-3.5" />
					)}
					<span className="truncate">{hostname}</span>
				</div>
				<h3 className="line-clamp-2 text-sm font-semibold leading-tight mt-1">
					{metadata.title || "Unknown Title"}
				</h3>
				{metadata.description && (
					<p className="line-clamp-2 text-xs text-muted-foreground mt-0.5">
						{metadata.description}
					</p>
				)}
			</div>
			{metadata.image ? (
				<div className="relative aspect-video w-full overflow-hidden bg-muted border-t">
					<img src={metadata.image} alt="Preview" className="object-cover w-full h-full" />
				</div>
			) : (
				<div className="flex items-center justify-center aspect-3/1 w-full bg-muted border-t text-muted-foreground">
					<ImageIcon className="h-8 w-8 opacity-20" />
				</div>
			)}
		</div>
	);
}
