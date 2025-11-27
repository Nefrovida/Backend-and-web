import express from "express";
const router = express.Router();

import getAnalysisPerDayByAnalysisId from "../controller/analysis/getAnalysisPerDayByAnalysisId.controller";
import createAnalysisAppointment from "../controller/analysis/createAnalysisAppointment.controller";
import { downloadReport } from "../controller/analysis/downloadReport.controller";
import { authenticate } from "src/middleware/auth.middleware";
import { requirePrivileges } from "src/middleware/rbac.middleware";
import { Privilege } from "../types/rbac.types";

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

export default router;