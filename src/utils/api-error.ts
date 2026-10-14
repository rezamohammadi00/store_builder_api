// src/utils/api-error.ts
export class ApiError extends Error {
	public readonly statusCode: number;
	public readonly details?: unknown;
	public readonly isOperational: boolean;

	constructor(
		statusCode: number,
		message: string,
		details?: unknown,
		isOperational = true,
	) {
		super(message);
		this.name = "ApiError";
		this.statusCode = statusCode;
		this.details = details;
		this.isOperational = isOperational; // true = expected error, false = a bug

		Object.setPrototypeOf(this, new.target.prototype);
		Error.captureStackTrace?.(this, this.constructor);
	}

	static badRequest(message = "Bad request", details?: unknown) {
		return new ApiError(400, message, details);
	}

	static unauthorized(message = "Unauthorized") {
		return new ApiError(401, message);
	}

	static forbidden(message = "Forbidden") {
		return new ApiError(403, message);
	}

	static notFound(message = "Not found") {
		return new ApiError(404, message);
	}

	static conflict(message = "Conflict") {
		return new ApiError(409, message);
	}

	static unprocessable(message = "Unprocessable entity", details?: unknown) {
		return new ApiError(422, message, details);
	}

	static tooManyRequests(message = "Too many requests") {
		return new ApiError(429, message);
	}

	static internal(message = "Internal server error") {
		return new ApiError(500, message, undefined, false);
	}
}
