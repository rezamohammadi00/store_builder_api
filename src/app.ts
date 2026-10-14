import cors from "cors";
import express from "express";
import { errorHandler } from "./middleware/error-handler.js";
// import helmet from "helmet";
import { router } from "./routes/index.js";
// import { ApiError } from "./utils/api-error";

export const app = express();

// app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json());

app.use("/api/v1", router);

// 404
// app.use((_req, _res, next) => next(new ApiError(404, "Route not found")));

app.use(errorHandler);
