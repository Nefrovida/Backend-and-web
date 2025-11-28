import express from "express";
import * as analysisController from "../controller/analysis/add_analysis.controller";
import getAnalysisPerDayByAnalysisId from "../controller/analysis/getAnalysisPerDayByAnalysisId.controller";
import createAnalysisAppointment from "../controller/analysis/createAnalysisAppointment.controller";
import { downloadReport } from "../controller/analysis/downloadReport.controller";
import { authenticate } from "src/middleware/auth.middleware";
import { requirePrivileges } from "src/middleware/rbac.middleware";
import { Privilege } from "../types/rbac.types";
const router = express.Router();

router.get(
    "/analysis-per-day/by-analysis",
    authenticate,
    requirePrivileges([Privilege.VIEW_ANALYSIS]),
    getAnalysisPerDayByAnalysisId
);

router.get(
    "/download-report",
    authenticate,
    requirePrivileges([Privilege.VIEW_ANALYSIS]),
    downloadReport
);

router.post(
    "/analysis-appointment",
    authenticate,
    requirePrivileges([Privilege.CREATE_APPOINTMENTS]),
    createAnalysisAppointment
);

router.get(
    "/",
    authenticate,
    requirePrivileges([Privilege.VIEW_ANALYSIS]),
    analysisController.getAllAnalysis
);

router.get(
    "/:id",
    authenticate,
    requirePrivileges([Privilege.VIEW_ANALYSIS]),
    analysisController.getAnalysisById
);

router.post(
    "/",
    authenticate,
    requirePrivileges([Privilege.MANAGE_ANALYSIS_TYPES]),
    analysisController.createAnalysis
);

router.put(
    "/:id",
    authenticate,
    requirePrivileges([Privilege.MANAGE_ANALYSIS_TYPES]),
    analysisController.updateAnalysis
);

router.delete(
    "/:id",
    authenticate,
    requirePrivileges([Privilege.MANAGE_ANALYSIS_TYPES]),
    analysisController.deleteAnalysis
);

export default router;