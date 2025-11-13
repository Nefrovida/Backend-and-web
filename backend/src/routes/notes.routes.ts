import express from "express"
import postNote from "src/controller/notes/postNote.controller";
const router = express.Router()

router.post("/", postNote)

export default router;