import { formatUrl } from "@/lib/utils";
import { z } from "zod";

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
	title: z.string().optional(),
	description: z.string().optional(),
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

export const importFileSchema = z.array(importItemSchema);

export type ImportItem = z.infer<typeof importItemSchema>;
