import express from "express"
const router = express.Router()

import getLabResults from "../controller/lab/getLabResults.controller";
import getAnalysis from "src/controller/lab/getAnalysis.controller";
import { authenticate } from "src/middleware/auth.middleware";
import { requirePrivileges } from "src/middleware/rbac.middleware";
import { Privilege } from "src/types/rbac.types";

import getAnalysisByDay from "../controller/lab/laboratoristGetAnalysis.controller";
import generateLabReport from "../controller/lab/generateReport.controller";

router.get("/results", 
  //authenticate,
  //requirePrivileges([Privilege.VIEW_ANALYSIS]),
  getLabResults);

router.get("/analysis", getAnalysis)

// Date format: dd-mm-yyyy
router.get("/analysis/by-date/:date", 
  authenticate,
  requirePrivileges([Privilege.VIEW_ANALYSIS]),
  getAnalysisByDay);


router.post("/generate-report", 
  // authenticate,
  // requirePrivileges([Privilege.CREATE_REPORT]),
  generateLabReport
)

export default router;