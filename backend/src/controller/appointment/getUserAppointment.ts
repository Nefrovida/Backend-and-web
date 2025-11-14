import { Request, Response } from 'express';
import * as usersService from '../../service/appointment/appointment.service';

export const getUserAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const appointments = await usersService.getAllAppointmentsByUserId(id);
    res.status(200).json(appointments);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};