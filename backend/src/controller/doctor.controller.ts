import { Request, Response } from "express";
import { registerDoctor } from "../service/doctor.registration.service";
import { IAccount } from "../model/account.model";

export const createDoctor = async (req: Request, res: Response) => {
  try {
    const adminAccount = req.body.loggedUser as IAccount;
    const doctorData = req.body.doctor;

    const result = await registerDoctor(adminAccount, doctorData);
    res.status(201).json({ message: "Doctor registrado correctamente", result });
  } catch (error: any) {
    const status = error?.statusCode ?? 500;
    res.status(status).json({ message: error?.message ?? "Error interno del servidor" });
  }
};