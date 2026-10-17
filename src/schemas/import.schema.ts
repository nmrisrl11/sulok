import { ITEM_NOTE_MAX_LENGTH } from "@/constants/validation-constants";
import { formatUrl } from "@/lib/utils";
import { z } from "zod";
import { folderSchema } from "./folder.schema";

const nullToUndefined = (val: unknown) => (val === null ? undefined : val);

export const importItemSchema = z.object({
	id: z.string().optional(),
	url: z
		.string()
		.transform((val) => formatUrl(val))
		.pipe(
			z
				.string()
				.url({ message: "Invalid URL" })
				.refine(
					(val) =>
						val.toLowerCase().startsWith("http://") || val.toLowerCase().startsWith("https://"),
					{ message: "Invalid HTTP/HTTPS URL" },
				)
				.refine(
					(val) => {
						try {
							const url = new URL(val);
							return url.hostname.includes(".") || url.hostname === "localhost";
						} catch {
							return false;
						}
					},
					{ message: "Invalid domain" },
				),
		),
	title: z.preprocess(nullToUndefined, z.string().optional()),
	description: z.preprocess(nullToUndefined, z.string().optional()),
	image: z.preprocess(nullToUndefined, z.string().optional()),
	logo: z.preprocess(nullToUndefined, z.string().optional()),
	folderId: z.preprocess(nullToUndefined, z.string().optional()),
	isFavorite: z.preprocess(nullToUndefined, z.boolean().optional()),
	note: z.preprocess(nullToUndefined, z.string().max(ITEM_NOTE_MAX_LENGTH).optional()),
	createdAt: z
		.union([z.number(), z.string()])
		.optional()
		.transform((val) => {
			if (typeof val === "string") {
				const time = new Date(val).getTime();
				return isNaN(time) ? undefined : time;
			}
			return val;
		}),
	updatedAt: z
		.union([z.number(), z.string()])
		.optional()
		.transform((val) => {
			if (typeof val === "string") {
				const time = new Date(val).getTime();
				return isNaN(time) ? undefined : time;
			}
			return val;
		}),
});

export const importFolderSchema = z.object({
	id: z.string().optional(),
	name: folderSchema.shape.name,
	parentId: z.string().optional().nullable(),
	order: z.preprocess(nullToUndefined, z.number().optional()),
	isFavorite: z.preprocess(nullToUndefined, z.boolean().optional()),
	createdAt: z
		.union([z.number(), z.string()])
		.optional()
		.transform((val) => {
			if (typeof val === "string") {
				const time = new Date(val).getTime();
				return isNaN(time) ? undefined : time;
			}
			return val;
		}),
	updatedAt: z
		.union([z.number(), z.string()])
		.optional()
		.transform((val) => {
			if (typeof val === "string") {
				const time = new Date(val).getTime();
				return isNaN(time) ? undefined : time;
			}
			return val;
		}),
});

export type ImportItem = z.infer<typeof importItemSchema>;
export type ImportFolder = z.infer<typeof importFolderSchema>;
