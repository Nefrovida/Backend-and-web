import express, { Request, Response } from "express";
import forumsRoutes from "./forums.routes";

const router = express.Router();

// Health check / welcome endpoint
router.get("/", (_req: Request, res: Response) => {
  console.log("API hit");
  res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

// Forums routes
router.use("/forums", forumsRoutes);

export default router;
