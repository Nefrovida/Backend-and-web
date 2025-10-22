import express, { Request, Response } from "express";
const router = express.Router();

// Use this file to append router modules:
router.get("/", (_req: Request, res: Response) => {
  console.log("API hit");
  res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

export default router;
