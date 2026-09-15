import { FolderLinkIcon, FollowFolderIcon, RecycleBinIcon } from "@/components/icons";
import { FolderRepository } from "@/db/repositories/folder-repository";
import { folderIdParser, viewParser } from "@/lib/search-params";
import { useLiveQuery } from "dexie-react-hooks";
import { useQueryState } from "nuqs";
import { FolderBreadcrumbs } from "./folder-breadcrumbs";

export function ExplorerBreadcrumb() {
	const [folderId, setFolderId] = useQueryState("folder", folderIdParser);
	const [view, setView] = useQueryState("view", viewParser);

	// We need to fetch the hierarchy. Since it's local, we can fetch all folders and build the path.
	const allFolders = useLiveQuery(() => FolderRepository.getAll()) || [];

	const handleNavigate = (id: string | null) => {
		setFolderId(id);
		if (id === null && view !== "favorites" && view !== "trash") {
			setView(null);
		}
	};

	let rootLabel = "Library";
	let RootIcon = FolderLinkIcon;
	let hideDropdown = false;
	let hideBreadcrumbs = false;

	if (view === "favorites") {
		rootLabel = "Favorites";
		RootIcon = FollowFolderIcon;
		hideDropdown = true;
	} else if (view === "trash") {
		rootLabel = "Recycle Bin";
		RootIcon = RecycleBinIcon;
		hideBreadcrumbs = true;
	}

	return (
		<FolderBreadcrumbs
			currentFolderId={folderId}
			allFolders={allFolders}
			onNavigate={handleNavigate}
			rootLabel={rootLabel}
			rootIcon={RootIcon}
			rootClassName="text-base font-semibold"
			hideBreadcrumbs={hideBreadcrumbs}
			hideDropdown={hideDropdown}
			leafClassName="max-w-37.5 sm:max-w-50 md:max-w-none"
			linkClassName="max-w-25 sm:max-w-none"
		/>
	);
}
