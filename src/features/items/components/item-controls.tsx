import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ArrowUpDownIcon, FilterIcon, SearchIcon, XIcon } from "lucide-react";
import { parseAsString, parseAsStringEnum, useQueryState } from "nuqs";

export function ItemControls() {
	const [q, setQ] = useQueryState("q", parseAsString.withDefault(""));
	const [sort, setSort] = useQueryState(
		"sort",
		parseAsStringEnum(["createdAt", "title"]).withDefault("createdAt"),
	);
	const [dir, setDir] = useQueryState(
		"dir",
		parseAsStringEnum(["asc", "desc"]).withDefault("desc"),
	);

	const sortValue = `${sort}-${dir}`;

	const handleSortChange = (val: string) => {
		const [newSort, newDir] = val.split("-");
		setSort(newSort as "createdAt" | "title");
		setDir(newDir as "asc" | "desc");
	};

	return (
		<div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row">
			<div className="relative w-full flex-1 sm:w-64">
				<SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					id="search-item"
					type="search"
					placeholder="Search..."
					className="h-9 rounded-full bg-card pr-9 pl-9 corner-squircle"
					value={q}
					onChange={(e) => setQ(e.target.value || null)}
					autoComplete="off"
				/>
				{q && (
					<button
						type="button"
						onClick={() => setQ(null)}
						className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
						aria-label="Clear search"
					>
						<XIcon className="h-4 w-4" />
					</button>
				)}
			</div>

			<div className="flex w-full items-center justify-end gap-2 sm:w-auto">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="h-9 gap-1 rounded-full text-muted-foreground corner-squircle"
						>
							<ArrowUpDownIcon className="h-4 w-4" />
							Sort
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-48">
						<DropdownMenuLabel>Sort by</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuRadioGroup value={sortValue} onValueChange={handleSortChange}>
							<DropdownMenuRadioItem value="createdAt-desc">
								Date Added (Newest)
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="createdAt-asc">
								Date Added (Oldest)
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="title-asc">Name (A-Z)</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="title-desc">Name (Z-A)</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Hidden/Disabled Filter for future extensibility */}
				<Button
					variant="ghost"
					size="sm"
					className="h-9 cursor-not-allowed gap-1 rounded-full text-muted-foreground opacity-50 corner-squircle"
					title="Filters coming soon"
					disabled
				>
					<FilterIcon className="h-4 w-4" />
					Filter
				</Button>
			</div>
		</div>
	);
}
