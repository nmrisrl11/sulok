import { FolderRepository } from "@/db/repositories/folder-repository";
import { ItemRepository } from "@/db/repositories/item-repository";
import { useTimeStore } from "@/stores";
import { useEffect } from "react";

export function TrashManager() {
	const triggerRefresh = useTimeStore((state) => state.triggerRefresh);

	useEffect(() => {
		// Run initial cleanup on mount
		void ItemRepository.emptyExpiredTrash();
		void FolderRepository.emptyExpiredTrash();

		const scheduleNextMidnight = () => {
			const now = new Date();
			const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
			const msUntilMidnight = tomorrow.getTime() - now.getTime();

			return setTimeout(() => {
				// Trigger the store to update "today", forcing components to re-render
				triggerRefresh();

				// Also trigger cleanup at midnight
				void ItemRepository.emptyExpiredTrash();
				void FolderRepository.emptyExpiredTrash();

				// Re-schedule for the next midnight
				timeoutId = scheduleNextMidnight();
			}, msUntilMidnight);
		};

		let timeoutId = scheduleNextMidnight();

		return () => clearTimeout(timeoutId);
	}, [triggerRefresh]);

	return null;
}
