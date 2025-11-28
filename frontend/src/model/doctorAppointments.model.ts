import { DoctorAppointment } from "../types/doctorAppointment.types";

export function mapAppointmentsToEvents(appointments: DoctorAppointment[]) {
  const events = [];

  appointments.forEach((appointment) => {
    // Build full patient name
    const fullName =
      `${appointment.patient_name || ""} ` +
      `${appointment.patient_parent_last_name || ""} ` +
      `${appointment.patient_maternal_last_name || ""}`.trim();

    // Parse the appointment date
    const raw = appointment.date_hour.replace("Z", "");
    const startDate = new Date(raw);

    // Assume appointments are 30 minutes long
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);

    events.push({
      id: appointment.patient_appointment_id,
      title: fullName || "Paciente desconocido",
      type: "Cita",
      description: appointment.appointment_name.trim(),
      start: startDate,
      end: endDate,
      extendedProps: {
        type: "Cita",
        description: appointment.appointment_name.trim(),
        cost: appointment.cost,
        status: appointment.status,
        patientPhone: appointment.patient_phone,
        patientId: appointment.patient_id,
      },
    });
  });

  return events;
}
