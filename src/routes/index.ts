// src/routes/index.ts
import { Router } from "express";
import { usersRoutes } from "./users.routes.js";

export const router = Router();

// Health check: GET /api/v1/health
router.get("/health", (_req, res) => {
	res.json({ status: "ok", uptime: process.uptime() });
});

// Resource routers
router.use("/users", usersRoutes); // /api/v1/users
//router.use("/posts", postsRoutes);   // /api/v1/posts
