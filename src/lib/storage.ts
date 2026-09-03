import { STORAGE_KEYS } from "@/constants/storage-keys";

export const getHasDataHint = (): boolean | undefined => {
	const val = localStorage.getItem(STORAGE_KEYS.HAS_DATA);
	if (val === null) return undefined;
	return val === "true";
};

export const setHasDataHint = (hasData: boolean) => {
	localStorage.setItem(STORAGE_KEYS.HAS_DATA, hasData ? "true" : "false");
};
