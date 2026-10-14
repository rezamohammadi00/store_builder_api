// src/middleware/validate.ts
import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";
import { ApiError } from "../utils/api-error.js";

type Source = "body" | "query" | "params";

export const validate =
	(schema: ZodTypeAny, source: Source = "body") =>
	(req: Request, _res: Response, next: NextFunction) => {
		const result = schema.safeParse(req[source]);

		if (!result.success) {
			const details = result.error.issues.map((issue) => ({
				field: issue.path.join("."),
				message: issue.message,
			}));
			return next(new ApiError(400, "Validation failed", details));
		}

		// Replace with the parsed value (strips unknown keys, applies coercion/defaults).
		// defineProperty is used because req.query is read-only in Express 5.
		Object.defineProperty(req, source, {
			value: result.data,
			writable: true,
			configurable: true,
			enumerable: true,
		});

		next();
	};
