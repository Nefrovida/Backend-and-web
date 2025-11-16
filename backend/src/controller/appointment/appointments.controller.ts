import { Request, Response } from 'express';
import * as appointmentsService from '../../service/appointments.service';

/**
 * Get all appointments for the authenticated doctor
 * @param req - Express request with authenticated user
 * @param res - Express response
 */
export const getDoctorAppointments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const doctorId = req.user!.userId;

    const appointments = await appointmentsService.getDoctorAppointments(
      doctorId
    );

    res.status(200).json(appointments);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};


export const getUserAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const appointments = await appointmentsService.getAllAppointmentsByUserId(id);
    res.status(200).json(appointments);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
