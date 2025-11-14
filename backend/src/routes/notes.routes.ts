import express from "express"
import postNote from "src/controller/notes/postNote.controller";
import getNotes from "src/controller/notes/getPatientNotes.controller"
const router = express.Router()

router.get("/", getNotes)
router.post("/", postNote)

export default router;