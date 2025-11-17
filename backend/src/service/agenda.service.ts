import { Request, Response } from "express";
import Agenda from "src/model/agenda.model";

export const getAppointmentsInRange = (req: Request, res: Response) => {
    const start = req.query.start as string;
  const end = req.query.end as string;

  return Agenda.getAppointmentsInRange(start, end);
};