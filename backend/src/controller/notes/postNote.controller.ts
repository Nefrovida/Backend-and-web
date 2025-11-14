import {type Request, type Response} from "express"

function postNote(req: Request, res: Response) {
  const patientId = req.body.patientId;
  const noteInfo = req.body.noteInfo;

  res.status(200).send("Received")
}

export default postNote;