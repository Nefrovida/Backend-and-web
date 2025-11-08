import express, { type Request, type Response } from "express";
const router = express.Router();

import labRoutes from "./lab.routes.ts";

// Use this file to append router modules:
router.get("/", (_req: Request, res: Response) => {
  console.log("API hit");
  res.json({ message: "Welcome to the Express + TypeScript Server!" });
});
router.use("/laboratory", labRoutes);

export default router;
