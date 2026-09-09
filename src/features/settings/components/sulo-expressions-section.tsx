import { SuloMascot } from "@/components/logo/sulo-mascot";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { notify } from "@/lib/notify";
import { EXPRESSIONS, type SuloExpression } from "@/stores/logo-store";
import { defaultSettings, useSettingsStore } from "@/stores/settings-store";
import type { SuloSettings } from "@/types/settings";
import { RotateCcwIcon } from "lucide-react";
import { memo, useCallback, useState } from "react";

const ExpressionSelect = memo(function ExpressionSelect({
	id,
	label,
	description,
	setPreviewExpression,
}: {
	id: keyof SuloSettings;
	label: string;
	description: string;
	setPreviewExpression: (expr: SuloExpression) => void;
}) {
	const value = useSettingsStore((state) => state.settings.suloSettings[id] as SuloExpression);
	const updateSettings = useSettingsStore((state) => state.updateSettings);

	const handleExpressionChange = (val: SuloExpression) => {
		const currentSettings = useSettingsStore.getState().settings.suloSettings;
		updateSettings({
			suloSettings: {
				...currentSettings,
				[id]: val,
			},
		});
		setPreviewExpression(val);
	};

	return (
		<div className="space-y-2">
			<Label htmlFor={`expression-${id}`}>{label}</Label>
			<Select value={value} onValueChange={(v) => handleExpressionChange(v as SuloExpression)}>
				<SelectTrigger id={`expression-${id}`} className="w-full capitalize">
					<SelectValue />
				</SelectTrigger>
				<SelectContent position="popper" className="max-h-60" data-no-sound="true">
					{EXPRESSIONS.map((expr) => (
						<SelectItem
							key={expr}
							value={expr}
							className="rounded-md px-3 py-2.5 capitalize"
							onMouseEnter={() => setPreviewExpression(expr)}
						>
							{expr}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<p className="text-xs text-muted-foreground">{description}</p>
		</div>
	);
});

const ExpressionsHeader = memo(function ExpressionsHeader({
	onRestore,
}: {
	onRestore: () => void;
}) {
	return (
		<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
			<div>
				<h3 className="text-sm font-semibold">Expressions</h3>
				<p className="text-sm text-muted-foreground">
					Choose Sulo's default reaction for different scenarios.
				</p>
			</div>
			<Button
				variant="outline"
				size="sm"
				onClick={onRestore}
				className="w-full shrink-0 gap-2 sm:w-auto"
			>
				<RotateCcwIcon className="h-3.5 w-3.5" />
				Reset Expressions
			</Button>
		</div>
	);
});

export function SuloExpressionsSection() {
	const [previewExpression, setPreviewExpression] = useState<SuloExpression>("happy");
	const updateSettings = useSettingsStore((state) => state.updateSettings);

	const handleRestoreExpressions = useCallback(() => {
		const currentSettings = useSettingsStore.getState().settings.suloSettings;
		updateSettings({
			suloSettings: {
				...currentSettings,
				expression404: defaultSettings.suloSettings.expression404,
				expressionEmptyState: defaultSettings.suloSettings.expressionEmptyState,
				expressionNavbar: defaultSettings.suloSettings.expressionNavbar,
				expressionQuickAction: defaultSettings.suloSettings.expressionQuickAction,
				expressionPreviewUnavailable: defaultSettings.suloSettings.expressionPreviewUnavailable,
				expressionError: defaultSettings.suloSettings.expressionError,
			},
		});
		notify.success("Expressions restored", { id: "restore-expressions" });
	}, [updateSettings]);

	return (
		<div className="space-y-6">
			<ExpressionsHeader onRestore={handleRestoreExpressions} />

			{/* Horizontal Full-Width Preview Banner */}
			<div className="relative flex w-full items-center gap-6 overflow-hidden rounded-xl border bg-card p-6 shadow-sm">
				{/* Dotted Background Pattern */}
				<div
					className="pointer-events-none absolute inset-0 text-foreground opacity-[0.08]"
					style={{
						backgroundImage:
							"radial-gradient(circle at center, currentColor 1.5px, transparent 1.5px)",
						backgroundSize: "24px 24px",
					}}
				/>
				{/* Gradient Fades for the pattern */}
				<div className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-transparent to-card" />
				<div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent to-card/80" />

				{/* Content */}
				<div className="relative z-10 flex h-20 w-20 shrink-0 items-center justify-center rounded-full border bg-muted/80 shadow-sm backdrop-blur-sm">
					<SuloMascot expression={previewExpression} className="h-12 w-12" />
				</div>
				<div className="relative z-10 flex-1">
					<div className="flex items-center justify-between gap-4">
						<div>
							<p className="text-xs font-semibold tracking-wider text-foreground uppercase">
								Meet Sulo
							</p>
							<p className="mt-1 max-w-sm text-sm leading-relaxed text-balance text-muted-foreground">
								He's the little guy who watches over your corner of the web. Right now, he's looking{" "}
								<span className="font-medium text-foreground capitalize">{previewExpression}</span>.
							</p>
						</div>
						<div className="hidden shrink-0 items-center gap-2 text-xs font-medium text-muted-foreground sm:flex">
							<span className="relative flex h-2 w-2">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
								<span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
							</span>
							Live Preview
						</div>
					</div>
				</div>
			</div>

			<div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
				<ExpressionSelect
					id="expressionEmptyState"
					label="Empty Corner"
					description="When a folder has no links yet."
					setPreviewExpression={setPreviewExpression}
				/>
				<ExpressionSelect
					id="expression404"
					label="Page Not Found"
					description="When you visit a broken link."
					setPreviewExpression={setPreviewExpression}
				/>
				<ExpressionSelect
					id="expressionNavbar"
					label="Main Logo"
					description="Default state in the navigation bar."
					setPreviewExpression={setPreviewExpression}
				/>
				<ExpressionSelect
					id="expressionQuickAction"
					label="Quick Action Bar"
					description="When adding a link via the command bar."
					setPreviewExpression={setPreviewExpression}
				/>
				<ExpressionSelect
					id="expressionPreviewUnavailable"
					label="Preview Failed"
					description="When a link's image cannot load."
					setPreviewExpression={setPreviewExpression}
				/>
				<ExpressionSelect
					id="expressionError"
					label="App Crash"
					description="When something unexpected goes wrong."
					setPreviewExpression={setPreviewExpression}
				/>
			</div>
		</div>
	);
}
