import { useEffect, useState } from "react";
import { useDebounce } from "./use-debounce";

export function useDebouncedQuery(
	queryValue: string | null,
	setQueryValue: (value: string | null) => void,
	delay: number = 300,
) {
	const [localValue, setLocalValue] = useState(queryValue || "");
	const debouncedValue = useDebounce(localValue, delay);

	useEffect(() => {
		if (debouncedValue !== (queryValue || "")) {
			setQueryValue(debouncedValue || null);
		}
	}, [debouncedValue, queryValue, setQueryValue]);

	// Derive state during render instead of useEffect (React Compiler strictness)
	const [prevQueryValue, setPrevQueryValue] = useState(queryValue);
	if (queryValue !== prevQueryValue) {
		setPrevQueryValue(queryValue);
		if (queryValue === "" || queryValue === null) {
			setLocalValue("");
		}
	}

	return [localValue, setLocalValue] as const;
}
