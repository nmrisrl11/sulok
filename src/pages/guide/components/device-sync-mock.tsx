import { cn } from "@/lib/utils";
import { useReducedMotion } from "framer-motion";
import {
	CheckCircle2Icon,
	CloudDownloadIcon,
	Loader2Icon,
	MousePointer2Icon,
	SendIcon,
	XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

export function DeviceSyncMock() {
	const prefersReducedMotion = useReducedMotion() === true;
	const [step, setStep] = useState(0);

	useEffect(() => {
		if (prefersReducedMotion) {
			return;
		}
		let isMounted = true;
		const runLoop = async () => {
			while (isMounted) {
				setStep(0); // Reset / Idle at bottom
				await new Promise((r) => setTimeout(r, 1000));
				if (!isMounted) break;

				setStep(1); // Cursor moves to Send Data Button
				await new Promise((r) => setTimeout(r, 800)); // Travel time
				if (!isMounted) break;

				setStep(2); // Cursor clicks Send Data Button
				await new Promise((r) => setTimeout(r, 400)); // Click duration
				if (!isMounted) break;

				setStep(3); // Dialog opens & Cursor moves to idle corner
				await new Promise((r) => setTimeout(r, 800)); // Travel time
				if (!isMounted) break;

				setStep(4); // Linger on open dialog
				await new Promise((r) => setTimeout(r, 2000)); // Linger on success
				if (!isMounted) break;

				setStep(5); // Dialog closes, Cursor returns to start, Toast appears
				await new Promise((r) => setTimeout(r, 2000)); // Linger on success toast
			}
		};
		runLoop();
		return () => {
			isMounted = false;
		};
	}, [prefersReducedMotion]);

	const isDialogOpen = prefersReducedMotion || step === 3 || step === 4;
	const showPing = !prefersReducedMotion && step === 2;
	const cursorPosition =
		prefersReducedMotion || step === 3 || step === 4
			? "top-[250px] left-[75%]" // Idle when dialog open
			: step === 0 || step === 5
				? "top-[240px] left-[80%]" // Start position
				: "top-[95px] left-[25%]"; // Over Send Data block

	return (
		<div
			aria-hidden="true"
			className="relative flex h-70 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-muted/20 shadow-inner select-none corner-squircle supports-[corner-shape:squircle]:rounded-3xl supports-[corner-shape:squircle]:corner-squircle sm:w-85"
		>
			{/* Fake App Background (Settings UI) */}
			<div className="absolute inset-0 flex flex-col gap-3 p-4 transition-all duration-500">
				{/* Header Section */}
				<div className="mb-1 flex flex-col gap-1.5">
					<div className="h-3 w-32 rounded bg-foreground/15" />
					<div className="h-2 w-56 rounded bg-foreground/5" />
				</div>

				{/* Grid for Send/Receive Options */}
				<div className="grid grid-cols-2 gap-3">
					{/* Send Data Option */}
					<div
						className={cn(
							"flex flex-col gap-3 rounded-xl border p-3.5 shadow-sm transition-colors duration-300 corner-squircle supports-[corner-shape:squircle]:rounded-3xl",
							step === 2 ? "border-border bg-muted/50" : "border-border/50 bg-background",
						)}
					>
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-card text-foreground shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-2xl">
							<SendIcon className="h-4 w-4" />
						</div>
						<div className="flex flex-col gap-0.5">
							<div className="text-sm font-medium">Send Data</div>
							<div className="text-[10px] leading-tight text-muted-foreground">
								Host a connection to send data
							</div>
						</div>
					</div>

					{/* Receive Data Option */}
					<div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-background p-3.5 opacity-60 shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-3xl">
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-card text-muted-foreground shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-2xl">
							<CloudDownloadIcon className="h-5 w-5" />
						</div>
						<div className="flex flex-col gap-0.5">
							<div className="text-sm font-medium">Receive Data</div>
							<div className="text-[10px] leading-tight text-muted-foreground">
								Connect with code to receive
							</div>
						</div>
					</div>
				</div>

				{/* Dummy Content to fill bottom space */}
				<div className="mt-1 flex flex-col gap-3 opacity-20">
					<div className="h-10 w-full rounded-2xl border border-border bg-foreground/5" />
					<div className="h-16 w-full rounded-2xl border border-border bg-foreground/5" />
				</div>
			</div>

			{/* Dialog Backdrop */}
			<div
				className={cn(
					"absolute inset-0 z-10 bg-background/60 backdrop-blur-[2px] transition-opacity duration-500",
					isDialogOpen ? "opacity-100 delay-0" : "pointer-events-none opacity-0 delay-0",
				)}
			/>

			{/* The Send Data Dialog */}
			<div
				className={cn(
					"absolute top-4 right-5 bottom-4 left-5 z-20 flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition-all duration-500",
					isDialogOpen
						? "scale-100 opacity-100 delay-100"
						: "pointer-events-none scale-95 opacity-0 delay-0",
				)}
			>
				{/* Dialog Header */}
				<div className="flex items-start justify-between border-b border-border p-4 pb-3">
					<div className="flex flex-col gap-1.5">
						<div className="font-heading text-base font-bold">Send Data</div>
						<div className="text-[10px] leading-relaxed text-muted-foreground">
							Enter this code on your other device to connect and transfer your data.
						</div>
					</div>
					<XIcon className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
				</div>

				{/* Dialog Content */}
				<div className="flex flex-1 flex-col justify-center gap-4 bg-muted/10 p-4 pb-6">
					{/* Code Box */}
					<div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-muted/30 p-4 shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-2xl">
						<div className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
							Your Code
						</div>
						<div className="font-mono text-xs font-bold tracking-[0.2em] text-foreground">
							P R K J O 4 I W M A
						</div>
					</div>

					{/* Loading State */}
					<div className="flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2.5 text-[10px] font-medium text-primary corner-squircle supports-[corner-shape:squircle]:rounded-xl">
						<Loader2Icon className={cn("h-3.5 w-3.5", !prefersReducedMotion && "animate-spin")} />
						<span>Waiting for connection...</span>
					</div>
				</div>
			</div>

			{/* Fake Cursor */}
			<div
				className={cn(
					"absolute z-30 h-5 w-5 drop-shadow-md transition-all ease-[cubic-bezier(0.2,0.8,0.2,1)]",
					cursorPosition,
					prefersReducedMotion ? "delay-0 duration-0" : "duration-700",
				)}
			>
				<MousePointer2Icon
					className="h-full w-full text-foreground"
					style={{ fill: "currentColor" }}
				/>
				<div
					key={step} // Force re-mount of ping animation when step changes
					className={cn(
						"absolute top-0 left-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40",
						showPing ? "animate-ping opacity-100" : "opacity-0",
					)}
					style={
						showPing
							? {
									animationIterationCount: 1,
									animationFillMode: "forwards",
									animationDuration: "500ms",
								}
							: {}
					}
				/>
			</div>

			{/* Bottom Centered Success Toast */}
			<div
				className={cn(
					"absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
					!prefersReducedMotion && step === 5
						? "translate-y-0 scale-100 opacity-100 delay-300"
						: "translate-y-4 scale-95 opacity-0",
				)}
			>
				<div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-green-600 shadow-lg dark:border dark:border-border">
					<CheckCircle2Icon className="h-3.5 w-3.5" />
					<span>Transfer Complete!</span>
				</div>
			</div>
		</div>
	);
}
