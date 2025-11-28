import {timeStamp} from "console";

export function mapAppointmentsToEvents(appointments: any[]) {
  return appointments.map((appointment) => {
    const start = new Date(appointment.date_hour);  
    const end = new Date(start.getTime() + (appointment.duration * 60 * 1000));  
    return {
      id: appointment.patient_appointment_id, 
      title: appointment.name || "Sin nombre",  
      description: `${appointment.appointment_name}`,  
      start: start.toISOString(),  
      end: end.toISOString(),  
    };
  });
}
