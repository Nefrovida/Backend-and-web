import { Response } from "express";

export const success = (
  res: Response,
  data: any,
  message?: string | null,
  status: number = 200
): void => {
  res.status(status).json({
    success: true,
    message: message ?? null,
    data,
  });
};

export const error = (
  res: Response,
  code: string,
  message: string,
  status: number = 400,
  details?: any
): void => {
  const payload: any = {
    success: false,
    error: {
      code,
      message,
    },
  };

  if (details) payload.error.details = details;

  res.status(status).json(payload);
};

export default { success, error };
