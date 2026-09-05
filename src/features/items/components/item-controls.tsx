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
		<div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
			<div className="relative w-full sm:w-64 flex-1">
				<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					type="search"
					placeholder="Search..."
					className="pl-9 pr-9 h-9 rounded-full bg-card corner-squircle"
					value={q}
					onChange={(e) => setQ(e.target.value || null)}
				/>
				{q && (
					<button
						type="button"
						onClick={() => setQ(null)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
						aria-label="Clear search"
					>
						<XIcon className="h-4 w-4" />
					</button>
				)}
			</div>

			<div className="flex items-center gap-2 w-full sm:w-auto justify-end">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="h-9 gap-1 rounded-full corner-squircle text-muted-foreground"
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
					className="h-9 gap-1 rounded-full corner-squircle text-muted-foreground opacity-50 cursor-not-allowed"
					title="Filters coming soon"
				>
					<FilterIcon className="h-4 w-4" />
					Filter
				</Button>
			</div>
		</div>
	);
}
