import express, {type Request, type Response } from "express";
const router = express.Router();

import secretaryRoutes from "./secretary.routes.ts"


// Use this file to append router modules:
router.get("/", (_req: Request, res: Response) => {
  console.log("API hit");
  res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

router.use("/secretary-agenda", secretaryRoutes);

export default router;
