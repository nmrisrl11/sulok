import { gooeyToast } from "goey-toast";

type ToastOptions = {
	id?: string | number;
	description?: string;
	duration?: number;
	action?: {
		label: string;
		onClick: () => void;
	};
};

type PromiseOptions<T> = {
	loading: string;
	success: string | ((data: T) => string);
	error: string | ((error: unknown) => string);
	duration?: number;
};

/**
 * Application-level notification abstraction.
 * Prevents tight coupling to the third-party toast library
 * and standardizes notification options.
 */
export const notify = {
	success: (message: string, options?: ToastOptions) => {
		return gooeyToast.success(message, { ...options, showTimestamp: false });
	},
	error: (message: string, options?: ToastOptions) => {
		return gooeyToast.error(message, { ...options, showTimestamp: false });
	},
	warning: (message: string, options?: ToastOptions) => {
		return gooeyToast.warning(message, { ...options, showTimestamp: false });
	},
	info: (message: string, options?: ToastOptions) => {
		return gooeyToast.info(message, { ...options, showTimestamp: false });
	},
	promise: <T>(promise: Promise<T>, options: PromiseOptions<T>) => {
		return gooeyToast.promise(promise, options);
	},
	dismiss: (id?: string | number) => {
		gooeyToast.dismiss(id);
	},
};
