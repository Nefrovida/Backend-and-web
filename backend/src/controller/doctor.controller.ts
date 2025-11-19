import { Request, Response } from "express";
import { DoctorRegistrationService } from "../service/doctor.registration.service";
import { IAccount } from "../model/account.model";
import { DoctorSchema } from "../validators/doctor.validator";

export const createDoctor = async (req: Request, res: Response) => {
  try {
    // Logged admin account (must have role_id = 1)
    const adminAccount = req.body.loggedUser as IAccount;

    // Validate doctor input using Zod schema
    const doctorData = DoctorSchema.parse(req.body.doctor);

    // Call service to register doctor
    const result = await DoctorRegistrationService.registerDoctor(adminAccount, doctorData);

    res.status(201).json({
      message: "Doctor successfully registered",
      result,
    });
  } catch (error: any) {
    const status = error?.statusCode ?? 500;
    res.status(status).json({
      message: error?.message ?? "Internal server error",
    });
  }
};