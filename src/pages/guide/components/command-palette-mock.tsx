import { FolderIcon as CustomFolderIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "framer-motion";
import { MousePointer2Icon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

const MOCK_FOLDERS = [
	{ name: "Development" },
	{ name: "Design Inspiration" },
	{ name: "Personal Projects" },
	{ name: "Travel Plans" },
];

export function CommandPaletteMock() {
	const prefersReducedMotion = useReducedMotion() === true;
	const [step, setStep] = useState(0);

	useEffect(() => {
		if (prefersReducedMotion) return;
		let isMounted = true;
		const runLoop = async () => {
			while (isMounted) {
				setStep(0); // Idle
				await new Promise((r) => setTimeout(r, 1000));
				if (!isMounted) break;

				setStep(1); // Mouse moves to search bar
				await new Promise((r) => setTimeout(r, 700));
				if (!isMounted) break;

				setStep(2); // Mouse clicks search bar
				await new Promise((r) => setTimeout(r, 300));
				if (!isMounted) break;

				// Typing "Travel"
				const typeDelays = [150, 100, 120, 180, 100, 150];
				for (let i = 1; i <= 6; i++) {
					setStep(2 + i);
					await new Promise((r) => setTimeout(r, typeDelays[i - 1]));
					if (!isMounted) break;
				}
				if (!isMounted) break;

				setStep(9); // Pause after typing
				await new Promise((r) => setTimeout(r, 600));
				if (!isMounted) break;

				setStep(10); // Mouse moves to item
				await new Promise((r) => setTimeout(r, 800));
				if (!isMounted) break;

				setStep(11); // Mouse clicks item
				await new Promise((r) => setTimeout(r, 400));
				if (!isMounted) break;

				setStep(12); // Hold before reset
				await new Promise((r) => setTimeout(r, 1500));
			}
		};
		runLoop();
		return () => {
			isMounted = false;
		};
	}, [prefersReducedMotion]);

	const getSearchTerm = (s: number) => {
		if (s === 3) return "T";
		if (s === 4) return "Tr";
		if (s === 5) return "Tra";
		if (s === 6) return "Trav";
		if (s === 7) return "Trave";
		if (s >= 8) return "Travel";
		return "";
	};

	const searchTerm = prefersReducedMotion ? "Travel" : getSearchTerm(step);
	const filteredFolders = MOCK_FOLDERS.filter((f) =>
		f.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const isHoveringItem = prefersReducedMotion || step >= 10;
	const showPing = !prefersReducedMotion && (step === 2 || step === 11);
	const isInputFocused = prefersReducedMotion || step >= 2;

	return (
		<div className="relative flex h-72 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-muted/20 shadow-inner select-none corner-squircle supports-[corner-shape:squircle]:rounded-3xl supports-[corner-shape:squircle]:corner-squircle sm:w-85">
			{/* Mock Command Palette Container */}
			<div
				className={cn(
					"relative z-10 flex w-full max-w-65 flex-col overflow-hidden rounded-2xl border border-border bg-popover p-3 text-popover-foreground shadow-xl shadow-black/5 transition-[border-color,box-shadow] duration-300 corner-squircle supports-[corner-shape:squircle]:rounded-3xl dark:shadow-black/20",
					isInputFocused ? "border-primary/30 shadow-2xl shadow-black/10 dark:shadow-black/40" : "",
				)}
			>
				{/* Search Input Area */}
				<div className="flex h-8 items-center gap-2 px-2 pb-1 text-[13px]">
					<SearchIcon className="h-4 w-4 shrink-0 opacity-50" />
					<div className="flex flex-1 items-center">
						{searchTerm ? (
							<div className="flex items-center pl-1.5 text-foreground">
								<span>{searchTerm}</span>
								<div
									className={cn(
										"ml-px h-3.5 w-px bg-foreground",
										!prefersReducedMotion && "animate-pulse",
									)}
								/>
							</div>
						) : (
							<div className="relative pl-1.5 text-muted-foreground">
								<div
									className={cn(
										"absolute top-1/2 left-0 h-3.5 w-px -translate-y-1/2 bg-foreground transition-opacity duration-300",
										isInputFocused ? "opacity-100" : "opacity-0",
										!prefersReducedMotion && "animate-pulse",
									)}
								/>
								Search your corner...
							</div>
						)}
					</div>
				</div>

				{/* Results Area */}
				<div className="mb-0 flex flex-col rounded-xl bg-background pb-1 ring-1 ring-border corner-squircle supports-[corner-shape:squircle]:rounded-2xl">
					<div className="mt-0.5 px-3 py-1.5 text-[10px] font-medium text-muted-foreground">
						Folders
					</div>

					<div className="flex flex-col gap-0.5 px-1.5">
						{filteredFolders.map((folder, i) => {
							const isFirst = i === 0;
							const isHovered = isHoveringItem && isFirst;
							return (
								<div
									key={folder.name}
									className={cn(
										"flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors duration-300",
										isHovered ? "bg-muted text-foreground" : "text-popover-foreground",
										!isHovered && isHoveringItem ? "opacity-60" : "",
									)}
								>
									<CustomFolderIcon className="h-3.5 w-3.5 shrink-0" />
									<span className="truncate text-[13px]">
										{(() => {
											const matchIndex = searchTerm
												? folder.name.toLowerCase().indexOf(searchTerm.toLowerCase())
												: -1;
											return folder.name.split("").map((char, index) => {
												const isMatch =
													matchIndex !== -1 &&
													index >= matchIndex &&
													index < matchIndex + searchTerm.length;
												return (
													<span key={index} className={cn(isMatch && "font-bold")}>
														{char}
													</span>
												);
											});
										})()}
									</span>
								</div>
							);
						})}
					</div>

					<div className="mt-0.5 px-3 py-1.5 text-[10px] font-medium text-muted-foreground opacity-50">
						Links
					</div>
				</div>

				{/* Simulated Cursor */}
				<div
					className={cn(
						"absolute z-20 h-5 w-5 drop-shadow-md transition-all ease-[cubic-bezier(0.2,0.8,0.2,1)]",
						prefersReducedMotion && "opacity-0 delay-0 duration-0",
						!prefersReducedMotion &&
							(step === 0 || step === 12) &&
							"top-30 left-45 opacity-0 duration-700",
						!prefersReducedMotion &&
							step >= 1 &&
							step < 10 &&
							"top-8 left-20 scale-95 opacity-100 duration-700",
						!prefersReducedMotion &&
							step >= 10 &&
							"top-22.5 left-33 scale-95 opacity-100 duration-700",
					)}
				>
					<MousePointer2Icon className="h-full w-full fill-foreground text-foreground" />
					<div
						key={step}
						className={cn(
							"absolute top-0 left-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40",
							showPing && !prefersReducedMotion ? "animate-ping opacity-100" : "opacity-0",
						)}
						style={
							showPing && !prefersReducedMotion
								? {
										animationIterationCount: 1,
										animationFillMode: "forwards",
										animationDuration: "500ms",
									}
								: {}
						}
					/>
				</div>
			</div>
		</div>
	);
}
