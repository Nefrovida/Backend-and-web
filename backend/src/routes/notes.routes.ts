import express from "express";
import postNote from "../controller/notes/postNote.controller";
import getNotes from "../controller/notes/getPatientNotes.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requirePrivileges } from "../middleware/rbac.middleware";

const router = express.Router();

router.post("/", authenticate, requirePrivileges(["CREATE_NOTES"]), postNote);
router.get("/", authenticate, requirePrivileges(["VIEW_NOTES"]), getNotes);

export default router;