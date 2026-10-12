import type { Request, Response } from "express";
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
	res.json({ message: "Hello from Express + TypeScript" });
});

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
