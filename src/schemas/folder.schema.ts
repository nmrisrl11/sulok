import { FOLDER_NAME_MAX_LENGTH, FOLDER_NAME_MIN_LENGTH } from "@/constants/validation-constants";
import { z } from "zod";

export const folderSchema = z.object({
	name: z
		.string()
		.trim()
		.min(FOLDER_NAME_MIN_LENGTH, { message: "Name is required" })
		.max(FOLDER_NAME_MAX_LENGTH, {
			message: `Name must be ${FOLDER_NAME_MAX_LENGTH} characters or less`,
		}),
	parentId: z.string().nullable().optional(),
	deletedAt: z.number().optional(),
	isFavorite: z.boolean().optional(),
});

export type FolderFormData = z.infer<typeof folderSchema>;
