import express, { Request, Response } from "express";
const router = express.Router()

import * as CHC from "../controller/clinicalHistory/clinicalHistory.controller"; 
import { authenticate } from "../middleware/auth.middleware";
import { requirePrivileges } from "../middleware/rbac.middleware";
import { Privilege } from "../types/rbac.types";

router.get("/risk-questions",
    authenticate,
    CHC.getRiskQuestions
);

router.get("/risk-options",
    authenticate,
    CHC.getRiskOptions
)

router.post("/risk-form/submit/:id",
    authenticate,
    CHC.submitRiskForm);
export default router;