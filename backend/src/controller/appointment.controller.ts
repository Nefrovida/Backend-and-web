import { Request, Response } from 'express';
import AppointmentModel from '../model/appointment.model';
import {getAppointmentByPatient} from '../service/appointments.service';

export default class AppointmentController {
  
  /**
   * GET /api/appointments
   */
  static async getAllAppointments(req: Request, res: Response) {
    try {
      const appointments = await AppointmentModel.getAllAppointments();
      res.json(appointments);
    } catch (error) {
      console.error('Error getting appointments:', error);
      res.status(500).json({ error: 'Error al obtener citas' });
    }
  }

  /**
   * GET /api/appointments/day/:date
   */
  static async getAppointmentsByDay(req: Request, res: Response) {
    try {
      const { date } = req.params;
      
      // Validar formato de fecha (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ error: 'Formato de fecha inválido' });
      }

      const appointments = await AppointmentModel.getAppointmentsByDay(date);
      res.json(appointments);
    } catch (error) {
      console.error('Error getting appointments by day:', error);
      res.status(500).json({ error: 'Error al obtener citas del día' });
    }
  }

  /**
   * PUT /api/appointments/:id/reschedule
   */
  static async rescheduleAppointment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { date_hour, reason } = req.body;
      console.log("date hour passed to reschedule appointment: ", date_hour);

      // Validaciones
      if (!date_hour || !reason) {
        return res.status(400).json({ 
          error: 'Fecha/hora y motivo son requeridos' 
        });
      }

      const appointmentId = parseInt(id);
      if (isNaN(appointmentId)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      // Verificar que la cita existe
      const existing = await AppointmentModel.getAppointmentById(appointmentId);
      if (!existing) {
        return res.status(404).json({ error: 'Cita no encontrada' });
      }

      // Verificar que la fecha no sea en el pasado
      // Parse date_hour string (format: "YYYY-MM-DD HH:mm") and create Date object
      // Parse manually to avoid timezone conversion issues
      const dateMatch = date_hour.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})/);
      if (!dateMatch) {
        return res.status(400).json({ 
          error: 'Formato de fecha/hora inválido. Use: YYYY-MM-DD HH:mm' 
        });
      }
      
      const [, year, month, day, hour, minute] = dateMatch.map(Number);
      // Create Date object treating the input as UTC to avoid timezone shifts
      const newDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
      
      if (newDate < new Date()) {
        return res.status(400).json({ 
          error: 'No se puede agendar en el pasado' 
        });
      }

      // Verificar disponibilidad del horario
      const isAvailable = await AppointmentModel.isTimeSlotAvailable(newDate);
      if (!isAvailable) {
        return res.status(409).json({ 
          error: 'El horario ya está ocupado' 
        });
      }

      // Reagendar
      const updated = await AppointmentModel.rescheduleAppointment(
        appointmentId,
        newDate,
        reason
      );

      res.json(updated);
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      res.status(500).json({ error: 'Error al reagendar cita' });
    }
  }

  static async getPatientAppointment(req: Request, res: Response){
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      const data = await getAppointmentByPatient(userId);
      res.status(200).json(data);
    }
    catch (error){
      console.error('Error fetching patient appointments');
      res.status(500).json({error: 'No se pudo cargar la información correctamente'})
    }
  }

}