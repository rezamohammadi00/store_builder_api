// src/controllers/users.controller.ts
import type { Request, Response } from "express";
import * as usersService from "../services/users.service.js";
import { ApiError } from "../utils/api-error.js";

// GET /api/v1/users?page=1&limit=20
export const getAll = async (req: Request, res: Response) => {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 20, 100);

    const { items, total } = await usersService.findAll({ page, limit });

    res.json({
        data: items,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
}

// GET /api/v1/users/:id
export const getById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new ApiError(400, "Invalid user id");

    const user = await usersService.findById(id);
    if (!user) throw new ApiError(404, "User not found");

    res.json({ data: user });
}

// POST /api/v1/users
export const create = async (req: Request, res: Response) => {
    // req.body already validated by the validate(createUserSchema) middleware
    const existing = await usersService.findByEmail(req.body.email);
    if (existing) throw new ApiError(409, "Email already in use");

    const user = await usersService.create(req.body);

    res.status(201).json({ data: user });
}

// PATCH /api/v1/users/:id
export const update = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new ApiError(400, "Invalid user id");

    const user = await usersService.update(id, req.body);
    if (!user) throw new ApiError(404, "User not found");

    res.json({ data: user });
}

// DELETE /api/v1/users/:id
export const remove = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new ApiError(400, "Invalid user id");

    const deleted = await usersService.remove(id);
    if (!deleted) throw new ApiError(404, "User not found");

    res.status(204).send();
}
