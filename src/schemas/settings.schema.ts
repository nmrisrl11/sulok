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

export const appearanceSettingsSchema = z
	.object({
		accentColor: z.string().optional(),
		cornerStyle: z.enum(["squircle", "standard", "custom"]).optional(),
		customCornerRadius: z.number().optional(),
		layoutDensity: z.enum(["compact", "cozy", "custom"]).optional(),
		customLayoutDensity: z.number().optional(),
		folderColorMode: z.enum(["preset", "complement", "custom"]).optional(),
		folderColorBack: z.string().optional(),
		folderColorFront: z.string().optional(),
		folderColorPaper: z.string().optional(),
	})
	.strip();

export const soundSettingsSchema = z
	.object({
		enabled: z.boolean().optional(),
		volume: z.number().optional(),
		mappings: z
			.object({
				hover: z.string().optional(),
				press: z.string().optional(),
				toggle: z.string().optional(),
				success: z.string().optional(),
				error: z.string().optional(),
			})
			.optional(),
	})
	.strip();

export const suloSettingsSchema = z
	.object({
		expression404: z.string().optional(),
		expressionEmptyState: z.string().optional(),
		expressionNavbar: z.string().optional(),
		expressionQuickAction: z.string().optional(),
		expressionPreviewUnavailable: z.string().optional(),
		expressionError: z.string().optional(),
		expressionInstallPage: z.string().optional(),
		whispers: z
			.object({
				positive: z.array(z.string()).optional(),
				negative: z.array(z.string()).optional(),
				warning: z.array(z.string()).optional(),
				info: z.array(z.string()).optional(),
			})
			.optional(),
	})
	.strip();

export const privacySettingsSchema = z
	.object({
		enableReferralTracking: z.boolean().optional(),
	})
	.strip();

export const workspaceThemeSchema = z.enum([
	"dark",
	"light",
	"system",
	"sepia",
	"sand",
	"midnight",
	"mocha",
]);

export const backupReminderFrequencySchema = z.union([z.number(), z.literal("off")]);
