import Agenda from '../model/agenda.model';

export const getPendingAppointmentRequests = async () => {
  return await Agenda.getPendingAppointmentRequests();
};

export const getDoctors = async () => {
  return await Agenda.getDoctors();
};

export const getDoctorAvailability = async (doctorId: string, date: string) => {
  return await Agenda.getDoctorAvailability(doctorId, date);
};

export const scheduleAppointment = async (data: {
  patientAppointmentId: number;
  doctorId: string;
  dateHour: string;
  duration: number;
  appointmentType: 'PRESENCIAL' | 'VIRTUAL';
  place?: string;
}) => {
  return await Agenda.scheduleAppointment(data);
};

export const createAppointment = async (data: {
  patientId: string;
  doctorId: string;
  dateHour: string;
  duration: number;
  appointmentType: 'PRESENCIAL' | 'VIRTUAL';
  place?: string;
}) => {
  return await Agenda.createAppointment(data);
};
