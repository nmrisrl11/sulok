import {
	ITEM_DESCRIPTION_MAX_LENGTH,
	ITEM_NOTE_MAX_LENGTH,
	ITEM_TITLE_MAX_LENGTH,
} from "@/constants/validation-constants";
import { z } from "zod";
import { formatUrl } from "../lib/utils";

export const itemSchema = z.object({
	url: z
		.string()
		.transform((val) => formatUrl(val))
		.pipe(
			z
				.string()
				.url({ message: "Please enter a valid URL" })
				.refine(
					(val) =>
						val.toLowerCase().startsWith("http://") || val.toLowerCase().startsWith("https://"),
					{
						message: "Please enter a valid HTTP/HTTPS URL",
					},
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
					{ message: "Please enter a valid website domain" },
				),
		),
	title: z
		.string()
		.max(ITEM_TITLE_MAX_LENGTH, {
			message: `Title must be ${ITEM_TITLE_MAX_LENGTH} characters or less`,
		})
		.optional(),
	description: z
		.string()
		.max(ITEM_DESCRIPTION_MAX_LENGTH, {
			message: `Description must be ${ITEM_DESCRIPTION_MAX_LENGTH} characters or less`,
		})
		.optional(),
	image: z.string().optional(),
	logo: z.string().optional(),
	folderId: z.string().optional(),
	deletedAt: z.number().optional(),
	isFavorite: z.boolean().optional(),
	note: z
		.string()
		.trim()
		.max(ITEM_NOTE_MAX_LENGTH, {
			message: `Note must be ${ITEM_NOTE_MAX_LENGTH} characters or less`,
		})
		.optional(),
});

export type ItemFormValues = z.infer<typeof itemSchema>;
