import { type Folder, type Item } from "@/db/db";
import { ItemCard } from "@/features/items/components/item-card";
import { ItemCardSkeleton } from "@/features/items/components/item-card-skeleton";
import { ItemGridCard } from "@/features/items/components/item-grid-card";
import { ItemGridCardSkeleton } from "@/features/items/components/item-grid-card-skeleton";
import { mixDataParser, sortOptionParser, viewModeParser } from "@/lib/search-params";
import { getHasDataHint } from "@/lib/storage";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useQueryState } from "nuqs";
import { memo, useDeferredValue, useEffect, useMemo, useState } from "react";
import { FolderCard } from "../folder/folder-card";
import { FolderCardSkeleton } from "../folder/folder-card-skeleton";
import { FolderEmptyState } from "../folder/folder-empty-state";
import { FolderGridCard } from "../folder/folder-grid-card";
import { FolderGridCardSkeleton } from "../folder/folder-grid-card-skeleton";

export function ExplorerMainSkeleton() {
	const [viewMode] = useQueryState("mode", viewModeParser);

	if (viewMode === "grid") {
		return (
			<div role="alert" aria-label="Loading items" className="contents">
				<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
					<FolderGridCardSkeleton />
					<FolderGridCardSkeleton />
					<ItemGridCardSkeleton />
					<ItemGridCardSkeleton />
					<ItemGridCardSkeleton />
					<ItemGridCardSkeleton />
				</div>
			</div>
		);
	}

	return (
		<div role="alert" aria-label="Loading items" className="contents">
			<div id="explorer-main" className="flex flex-col gap-2">
				<FolderCardSkeleton />
				<FolderCardSkeleton />
				<div className="my-4 border-b border-border/50" />
				<ItemCardSkeleton />
				<ItemCardSkeleton />
				<ItemCardSkeleton />
			</div>
		</div>
	);
}

export const ExplorerMain = memo(function ExplorerMain({
	folders,
	items,
	isLoading,
	scrollRef,
}: {
	folders: Folder[];
	items: Item[];
	isLoading: boolean;
	scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
	return (
		<ExplorerMainContent
			folders={folders}
			items={items}
			isLoading={isLoading}
			scrollRef={scrollRef}
		/>
	);
});

type EntityRow = Folder | Item | { id: string; isDivider: true };

function useGridCols() {
	const [cols, setCols] = useState(4);

	useEffect(() => {
		const update = () => {
			if (window.innerWidth >= 1024) setCols(4);
			else if (window.innerWidth >= 768) setCols(3);
			else setCols(2);
		};
		update();
		window.addEventListener("resize", update);
		return () => window.removeEventListener("resize", update);
	}, []);

	return cols;
}

const VirtualRow = memo(function VirtualRow({
	index,
	start,
	chunk,
	viewMode,
}: {
	index: number;
	start: number;
	chunk: EntityRow[];
	viewMode: string;
}) {
	return (
		<div
			data-index={index}
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				transform: `translate3d(0, ${start}px, 0)`,
				willChange: "transform",
				paddingBottom: viewMode === "grid" ? "1rem" : "0.5rem",
			}}
		>
			{viewMode === "grid" ? (
				<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
					{chunk.map((entity) => {
						if (!("url" in entity)) {
							return <FolderGridCard key={entity.id} folder={entity as Folder} />;
						}
						return <ItemGridCard key={entity.id} item={entity as Item} />;
					})}
				</div>
			) : (
				<div className="flex flex-col">
					{chunk.map((entity) => {
						if ("isDivider" in entity) {
							return <div key="divider" className="my-2 border-b border-border/50" />;
						}
						if (!("url" in entity)) {
							return <FolderCard key={entity.id} folder={entity as Folder} />;
						}
						return <ItemCard key={entity.id} item={entity as Item} />;
					})}
				</div>
			)}
		</div>
	);
});

function ExplorerMainContent({
	folders,
	items,
	isLoading,
	scrollRef,
}: {
	folders: Folder[];
	items: Item[];
	isLoading: boolean;
	scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
	const [viewMode] = useQueryState("mode", viewModeParser);
	const [mixData] = useQueryState("mix", mixDataParser);
	const [sortOption] = useQueryState("sort", sortOptionParser);

	const gridCols = useGridCols();
	const columns = viewMode === "grid" ? gridCols : 1;

	const dataToChunk = useMemo(() => {
		if (mixData) {
			const mixed = [...folders, ...items] as (Folder | Item)[];
			mixed.sort((a, b) => {
				const isAFolder = !("url" in a);
				const isBFolder = !("url" in b);
				if (sortOption.startsWith("name")) {
					const nameA = (isAFolder ? (a as Folder).name : (a as Item).title || "").toLowerCase();
					const nameB = (isBFolder ? (b as Folder).name : (b as Item).title || "").toLowerCase();
					return sortOption === "name-asc"
						? nameA.localeCompare(nameB)
						: nameB.localeCompare(nameA);
				}
				return sortOption === "date-asc" ? a.createdAt - b.createdAt : b.createdAt - a.createdAt;
			});
			return mixed;
		}

		if (viewMode === "grid") {
			return [...folders, ...items];
		}

		// List separated mode
		const list: EntityRow[] = [];
		if (folders.length > 0) list.push(...folders);
		if (folders.length > 0 && items.length > 0) list.push({ id: "divider", isDivider: true });
		if (items.length > 0) list.push(...items);
		return list;
	}, [folders, items, mixData, sortOption, viewMode]);

	const chunks = useMemo(() => {
		const result: EntityRow[][] = [];
		for (let i = 0; i < dataToChunk.length; i += columns) {
			result.push(dataToChunk.slice(i, i + columns));
		}
		return result;
	}, [dataToChunk, columns]);

	// eslint-disable-next-line react/incompatible-library
	const rowVirtualizer = useVirtualizer({
		count: chunks.length,
		getScrollElement: () => scrollRef.current,
		estimateSize: (index) => {
			if (viewMode === "grid") return 130; // exact height for grid card (114px) + gap (16px)
			const row = chunks[index];
			if (row.length === 1 && "isDivider" in row[0]) return 41; // divider height (33px) + gap (8px)
			return 74; // exact height for list card (66px) + gap (8px)
		},
		overscan: 5,
	});

	const virtualItems = rowVirtualizer.getVirtualItems();
	const deferredVirtualItems = useDeferredValue(virtualItems);

	if (isLoading) {
		const hasDataHint = getHasDataHint();
		if (!hasDataHint) {
			return (
				<div id="explorer-main" className="flex h-full flex-col">
					<FolderEmptyState animate={false} />
				</div>
			);
		}
		return <ExplorerMainSkeleton />;
	}

	const isEmpty = folders.length === 0 && items.length === 0;

	if (isEmpty) {
		return (
			<div id="explorer-main" className="flex h-full flex-col">
				<FolderEmptyState animate={false} />
			</div>
		);
	}

	return (
		<div
			id="explorer-main"
			style={{
				height: `${rowVirtualizer.getTotalSize()}px`,
				width: "100%",
				position: "relative",
			}}
		>
			{deferredVirtualItems.map((virtualRow) => {
				const chunk = chunks[virtualRow.index];
				if (!chunk) return null;
				return (
					<VirtualRow
						key={virtualRow.key}
						index={virtualRow.index}
						start={virtualRow.start}
						chunk={chunk}
						viewMode={viewMode}
					/>
				);
			})}
		</div>
	);
}
