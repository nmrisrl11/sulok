import { SuloMascot } from "@/components/logo/sulo-mascot";
import { useSettingsStore } from "@/stores";
import { CornerDownLeftIcon } from "lucide-react";

export function QuickActionBarMock() {
	const defaultExpression = useSettingsStore(
		(state) => state.settings.suloSettings.expressionQuickAction,
	);

	return (
		<div className="group relative flex h-60 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-muted/20 shadow-inner select-none corner-squircle supports-[corner-shape:squircle]:rounded-3xl supports-[corner-shape:squircle]:corner-squircle sm:w-85">
			{/* Fake App Background */}
			<div className="absolute inset-0 flex opacity-20 transition-opacity duration-500 group-hover:opacity-10">
				{/* Faint Sidebar */}
				<div className="flex w-24 flex-col gap-3 border-r border-border/50 p-4">
					<div className="h-4 w-full rounded bg-foreground/20" />
					<div className="mt-2 h-2 w-3/4 rounded bg-foreground/10" />
					<div className="h-2 w-5/6 rounded bg-foreground/10" />
					<div className="h-2 w-4/6 rounded bg-foreground/10" />
				</div>
				{/* Faint Main Content */}
				<div className="flex flex-1 flex-col gap-4 p-4">
					<div className="h-6 w-1/3 rounded bg-foreground/20" />
					<div className="grid grid-cols-2 gap-3">
						<div className="h-16 rounded-lg bg-foreground/10" />
						<div className="h-16 rounded-lg bg-foreground/10" />
						<div className="h-16 rounded-lg bg-foreground/10" />
						<div className="h-16 rounded-lg bg-foreground/10" />
					</div>
				</div>
			</div>

			{/* Hint Text */}
			<div className="absolute top-1/2 -translate-y-1/2 text-center text-sm font-medium text-muted-foreground transition-opacity duration-300 group-hover:opacity-0 max-sm:hidden">
				Hover over the FAB
			</div>

			{/* FAB Mock (Interactive via Group Hover) */}
			<div className="absolute right-0 bottom-6 left-0 mx-auto flex items-center justify-center">
				<div className="flex h-13 w-13 items-center gap-3 overflow-hidden rounded-full border border-border bg-card/90 p-1.5 pr-1.5 text-card-foreground shadow-lg backdrop-blur-md transition-all duration-500 ease-out corner-squircle group-hover:w-65 group-hover:pr-2 supports-[corner-shape:squircle]:rounded-2xl max-sm:w-65 max-sm:pr-2">
					{/* Mascot Icon */}
					<div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted/30 transition-colors">
						<SuloMascot
							expression={defaultExpression}
							className="absolute inset-0 m-auto h-5 w-5 opacity-100 transition-all duration-500 group-hover:scale-110 group-hover:opacity-0 max-sm:scale-110 max-sm:opacity-0"
						/>
						<SuloMascot
							expression="curious"
							className="absolute inset-0 m-auto h-5 w-5 scale-90 opacity-0 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100 max-sm:scale-110 max-sm:opacity-100"
						/>
					</div>

					{/* Expanded Content */}
					<div className="flex min-w-47.5 flex-1 items-center gap-2 opacity-0 transition-opacity duration-500 group-hover:opacity-100 max-sm:opacity-100">
						<span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
							Drop a link to your corner...
						</span>
						<div className="flex h-8 w-8 shrink-0 items-center justify-center text-muted-foreground transition-colors duration-300">
							<CornerDownLeftIcon className="h-4 w-4" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
