export function mapAppointmentsToEvents(appointments: any[]) {
  return appointments.map((appointment) => {
    const start = new Date(appointment.date_hour);  
    const end = new Date(start.getTime() + (appointment.duration * 60 * 1000));  
    
    return {
      id: appointment.patient_appointment_id, 
      title: appointment.name || "Sin nombre",  
      start: start.toISOString(),  
      end: end.toISOString(),
      extendedProps: {
        id: appointment.patient_appointment_id,
        description: appointment.appointment_name || "Sin motivo",
        patient_id: appointment.patient_id,
        patient_name: appointment.name,
        patient_parent_last_name: appointment.parent_last_name,
        patient_maternal_last_name: appointment.maternal_last_name,
        status: appointment.appointment_status || 'PROGRAMMED',
        duration: appointment.duration,
      },
    };
  });
}