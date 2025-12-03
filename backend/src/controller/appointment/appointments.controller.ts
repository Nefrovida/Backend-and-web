import { Request, Response } from "express";
import * as appointmentsService from "../../service/appointments.service";
import {createAppointmentTypeSchema, updateAppointmentTypeSchema } from "../../validators/appointment.validator";
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

export const getAllAppointments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const appointments = await appointmentsService.getAllAppointments();
    res.status(200).json(appointments);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const createAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointmentData = req.body;
    
    if (!appointmentData) {
      res.status(400).json({ error: "Appointment data is required" });
      return;
    }

    const validatedData = createAppointmentTypeSchema.parse(appointmentData);

    const existingAppointment = await appointmentsService.getAppointmentByData(validatedData);

    if (existingAppointment) {
      res.status(409).json({ error: "Appointment already exists" });
      return;
    }

    await appointmentsService.createAppointment(validatedData);

    res.status(201).json("Appointment created successfully");
    
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const updateAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointmentId = req.params.appointment_id;
    const appointmentIdNumber = parseInt(appointmentId);

    if (isNaN(appointmentIdNumber)) {
      res.status(400).json({ error: "Invalid appointment ID" });
      return;
    }
    const appointmentData = req.body;

    if (!appointmentData) {
      res.status(400).json({ error: "Appointment data is required" });
      return;
    }

    const validatedData = updateAppointmentTypeSchema.parse(appointmentData);

    await appointmentsService.updateAppointment(appointmentIdNumber, validatedData);

    res.status(200).json("Appointment updated successfully");
    
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const deleteAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointmentId = req.params.appointment_id;
    const appointmentIdNumber = parseInt(appointmentId);

    if (isNaN(appointmentIdNumber)) {
      res.status(400).json({ error: "Invalid appointment ID" });
      return;
    }

    await appointmentsService.deleteAppointment(appointmentIdNumber);

    res.status(200).json("Appointment deleted successfully");
    
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const getUserAppointmentsByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const appointments = await appointmentsService.getAllAppointmentsByUserId(
      req,
      res,
      id
    );
    res.status(200).json(appointments);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Schedule an appointment (patient schedules it)
 */
export const scheduleAppointment = async (req: Request, res: Response) => {
  try {
    const { appointmentId, patientId, dateHour, appointmentType } = req.body;

    // 1. Validate required fields
    if (!appointmentId || !patientId || !dateHour || !appointmentType) {
      res.status(400).json({ success: false });
      return;
    }

    // 2. Validate user is authenticated
    if (!req.user) {
      res.status(401).json({ success: false });
      return;
    }

    // 3. Validate appointmentId exists and get appointment details
    const appointment = await appointmentsService.validateAppointment(appointmentId);
    if (!appointment) {
      res.status(404).json({ success: false });
      return;
    }

    // 4. Parse dateHour as local time (treat the incoming string as local time, not UTC)
    // If dateHour is "2025-12-04T11:50:00", parse it as local time components
    let appointmentDate: Date;
    
    if (dateHour.includes('T')) {
      // Parse as "YYYY-MM-DDTHH:mm:ss" format
      const [datePart, timePart] = dateHour.split('T');
      const [year, month, day] = datePart.split('-').map(Number);
      const [hours, minutes, seconds = 0] = timePart.replace('Z', '').split(':').map(Number);
      
      // Create date using local timezone (not UTC)
      appointmentDate = new Date(year, month - 1, day, hours - 6, minutes, seconds);
    } else {
      // Fallback to direct parsing
      appointmentDate = new Date(dateHour);
    }
    
    const now = new Date();
    if (appointmentDate <= now) {
      res.status(400).json({ success: false });
      return;
    }

    const normalizedAppointmentType = appointmentType.toUpperCase() as 'PRESENCIAL' | 'VIRTUAL';

    // 6. Create the patient appointment
    await appointmentsService.schedulePatientAppointment({
      patient_id: patientId,
      appointment_id: appointmentId,
      date_hour: appointmentDate,
      duration: 10,
      appointment_type: normalizedAppointmentType,
      link: null,
      place: null,
      appointment_status: 'PROGRAMMED'
    });

    res.status(201).json({ success: true });
  } catch (error: any) {
    console.error('Error scheduling appointment:', error);
    res.status(error.statusCode || 500).json({ success: false });
  }
};
