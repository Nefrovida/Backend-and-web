import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import type { EventClickArg, DatesSetArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import esLocale from "@fullcalendar/core/locales/es";
import "../../styles/Calendar.css";
import { mapAppointmentsToEvents } from "../../model/secretaryCalendar.model";
import { AppointmentModal } from "../molecules/AppointmentModal";
import RescheduleModal from "../organism/RescheduleModal";
import { Appointment, RescheduleData } from "../../types/appointment";
import appointmentController from "../../controller/AppointmentController";

function renderEventContent(eventInfo: any) {
  return (
    <div className="calendar-event-card">
      <div>Paciente: {eventInfo.event.title}</div>
      <div>Cita: {eventInfo.event.extendedProps.description}</div>
    </div>
  );
}

function Agenda() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const lastRange = useRef({ start: "", end: "" });

  const fetchAppointments = async (start: Date, end: Date) => {
    try {
      const startStr = start.toISOString();
      const endStr = end.toISOString();

      const res = await fetch(
        `/api/agenda/appointments/range?start=${startStr}&end=${endStr}`
      );
      const data = await res.json();
      const mappedEvents = mapAppointmentsToEvents(data);

      setEvents(mappedEvents);
    } catch (error) {
      console.error("Error loading appointments:", error);
      setEvents([]);
    }
  };

  const handleDatesSet = (arg: DatesSetArg) => {
    const startStr = arg.view.currentStart.toISOString();
    const endStr = arg.view.currentEnd.toISOString();

    if (
      lastRange.current.start === startStr &&
      lastRange.current.end === endStr
    ) {
      return;
    }

    lastRange.current = { start: startStr, end: endStr };

    fetchAppointments(arg.view.currentStart, arg.view.currentEnd);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    setSelectedEvent({
      id: clickInfo.event.extendedProps.id,
      title: clickInfo.event.title,
      description: clickInfo.event.extendedProps.description,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      patient_id: clickInfo.event.extendedProps.patient_id,
      patient_name: clickInfo.event.extendedProps.patient_name,
      patient_parent_last_name:
        clickInfo.event.extendedProps.patient_parent_last_name,
      patient_maternal_last_name:
        clickInfo.event.extendedProps.patient_maternal_last_name,
      reason: clickInfo.event.extendedProps.description,
      date_hour: clickInfo.event.start,
      status: clickInfo.event.extendedProps.status || "PROGRAMMED",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    fetchAppointments(
      new Date(lastRange.current.start),
      new Date(lastRange.current.end)
    );
  };

  const handleReschedule = () => {
    if (selectedEvent) {
      // Convertir el evento del calendario a formato Appointment
      const appointment: Appointment = {
        id: selectedEvent.id,
        patient_id: selectedEvent.patient_id,
        date_hour: selectedEvent.date_hour,
        reason: selectedEvent.reason,
        status: selectedEvent.status,
        patient_name: selectedEvent.patient_name,
        patient_parent_last_name: selectedEvent.patient_parent_last_name,
        patient_maternal_last_name: selectedEvent.patient_maternal_last_name,
      };
      setSelectedAppointment(appointment);
      setIsModalOpen(false); // Cerrar el modal de detalles
    }
  };

  const handleSaveReschedule = async (id: number, data: RescheduleData) => {
    try {
      await appointmentController.rescheduleAppointment(id, data);

      setSelectedAppointment(null);
      alert("Cita reagendada exitosamente");

      // Recargar las citas del calendario
      if (lastRange.current.start && lastRange.current.end) {
        fetchAppointments(
          new Date(lastRange.current.start),
          new Date(lastRange.current.end)
        );
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al reagendar");
    }
  };

  const handleCloseRescheduleModal = () => {
    setSelectedAppointment(null);
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 min-h-0">
        <FullCalendar
          locales={[esLocale]}
          locale="es"
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="timeGridWeek"
          slotDuration="00:15:00"
          allDaySlot={false}
          events={events}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          height="100%"
          expandRows={true}
          slotMinTime="09:00:00"
          slotMaxTime="19:01:00"
          datesSet={handleDatesSet}
          eventDidMount={(info) => {
            info.el.style.backgroundColor = "#DCEBF1";
            info.el.style.border = "1px solid #DCEBF1";
            info.el.style.cursor = "pointer";
          }}
        />
      </div>

      {/* Modal de detalles de la cita */}
      {isModalOpen && selectedEvent && (
        <AppointmentModal
          event={selectedEvent}
          onClose={handleCloseModal}
          onReschedule={handleReschedule}
        />
      )}

      {/* Modal de reagendar */}
      {selectedAppointment && (
        <RescheduleModal
          appointment={selectedAppointment}
          onClose={handleCloseRescheduleModal}
          onSave={handleSaveReschedule}
        />
      )}
    </div>
  );
}

export default Agenda;
