import { STORAGE_KEYS } from "@/constants/storage-keys";

export const getHasDataHint = () => {
	return localStorage.getItem(STORAGE_KEYS.HAS_DATA) === "true";
};

export const setHasDataHint = (hasData: boolean) => {
	if (hasData) {
		localStorage.setItem(STORAGE_KEYS.HAS_DATA, "true");
	} else {
		localStorage.removeItem(STORAGE_KEYS.HAS_DATA);
	}
};
