import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export function DebouncedColorPicker({
	value,
	onChange,
	id,
	"aria-label": ariaLabel,
	className,
}: {
	value: string;
	onChange: (val: string) => void;
	id?: string;
	"aria-label"?: string;
	className?: string;
}) {
	const [localValue, setLocalValue] = useState(value);
	const [prevValueState, setPrevValueState] = useState(value);
	const onChangeRef = useRef(onChange);
	const localValueRef = useRef(localValue);
	const valueRef = useRef(value);

	useEffect(() => {
		onChangeRef.current = onChange;
		localValueRef.current = localValue;
		valueRef.current = value;
	}, [onChange, localValue, value]);

	if (value !== prevValueState) {
		setLocalValue(value);
		setPrevValueState(value);
	}

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (localValue !== value) {
				onChange(localValue);
			}
		}, 50); // 50ms debounce
		return () => clearTimeout(timeout);
	}, [localValue, onChange, value]);

	// Flush dirty value on unmount
	useEffect(() => {
		return () => {
			if (localValueRef.current !== valueRef.current) {
				onChangeRef.current(localValueRef.current);
			}
		};
	}, []);

	return (
		<input
			type="color"
			value={localValue}
			onChange={(e) => setLocalValue(e.target.value)}
			onBlur={() => {
				if (localValue !== value) {
					onChange(localValue);
				}
			}}
			className={cn(
				"cursor-pointer border-0 p-0",
				className || "absolute -top-2 -left-2 h-12 w-12",
			)}
			id={id}
			aria-label={ariaLabel || (id ? undefined : "Color picker")}
		/>
	);
}
