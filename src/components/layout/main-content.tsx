import { Copy, ExternalLink, Trash2 } from "lucide-react";
import { MOCK_LINKS } from "../../lib/mock-data";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

export function MainContent({ className }: { className?: string }) {
	return (
		<main className={cn("flex flex-col gap-10", className)}>
			{/* Action Buttons */}
			<div className="flex items-center gap-3">
				<Button variant="outline">Button</Button>
				<Button variant="outline">Button</Button>
				<Button variant="outline">Button</Button>
			</div>

			{/* Link List Section */}
			<div className="flex flex-col gap-4">
				<h2 className="text-foreground font-sans text-2xl font-bold tracking-tight">Saved Links</h2>

				<div className="flex flex-col gap-2">
					{MOCK_LINKS.map((link) => (
						<div
							key={link.id}
							className="group hover:bg-card/50 flex items-center justify-between gap-3 rounded-md px-2 py-2 transition-colors"
						>
							<div className="flex items-center gap-3 min-w-0">
								<div className="bg-border flex h-6 w-6 shrink-0 items-center justify-center rounded-full overflow-hidden">
									<img
										src={`https://www.google.com/s2/favicons?domain=${link.url}&sz=64`}
										alt="favicon"
										className="h-full w-full object-cover"
									/>
								</div>
								<span className="text-foreground truncate text-sm font-medium">{link.url}</span>
							</div>

							<div className="flex items-center opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 shrink-0">
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8"
									title="Copy URL"
									onClick={() => navigator.clipboard.writeText(link.url)}
								>
									<Copy className="text-muted-foreground h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8"
									title="Open Link"
									onClick={() => window.open(link.url, "_blank")}
								>
									<ExternalLink className="text-muted-foreground h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 hover:text-destructive"
									title="Delete"
									onClick={() => console.log("Delete clicked for", link.id)}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>
		</main>
	);
}
