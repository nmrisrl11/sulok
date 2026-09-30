import { FolderIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import { memo, useDeferredValue, useEffect, useMemo, useState } from "react";
import { type FolderRef } from "./types";

interface VirtualFolderComboboxProps {
	folders: FolderRef[];
	value: string;
	onValueChange: (value: string) => void;
}

export function VirtualFolderCombobox({
	folders,
	value,
	onValueChange,
}: VirtualFolderComboboxProps) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");

	const deferredSearch = useDeferredValue(search);

	const filteredFolders = useMemo(() => {
		const unorg: FolderRef = { id: "unorganized", name: "Library (Unorganized)" };
		if (!deferredSearch.trim()) return [unorg, ...folders];

		const query = deferredSearch.toLowerCase();
		const results = folders.filter((f) => f.name.toLowerCase().includes(query));

		if (unorg.name.toLowerCase().includes(query)) {
			return [unorg, ...results];
		}
		return results;
	}, [folders, deferredSearch]);

	const selectedFolder = useMemo(() => {
		if (value === "unorganized") return { id: "unorganized", name: "Library (Unorganized)" };
		return folders.find((f) => f.id === value);
	}, [folders, value]);

	const handleSelect = (id: string) => {
		onValueChange(id);
		setOpen(false);
		setSearch("");
	};

	// Safely expand the extension popup window when the dropdown opens to prevent clipping
	// It dynamically calculates the required height based on the number of filtered folders
	useEffect(() => {
		if (open) {
			const listHeight =
				filteredFolders.length === 0
					? 70 // Provide space for the empty state fallback message
					: Math.min(240, filteredFolders.length * 36);
			const dropdownHeight = 42 + listHeight + 10; // search input + list + padding

			document.body.style.paddingBottom = `${dropdownHeight}px`;
			// Reset any previous minHeight if it was stuck
			document.body.style.minHeight = "";
			document.documentElement.style.minHeight = "";
		} else {
			// Small delay to allow close animation to finish
			const timer = setTimeout(() => {
				document.body.style.paddingBottom = "";
			}, 200);
			return () => clearTimeout(timer);
		}
	}, [open, filteredFolders.length]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					id="folder"
					className="w-full justify-between bg-input/20 px-3 font-normal"
				>
					<div className="flex items-center gap-2 truncate">
						<FolderIcon
							className={cn("size-4 shrink-0", value === "unorganized" && "opacity-70")}
						/>
						<span className="truncate">{selectedFolder?.name || "Select folder..."}</span>
					</div>
					<ChevronDownIcon className="size-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="flex w-(--radix-popover-trigger-width) flex-col overflow-hidden p-0"
				align="start"
				side="bottom"
				sideOffset={4}
				collisionPadding={8}
				style={{ maxHeight: "var(--radix-popover-content-available-height)" }}
			>
				<div className="flex shrink-0 items-center border-b border-border/50 px-3">
					<SearchIcon className="mr-2 size-4 shrink-0 opacity-50" />
					<input
						id="folder-search"
						name="folder-search"
						autoComplete="off"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search folders..."
						className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
					/>
				</div>
				<VirtualFolderList folders={filteredFolders} value={value} onSelect={handleSelect} />
			</PopoverContent>
		</Popover>
	);
}

const VirtualFolderList = memo(function VirtualFolderList({
	folders,
	value,
	onSelect,
}: {
	folders: FolderRef[];
	value: string;
	onSelect: (id: string) => void;
}) {
	const [parentEl, setParentEl] = useState<HTMLDivElement | null>(null);

	// eslint-disable-next-line react/incompatible-library
	const rowVirtualizer = useVirtualizer({
		count: folders.length,
		getScrollElement: () => parentEl,
		estimateSize: () => 36, // ~36px height per item
		overscan: 5,
	});

	const virtualItems = rowVirtualizer.getVirtualItems();
	const deferredVirtualItems = useDeferredValue(virtualItems);

	return (
		<div ref={setParentEl} className="custom-scrollbar max-h-60 min-h-0 flex-1 overflow-y-auto p-1">
			{folders.length === 0 ? (
				<div className="py-6 text-center text-sm text-muted-foreground">No folders found.</div>
			) : (
				<div className="relative w-full" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
					{deferredVirtualItems.map((virtualRow) => {
						const item = folders[virtualRow.index];
						if (!item) return null;
						const isSelected = value === item.id;

						return (
							<div
								key={virtualRow.key}
								data-index={virtualRow.index}
								ref={rowVirtualizer.measureElement}
								className="absolute top-0 left-0 w-full px-1 py-0.5"
								style={{
									transform: `translate3d(0, ${virtualRow.start}px, 0)`,
									willChange: "transform",
								}}
							>
								<button
									type="button"
									onClick={() => onSelect(item.id)}
									className={cn(
										"relative flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground",
										isSelected && "bg-accent text-accent-foreground",
									)}
								>
									<FolderIcon
										className={cn(
											"mr-2 size-4 shrink-0",
											item.id === "unorganized" && "opacity-70",
										)}
									/>
									<span className="flex-1 truncate text-left">{item.name}</span>
									{isSelected && <CheckIcon className="ml-2 size-4 shrink-0" />}
								</button>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
});
