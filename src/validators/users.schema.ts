// src/validators/users.schema.ts
import { z } from "zod";

export const createUserSchema = z.object({
	name: z.string().trim().min(2).max(100),
	email: z.string().trim().toLowerCase().email().max(255),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.max(72, "Password is too long"), // bcrypt ignores bytes after 72
});

// PATCH: every field optional, but at least one must be present
export const updateUserSchema = createUserSchema
	.partial()
	.refine((data) => Object.keys(data).length > 0, {
		message: "Provide at least one field to update",
	});

export const idParamSchema = z.object({
	id: z.coerce.number().int().positive(),
});

export const listUsersQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(20),
	search: z.string().trim().max(100).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
