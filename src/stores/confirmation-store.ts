import { create } from "zustand";

export interface ConfirmationOptions {
	title?: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void | Promise<void>;
}

interface ConfirmationState {
	isOpen: boolean;
	options: ConfirmationOptions | null;
	isConfirming: boolean;

	// Actions
	confirm: (options: ConfirmationOptions) => void;
	close: () => void;
	setConfirming: (isConfirming: boolean) => void;
}

export const useConfirmationStore = create<ConfirmationState>((set) => ({
	isOpen: false,
	options: null,
	isConfirming: false,

	confirm: (options) => set({ isOpen: true, options, isConfirming: false }),
	close: () => set({ isOpen: false, options: null }),
	setConfirming: (isConfirming) => set({ isConfirming }),
}));
