import express, { Request, Response } from "express";
const router = express.Router();

import getAnalysisByDay from "../controller/analysis/laboratoristGetAnalysis.controller";

// Date format: dd-mm-yyyy
router.get("/analysis/by-date/:date", getAnalysisByDay);

export default router;
