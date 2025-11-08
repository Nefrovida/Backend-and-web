import express from "express"
const router = express.Router()

import getLabResults from "../controller/lab/getLabResults.controller.ts";
import getPermission from "../util/getPermission.ts";

router.get("/results", getPermission("labResults"), getLabResults);

export default router;