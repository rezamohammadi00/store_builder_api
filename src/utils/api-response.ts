// src/utils/api-response.ts
import type { Response } from "express";

export type PaginationMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
};

export type PaginatedBody<T> = {
    data: T[];
    meta: PaginationMeta;
};

// Builds the object only (useful for tests or custom responses)
export const buildPaginated = <T>(
    items: T[],
    { page, limit, total }: { page: number; limit: number; total: number }
): PaginatedBody<T> => {
    const totalPages = Math.max(Math.ceil(total / limit), 1);

    return {
        data: items,
        meta: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        },
    };
};

// Sends a paginated list: { data: [...], meta: {...} }
export const sendPaginated = <T>(
    res: Response,
    items: T[],
    pagination: { page: number; limit: number; total: number },
    status = 200
) => res.status(status).json(buildPaginated(items, pagination));

// Sends a single resource: { data: {...} }
export const sendSuccess = <T>(res: Response, data: T, status = 200) =>
    res.status(status).json({ data });

// 201 Created: { data: {...} }
export const sendCreated = <T>(res: Response, data: T) =>
    sendSuccess(res, data, 201);

// 204 No Content (DELETE)
export const sendNoContent = (res: Response) => res.status(204).send();