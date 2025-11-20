import { Request, Response } from 'express';
import * as agendaService from '../../service/agenda.service';

/**
 * Get all pending appointment requests (patient_appointments waiting to be scheduled)
 */
export const getPendingAppointmentRequests = async (req: Request, res: Response) => {
  try {
    const requests = await agendaService.getPendingAppointmentRequests();
    res.json(requests);
  } catch (error) {
    console.error('Error fetching pending appointment requests:', error);
    res.status(500).json({ error: 'Failed to fetch pending appointment requests' });
  }
};

/**
 * Get all doctors for selection
 */
export const getDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await agendaService.getDoctors();
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};

/**
 * Get available time slots for a specific doctor on a given date
 */
export const getDoctorAvailability = async (req: Request, res: Response) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({ error: 'doctorId and date are required' });
    }

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

/**
 * Schedule an appointment (update patient_appointment with doctor, date, time)
 */
export const scheduleAppointment = async (req: Request, res: Response) => {
  try {
    const { patientAppointmentId, doctorId, dateHour, duration, appointmentType, place } = req.body;

    if (!patientAppointmentId || !doctorId || !dateHour) {
      return res.status(400).json({ 
        error: 'patientAppointmentId, doctorId, and dateHour are required' 
      });
    }

    const scheduledAppointment = await agendaService.scheduleAppointment({
      patientAppointmentId,
      doctorId,
      dateHour,
      duration: duration || 45,
      appointmentType: appointmentType || 'PRESENCIAL',
      place: place || 'Consultorio'
    });

    res.json(scheduledAppointment);
  } catch (error) {
    console.error('Error scheduling appointment:', error);
    res.status(500).json({ error: 'Failed to schedule appointment' });
  }
};

/**
 * Create a new appointment directly (without a prior request)
 */
export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { patientId, doctorId, dateHour, duration, appointmentType, place } = req.body;

    if (!patientId || !doctorId || !dateHour) {
      return res.status(400).json({ 
        error: 'patientId, doctorId, and dateHour are required' 
      });
    }

    const newAppointment = await agendaService.createAppointment({
      patientId,
      doctorId,
      dateHour,
      duration: duration || 45,
      appointmentType: appointmentType || 'PRESENCIAL',
      place: place || (appointmentType === 'PRESENCIAL' ? 'Consultorio' : undefined)
    });

    res.json(newAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
};
