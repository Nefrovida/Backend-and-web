import { Request, Response } from "express";
import {
  AdminRegistrationService,
  desactivateUser,
  getActiveUsersService,
} from "../service/admin.registration.service";
import { AdminSchema } from "../validators/admin.validator";
import z, { ZodError } from "zod";
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

    if (adminPayload && typeof adminPayload === "object") {
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

export const desactivateUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const sessionId = req.user?.userId;
    if (!sessionId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(req.params);

    await desactivateUser(id, sessionId);

    res.status(200).json({ message: "Usuario desactivado" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getActiveUsers = async (req: Request, res: Response) => {
  try {
    const users = await getActiveUsersService();
    res.status(200).json({ users });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
