import express from "express"
const router = express.Router()

import getLabResults from "../controller/lab/getLabResults.controller";
import getAnalysis from "src/controller/lab/getAnalysis.controller";
import { authenticate } from "src/middleware/auth.middleware";
import { requirePrivileges } from "src/middleware/rbac.middleware";
import { Privilege } from "src/types/rbac.types";

router.get("/results", 
  // authenticate,
  // requirePrivileges([Privilege.VIEW_ANALYSIS]),
  getLabResults);
router.get("/analysis", getAnalysis)

export default router;