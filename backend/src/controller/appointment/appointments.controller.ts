import { Request, Response } from "express";
import * as appointmentsService from "../../service/appointments.service";
import {createAppointmentTypeSchema } from "../../validators/appointment.validator";
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
