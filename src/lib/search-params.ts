import { parseAsBoolean, parseAsString, parseAsStringEnum } from "nuqs";

export const SORT_OPTIONS = ["date-desc", "date-asc", "name-asc", "name-desc"] as const;
export const VIEW_OPTIONS = ["all", "favorites", "trash"] as const;
export const VIEW_MODE_OPTIONS = ["list", "grid", "compact"] as const;
export const TYPE_FILTER_OPTIONS = ["all", "folders", "links"] as const;

export const viewParser = parseAsStringEnum([...VIEW_OPTIONS]).withDefault("all");
export const viewModeParser = parseAsStringEnum([...VIEW_MODE_OPTIONS]).withDefault("list");
export const sortOptionParser = parseAsStringEnum([...SORT_OPTIONS]).withDefault("date-desc");
export const typeFilterParser = parseAsString.withDefault("all");
export const folderIdParser = parseAsString.withDefault("");
export const searchQueryParser = parseAsString.withDefault("");
export const mixDataParser = parseAsBoolean.withDefault(false);
