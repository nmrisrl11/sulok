import { useLogoStore, useSettingsStore } from "@/stores";
import { play } from "cuelume";
import { gooeyToast } from "goey-toast";

const playNotifySound = (type: "success" | "error") => {
	const { soundSettings } = useSettingsStore.getState().settings;
	if (soundSettings.enabled) {
		play(soundSettings.mappings[type], { volume: soundSettings.volume });
	}
};

const getWhisper = (type: "positive" | "negative" | "warning" | "info") => {
	const { suloSettings } = useSettingsStore.getState().settings;
	const phrases = suloSettings.whispers[type];
	if (!phrases || phrases.length === 0) return "";
	return phrases[Math.floor(Math.random() * phrases.length)];
};

type ToastOptions = {
	id?: string | number;
	description?: string;
	duration?: number;
	action?: {
		label: string;
		onClick: () => void;
		successLabel?: string;
	};
	hideReaction?: boolean;
};

type PromiseOptions<T> = {
	loading: string;
	success: string | ((data: T) => string);
	error: string | ((error: unknown) => string);
	duration?: number;
};

/**
 * Automatically formats long messages into a 2-liner toast (title + description)
 * if no explicit description is supplied. Short messages remain compact pills.
 */
function resolveToastContent(
	message: string,
	options?: ToastOptions,
): { title: string; options?: ToastOptions } {
	if (options?.description) {
		return { title: message, options };
	}

	const trimmed = message.trim();
	// Short messages stay compact pills
	if (trimmed.length <= 40) {
		return { title: trimmed, options };
	}

	// Sentence boundary split: look for first period, colon, or exclamation mark followed by a space
	const sentenceMatch = trimmed.match(/^([^.!?:]+[.!?:]?)\s+(.+)$/);
	if (sentenceMatch) {
		const firstPart = sentenceMatch[1].trim();
		const secondPart = sentenceMatch[2].trim();

		// If first part is a clean headline (<= 45 characters)
		if (firstPart.length > 0 && firstPart.length <= 45) {
			const cleanTitle = firstPart.replace(/[.:]$/, "");
			return {
				title: cleanTitle,
				options: {
					...options,
					description: secondPart,
				},
			};
		}
	}

	// Long message without clear sentence boundary: split at last space before cutoff (~35 chars)
	const cutoff = 35;
	const spaceIndex = trimmed.lastIndexOf(" ", cutoff);
	const splitIdx = spaceIndex > 15 ? spaceIndex : cutoff;
	const title = trimmed.slice(0, splitIdx).trim();
	const description = trimmed.slice(splitIdx).trim();

	return {
		title,
		options: {
			...options,
			description,
		},
	};
}

/**
 * Application-level notification abstraction.
 * Prevents tight coupling to the third-party toast library
 * and standardizes notification options.
 */
export const notify = {
	success: (message: string, options?: ToastOptions) => {
		const { title, options: resolvedOptions } = resolveToastContent(message, options);
		if (!resolvedOptions?.hideReaction) {
			useLogoStore.getState().setReaction("happy", getWhisper("positive"));
		}
		playNotifySound("success");
		return gooeyToast.success(title, { ...resolvedOptions, showTimestamp: false });
	},
	error: (message: string, options?: ToastOptions) => {
		const { title, options: resolvedOptions } = resolveToastContent(message, options);
		if (!resolvedOptions?.hideReaction) {
			useLogoStore.getState().setReaction("sad", getWhisper("negative"));
		}
		playNotifySound("error");
		return gooeyToast.error(title, { ...resolvedOptions, showTimestamp: false });
	},
	warning: (message: string, options?: ToastOptions) => {
		const { title, options: resolvedOptions } = resolveToastContent(message, options);
		if (!resolvedOptions?.hideReaction) {
			useLogoStore.getState().setReaction("surprised", getWhisper("warning"));
		}
		playNotifySound("error"); // Fallback to error for warning
		return gooeyToast.warning(title, { ...resolvedOptions, showTimestamp: false });
	},
	info: (message: string, options?: ToastOptions) => {
		const { title, options: resolvedOptions } = resolveToastContent(message, options);
		if (!resolvedOptions?.hideReaction) {
			useLogoStore.getState().setReaction("curious", getWhisper("info"));
		}
		return gooeyToast.info(title, { ...resolvedOptions, showTimestamp: false });
	},
	promise: <T>(promise: Promise<T>, options: PromiseOptions<T>) => {
		return gooeyToast.promise(promise, options);
	},
	dismiss: (id?: string | number) => {
		gooeyToast.dismiss(id);
	},
};
