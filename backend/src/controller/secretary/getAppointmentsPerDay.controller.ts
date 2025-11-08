import {Request, Response} from "express";
import Secretary from "../../model/secretary.model";

function getAppointmentsPerDay(req: Request, res: Response) {
    const appointmentsPerDay = Secretary.getAppointmentsPerDay();

    console.log(appointmentsPerDay);

    res.json(appointmentsPerDay);
}

export default getAppointmentsPerDay;