// src/routes/users.routes.ts
import { Router } from "express";
import * as usersController from "../controllers/users.controller.js";
import { validate } from "../middleware/validate.js";
import { createUserSchema } from "../validators/users.schema.js";

export const usersRoutes = Router();

usersRoutes.get("/", usersController.getAll); // GET    /api/v1/users
usersRoutes.get("/:id", usersController.getById); // GET    /api/v1/users/:id
usersRoutes.post("/", validate(createUserSchema), usersController.create); // POST /api/v1/users
usersRoutes.patch("/:id", usersController.update); // PATCH  /api/v1/users/:id
usersRoutes.delete("/:id", usersController.remove); // DELETE /api/v1/users/:id
