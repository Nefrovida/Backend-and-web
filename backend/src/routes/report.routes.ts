import express, { Request, Response } from "express";
const router = express.Router()

import getResult from "../controller/analysis/report_controller"; 
import { authenticate } from "../middleware/auth.middleware";
import { requirePrivileges } from "../middleware/rbac.middleware";
import { Privilege } from "../types/rbac.types";

router.get(
    "/get-result/:patient_analysis_id", 
   // authenticate, 
    //requirePrivileges([Privilege.VIEW_ANALYSIS]), 
    getResult
);

export default router;