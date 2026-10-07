import { SuloMascot } from "@/components/logo/sulo-mascot";
import { APP_INFO } from "@/constants/app-info";
import { CornerDownLeftIcon } from "lucide-react";

export function SmartClipboardMock() {
	return (
		<div className="relative flex h-60 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-muted/20 shadow-inner select-none corner-squircle supports-[corner-shape:squircle]:rounded-3xl supports-[corner-shape:squircle]:corner-squircle sm:w-85">
			{/* Fake App Background */}
			<div className="absolute inset-0 flex opacity-20">
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

			{/* Foreground Interaction Mock */}
			<div className="relative z-10 flex w-full flex-col items-center gap-8 px-8">
				{/* Keyboard Shortcut Indicator */}
				<div className="flex items-center gap-2 drop-shadow-lg">
					<div className="flex h-12 min-w-14 items-center justify-center rounded-xl border-b-4 border-border/80 bg-background px-3 font-mono text-sm font-bold text-foreground shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-xl">
						Ctrl
					</div>
					<span className="text-xl font-bold text-muted-foreground/50">+</span>
					<div className="flex h-12 min-w-12 items-center justify-center rounded-xl border-b-4 border-border/80 bg-background px-3 font-mono text-lg font-bold text-foreground shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-xl">
						V
					</div>
				</div>

				{/* Quick Link Action Bar (FAB) Mock */}
				<div className="mx-auto flex w-full max-w-md items-center gap-3 rounded-full border border-border bg-card/80 p-1.5 pr-2 text-card-foreground shadow-lg backdrop-blur-md transition-all duration-300 corner-squircle hover:scale-105 supports-[corner-shape:squircle]:rounded-2xl">
					<div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted/30 transition-colors">
						<SuloMascot expression="happy" className="h-5 w-5" />
					</div>

					<div className="flex max-w-full flex-1 items-center gap-3 overflow-hidden opacity-100 transition-all duration-300 ease-in-out">
						<span className="min-w-0 flex-1 truncate text-sm text-foreground">
							{`https://${APP_INFO.appUrl}`}
						</span>
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow transition-transform duration-300 corner-squircle supports-[corner-shape:squircle]:rounded-xl">
							<CornerDownLeftIcon className="h-4 w-4" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
