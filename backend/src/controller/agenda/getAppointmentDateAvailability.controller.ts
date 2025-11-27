import {Request, Response} from "express";
import { getAppointmentByName } from "../../service/appointments.service";
import * as agendaService from '../../service/agenda.service';


/**
 * Get available time slots for a specific doctor on a given date
 */
const getAppointmentDateAvailability = async (req: Request, res: Response) => {
    try {
      const { appointmentName, date } = req.query;

      if (!appointmentName || !date) {
        return res.status(400).json({ error: 'appointmentName and date are required' });
      }

      const appointment = await getAppointmentByName(appointmentName as string);

      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      const doctorId = appointment.doctor_id;  
  
      const availability = await agendaService.getDoctorAvailability(
        doctorId as string,
        date as string
      );
  
      res.json(availability);
    } catch (error) {
      console.error('Error fetching doctor availability:', error);
      res.status(500).json({ error: 'Failed to fetch doctor availability' });
    }
  };

export default getAppointmentDateAvailability;