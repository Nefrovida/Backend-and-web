import express, { Request, Response } from "express";
const router = express.Router()

import getResult from "../controller/analysis/report_controller"; 

router.get("/get-result/:patient_analysis_id", getResult);

export default router;