import { Request, Response } from 'express';
import { getAppointmentDetailsById } from '../service/appointments.service';

/**
 * Controller to get detailed appointment information by ID
 */
export const getAppointmentDetailsController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Calls servide to get appointment details
    const appointmentData = await getAppointmentDetailsById(id);

    if (!appointmentData) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    // Send data to frontend
    res.status(200).json(appointmentData);
  } catch (error) {
    const e = error as Error;
    console.error('Error en getAppointmentDetailsController:', e.message);
    res.status(500).json({ message: 'Error al obtener los detalles de la cita', error: e.message });
  }
};