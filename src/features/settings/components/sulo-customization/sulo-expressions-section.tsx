import { SuloMascot } from "@/components/logo/sulo-mascot";
import { ResetButton } from "@/components/reset-button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { notify } from "@/lib/notify";
import { defaultSettings, EXPRESSIONS, useSettingsStore, type SuloExpression } from "@/stores";
import type { SuloSettings } from "@/types/settings";
import { memo, useCallback, useState } from "react";
import { SettingsCard } from "../settings-card";

const ExpressionCard = memo(function ExpressionCard({
	id,
	label,
	description,
}: {
	id: keyof SuloSettings;
	label: string;
	description: string;
}) {
	const value = useSettingsStore((state) => state.settings.suloSettings[id] as SuloExpression);
	const updateSettings = useSettingsStore((state) => state.updateSettings);
	const [isOpen, setIsOpen] = useState(false);
	const [previewExpr, setPreviewExpr] = useState<SuloExpression | null>(null);

	const handleExpressionChange = (val: SuloExpression) => {
		const currentSettings = useSettingsStore.getState().settings.suloSettings;
		updateSettings({
			suloSettings: {
				...currentSettings,
				[id]: val,
			},
		});
	};

	const currentExpr = previewExpr || value;

	return (
		<div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/50 bg-background p-4 shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-2xl">
			{/* Background floating mascot (subtle) - No scaling on hover */}
			<div className="pointer-events-none absolute -top-6 -right-6 opacity-[0.03] dark:opacity-10">
				<SuloMascot expression={currentExpr} className="h-32 w-32" />
			</div>

			<div className="relative z-10 flex flex-col gap-4">
				{/* Header: Mascot + Title + Description */}
				<div className="flex items-center gap-4">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/50 bg-muted/50 shadow-sm backdrop-blur-sm">
						<SuloMascot expression={currentExpr} className="h-6 w-6" />
					</div>
					<div className="space-y-0.5">
						<h4 className="text-sm leading-none font-semibold text-foreground">{label}</h4>
						<p className="text-xs text-muted-foreground">{description}</p>
					</div>
				</div>

				{/* Select Control */}
				<div className="w-full">
					<Select
						value={value}
						onValueChange={(v) => {
							handleExpressionChange(v as SuloExpression);
							setPreviewExpr(null);
						}}
						onOpenChange={(open) => {
							setIsOpen(open);
							if (!open) setPreviewExpr(null);
						}}
					>
						<SelectTrigger
							id={`expression-${id}`}
							className="w-full bg-background capitalize corner-squircle supports-[corner-shape:squircle]:rounded-xl"
						>
							<SelectValue>
								<span className="capitalize">{value}</span>
							</SelectValue>
						</SelectTrigger>
						<SelectContent position="popper" className="max-h-60" data-no-sound="true">
							{isOpen &&
								EXPRESSIONS.map((expr) => (
									<SelectItem
										key={expr}
										value={expr}
										className="rounded-md px-3 py-2.5 capitalize"
										onMouseEnter={() => setPreviewExpr(expr)}
									>
										{expr}
									</SelectItem>
								))}
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	);
});

export function SuloExpressionsSection() {
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
		<div className="space-y-4">
			<div className="flex items-center justify-between gap-4">
				<h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
					Expressions
				</h3>
				<ResetButton onClick={handleRestoreExpressions} label="Reset Expressions" />
			</div>

			<SettingsCard className="p-4 sm:p-5">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<ExpressionCard
						id="expressionEmptyState"
						label="Empty Corner"
						description="When a folder has no links yet."
					/>
					<ExpressionCard
						id="expression404"
						label="Page Not Found"
						description="When you visit a broken link."
					/>
					<ExpressionCard
						id="expressionNavbar"
						label="Main Logo"
						description="Default state in the navigation bar."
					/>
					<ExpressionCard
						id="expressionQuickAction"
						label="Quick Action Bar"
						description="When adding a link via the command bar."
					/>
					<ExpressionCard
						id="expressionPreviewUnavailable"
						label="Preview Failed"
						description="When a link's image cannot load."
					/>
					<ExpressionCard
						id="expressionError"
						label="App Crash"
						description="When something unexpected goes wrong."
					/>
				</div>
			</SettingsCard>
		</div>
	);
}

const CompactExpressionSelect = memo(function CompactExpressionSelect({
	id,
	label,
	description,
	setPreviewExpression,
}: {
	id: keyof SuloSettings;
	label: string;
	description: string;
	setPreviewExpression?: (expr: SuloExpression) => void;
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
		setPreviewExpression?.(val);
	};

	return (
		<div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
			<div className="space-y-1">
				<Label htmlFor={`expression-compact-${id}`} className="text-sm font-medium text-foreground">
					{label}
				</Label>
				<p className="text-sm text-muted-foreground">{description}</p>
			</div>
			<div className="w-full">
				<Select value={value} onValueChange={(v) => handleExpressionChange(v as SuloExpression)}>
					<SelectTrigger
						id={`expression-compact-${id}`}
						className="w-full capitalize corner-squircle supports-[corner-shape:squircle]:rounded-xl"
					>
						<SelectValue>
							<span className="capitalize">{value}</span>
						</SelectValue>
					</SelectTrigger>
					<SelectContent position="popper" className="max-h-60" data-no-sound="true">
						{EXPRESSIONS.map((expr) => (
							<SelectItem key={expr} value={expr} className="rounded-md px-3 py-2.5 capitalize">
								{expr}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
});

export function SuloExpressionsControl({
	setPreviewExpression,
}: {
	setPreviewExpression?: (expr: SuloExpression) => void;
	variant?: "default" | "compact";
}) {
	return (
		<div className="flex flex-col divide-y divide-border/50">
			<CompactExpressionSelect
				id="expressionEmptyState"
				label="Empty Corner"
				description="When a folder has no links yet."
				setPreviewExpression={setPreviewExpression}
			/>
			<CompactExpressionSelect
				id="expression404"
				label="Page Not Found"
				description="When you visit a broken link."
				setPreviewExpression={setPreviewExpression}
			/>
			<CompactExpressionSelect
				id="expressionNavbar"
				label="Main Logo"
				description="Default state in the navigation bar."
				setPreviewExpression={setPreviewExpression}
			/>
			<CompactExpressionSelect
				id="expressionQuickAction"
				label="Quick Action Bar"
				description="When adding a link via the command bar."
				setPreviewExpression={setPreviewExpression}
			/>
			<CompactExpressionSelect
				id="expressionPreviewUnavailable"
				label="Preview Failed"
				description="When a link's image cannot load."
				setPreviewExpression={setPreviewExpression}
			/>
			<CompactExpressionSelect
				id="expressionError"
				label="App Crash"
				description="When something unexpected goes wrong."
				setPreviewExpression={setPreviewExpression}
			/>
		</div>
	);
}
