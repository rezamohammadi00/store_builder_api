// src/middleware/error-handler.ts
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/api-error.js";

const isProd = process.env.NODE_ENV === "production";

type ErrorBody = {
	error: {
		message: string;
		code?: string;
		details?: unknown;
		stack?: string;
	};
};

// Drizzle (0.44+) wraps driver errors and puts the original pg error in `cause`
const getPgError = (
	err: unknown,
): { code?: string; constraint?: string } | null => {
	let current: any = err;
	for (let i = 0; i < 3 && current; i++) {
		if (
			typeof current.code === "string" &&
			/^[0-9A-Z]{5}$/.test(current.code)
		) {
			return current;
		}
		current = current.cause;
	}
	return null;
};

// Map known Postgres error codes to API errors
const fromPgError = (pg: {
	code?: string;
	constraint?: string;
}): ApiError | null => {
	switch (pg.code) {
		case "23505": // unique_violation
			return ApiError.conflict("Resource already exists");
		case "23503": // foreign_key_violation
			return ApiError.badRequest("Referenced resource does not exist");
		case "23502": // not_null_violation
			return ApiError.badRequest("A required field is missing");
		case "22P02": // invalid_text_representation (e.g. bad uuid)
			return ApiError.badRequest("Invalid input format");
		default:
			return null;
	}
};

export const errorHandler = (
	err: unknown,
	req: Request,
	res: Response<ErrorBody>,
	next: NextFunction,
) => {
	// If headers are already sent, let Express close the connection
	if (res.headersSent) return next(err);

	let apiError: ApiError | null = null;

	if (err instanceof ApiError) {
		apiError = err;
	} else if (err instanceof ZodError) {
		apiError = ApiError.badRequest(
			"Validation failed",
			err.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
		);
	} else if ((err as any)?.type === "entity.parse.failed") {
		apiError = ApiError.badRequest("Invalid JSON body");
	} else if ((err as any)?.type === "entity.too.large") {
		apiError = new ApiError(413, "Request body too large");
	} else {
		const pg = getPgError(err);
		if (pg) apiError = fromPgError(pg);
	}

	// Expected errors: send as-is
	if (apiError) {
		// Only log server-side problems, not every 4xx
		if (apiError.statusCode >= 500) console.error(err);

		return res.status(apiError.statusCode).json({
			error: {
				message: apiError.message,
				...(apiError.details ? { details: apiError.details } : {}),
			},
		});
	}

	// Unexpected error: log everything, reveal nothing
	console.error(`[${req.method}] ${req.originalUrl}`, err);

	return res.status(500).json({
		error: {
			message: "Internal server error",
			...(!isProd && err instanceof Error ? { stack: err.stack } : {}),
		},
	});
};
