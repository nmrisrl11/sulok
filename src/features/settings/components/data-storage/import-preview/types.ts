import type {
	ParsedImportData,
	ParsedImportFolder,
	ParsedImportItem,
	ParsedInvalidEntry,
} from "@/features/settings/utils/import-utils";

export type ImportFilterStatus = "all" | "to-import" | "duplicates" | "trash" | "invalid";

export type TreeNode =
	| {
			type: "folder";
			id: string;
			depth: number;
			data: ParsedImportFolder;
	  }
	| {
			type: "item";
			id: string;
			depth: number;
			data: ParsedImportItem;
	  }
	| {
			type: "invalid";
			id: string;
			depth: number;
			data: ParsedInvalidEntry;
	  };

export interface TreeData {
	nodes: TreeNode[];
	foldersById: Map<string, ParsedImportFolder>;
	itemsById: Map<string, ParsedImportItem>;
	folderDescendantItemIdsMap: Map<string, string[]>;
	folderDescendantFolderIdsMap: Map<string, string[]>;
	folderDescendantEmptyFolderIdsMap: Map<string, string[]>;
	emptyFolderIds: Set<string>;
	itemAncestorFolderIdsMap: Map<string, string[]>;
	folderAncestorFolderIdsMap: Map<string, string[]>;
	allSelectableItemIds: string[];
	allSelectableFolderIds: string[];
	allSelectableEmptyFolderIds: string[];
	folderDirectItemCountMap: Map<string, number>;
	folderSelectableDescendantItemCountMap: Map<string, number>;
}

export interface ImportPreviewDialogProps {
	isOpen: boolean;
	onClose: (success?: boolean) => void;
	data: ParsedImportData;
	onImportingChange?: (isImporting: boolean) => void;
}
