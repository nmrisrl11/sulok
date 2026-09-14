import { z } from "zod";

export const folderSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, { message: "Name is required" })
		.max(50, { message: "Name must be 50 characters or less" }),
	parentId: z.string().nullable().optional(),
	deletedAt: z.number().optional(),
	isFavorite: z.boolean().optional(),
});

export type FolderFormData = z.infer<typeof folderSchema>;
