import { z } from "zod";

export const bookmarkSchema = z.object({
	url: z
		.string()
		.url({ message: "Please enter a valid URL" })
		.refine((val) => val.startsWith("http://") || val.startsWith("https://"), {
			message: "Please enter a valid HTTP/HTTPS URL",
		}),
	title: z.string().max(100, { message: "Title must be 100 characters or less" }).optional(),
	description: z
		.string()
		.max(500, { message: "Description must be 500 characters or less" })
		.optional(),
});

export type BookmarkFormValues = z.infer<typeof bookmarkSchema>;
