import { Request, Response } from "express";
import { AdminRegistrationService } from "../service/admin.registration.service";
import { AdminSchema } from "../validators/admin.validator";
import { ZodError } from "zod";
import { JwtPayload } from "../types/auth.types";

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const adminAccount = req.user as JwtPayload;

    if (!adminAccount) {
      return res.status(401).json({
        message: "Unauthorized: No authenticated user found",
      });
    }

    let adminPayload = req.body.admin || req.body;

    if (adminPayload && typeof adminPayload === 'object') {
      const { loggedUser, ...cleanPayload } = adminPayload;
      adminPayload = cleanPayload;
    }

    const adminData = await AdminSchema.parseAsync(adminPayload);

    const result = await AdminRegistrationService.registerAdmin(
      { role_id: adminAccount.roleId },
      adminData
    );

    res.status(201).json({
      message: "Admin successfully registered",
      result,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      const formattedErrors: Record<string, string> = {};
      error.errors.forEach((e) => {
        const field = e.path?.[0] ?? "_root";
        formattedErrors[String(field)] = e.message;
      });
      return res.status(400).json({ errors: formattedErrors });
    }

    const status = error?.statusCode ?? 500;
    res.status(status).json({
      message: error?.message ?? "Internal server error",
    });
  }
};
