import { z } from "zod";

export const whispersSchema = z.object({
	positive: z
		.array(
			z.object({
				value: z.string().trim().min(1, "Cannot be empty").max(30, "Max 30 characters"),
			}),
		)
		.min(1, "Must have at least 1 phrase")
		.max(10, "Max 10 phrases"),
	negative: z
		.array(
			z.object({
				value: z.string().trim().min(1, "Cannot be empty").max(30, "Max 30 characters"),
			}),
		)
		.min(1, "Must have at least 1 phrase")
		.max(10, "Max 10 phrases"),
	warning: z
		.array(
			z.object({
				value: z.string().trim().min(1, "Cannot be empty").max(30, "Max 30 characters"),
			}),
		)
		.min(1, "Must have at least 1 phrase")
		.max(10, "Max 10 phrases"),
	info: z
		.array(
			z.object({
				value: z.string().trim().min(1, "Cannot be empty").max(30, "Max 30 characters"),
			}),
		)
		.min(1, "Must have at least 1 phrase")
		.max(10, "Max 10 phrases"),
});

export type WhispersFormValues = z.infer<typeof whispersSchema>;
