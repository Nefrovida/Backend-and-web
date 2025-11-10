import express from "express"
const router = express.Router()

import getLabResults from "../controller/lab/getLabResults.controller.ts";
import getPermission from "../util/getPermission.ts";
import getAnalysis from "src/controller/lab/getAnalysis.controller.ts";

router.get("/results", getPermission("labResults"), getLabResults);
router.get("/analysis", getAnalysis)

export default router;