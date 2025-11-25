import { Request, Response } from "express";
import { DoctorRegistrationService } from "../service/doctor.registration.service";
import { DoctorSchema } from "../validators/doctor.validator";
import { ZodError } from "zod";
import { JwtPayload } from "../types/auth.types";

export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const { prisma } = await import("../util/prisma");
    
    const doctors = await prisma.doctors.findMany({
      include: {
        user: {
          select: {
            user_id: true,
            name: true,
            parent_last_name: true,
            maternal_last_name: true,
            phone_number: true,
            username: true,
            birthday: true,
            gender: true,
            registration_date: true,
            active: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Doctors retrieved successfully",
      data: doctors,
    });
  } catch (error: any) {
    const status = error?.statusCode ?? 500;
    res.status(status).json({
      message: error?.message ?? "Internal server error",
    });
  }
};

export const createDoctor = async (req: Request, res: Response) => {
  try {
    // Get authenticated user from middleware (not from body)
    const adminAccount = req.user as JwtPayload;

    if (!adminAccount) {
      return res.status(401).json({
        message: "Unauthorized: No authenticated user found",
      });
    }

    // Handle both formats: { doctor: {...} } and direct {...}
    let doctorPayload = req.body.doctor || req.body;

    // Remove loggedUser from payload if it exists (legacy support)
    if (doctorPayload && typeof doctorPayload === 'object') {
      const { loggedUser, ...cleanPayload } = doctorPayload;
      doctorPayload = cleanPayload;
    }

    // Validate doctor input using Zod schema (using parseAsync for async validations)
    const doctorData = await DoctorSchema.parseAsync(doctorPayload);

    // Call service to register doctor
    const result = await DoctorRegistrationService.registerDoctor(
      { role_id: adminAccount.roleId }, 
      doctorData
    );

    res.status(201).json({
      message: "Doctor successfully registered",
      result,
    });
  } catch (error: any) {
    // ZOD VALIDATION ERROR
    if (error instanceof ZodError) {
      const formattedErrors: Record<string, string> = {};

      error.errors.forEach((e) => {
        const field = e.path?.[0] ?? "_root";
        formattedErrors[String(field)] = e.message;
      });

      return res.status(400).json({
        errors: formattedErrors,
      });
    }

    const status = error?.statusCode ?? 500;
    res.status(status).json({
      message: error?.message ?? "Internal server error",
    });
  }
};