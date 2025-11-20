import express, { Request, Response } from "express";
const router = express.Router()

import * as CHC from "../controller/clinicalHistory/clinicalHistory.controller"; 
import { authenticate } from "../middleware/auth.middleware";
import { requirePrivileges, requireAnyPrivilege } from "../middleware/rbac.middleware";
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
    requireAnyPrivilege([Privilege.CREATE_CLINICAL_HISTORY, Privilege.UPDATE_CLINICAL_HISTORY]),
    CHC.submitRiskForm);

router.get("/risk-form/get/:id",
    authenticate,
    requirePrivileges([Privilege.VIEW_CLINICAL_HISTORY]),
    CHC.getRiskFormAnswersById);

export default router;