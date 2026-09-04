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
	title: z.string().max(100, { message: "Title must be 100 characters or less" }).optional(),
	description: z
		.string()
		.max(500, { message: "Description must be 500 characters or less" })
		.optional(),
});

export type ItemFormValues = z.infer<typeof itemSchema>;
