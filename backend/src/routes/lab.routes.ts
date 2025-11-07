import express from "express"
const router = express.Router()

import getLabResults from "../controller/lab/getLabResults.controller";
import getPermission from "../util/getPermission";

router.get("/resultados", getPermission("labResults"), getLabResults);

export default router;