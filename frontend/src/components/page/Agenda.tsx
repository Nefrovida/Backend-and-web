import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import type {
  DateSelectArg,
  EventClickArg,
  DatesSetArg,
} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import allLocales from "@fullcalendar/core/locales-all";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import esLocale from "@fullcalendar/core/locales/es";
import "../../styles/Calendar.css";
import { mapAppointmentsToEvents } from "../../model/secretaryCalendar.model";
import { agendaService } from "../../services/agenda.service";

// 1. IMPORTAR EL MODAL Y EL COMPONENTE DE REAGENDAR (si lo usas)
// Asegúrate de que la ruta coincida con donde guardaste el archivo modificado
import { AppointmentModal } from "../molecules/appointments/AppointmentModal"; 
// Si tienes el modal de reagendar, impórtalo también, si no, puedes comentar lo referente a él
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
  
  // 2. ESTADOS NECESARIOS PARA EL MODAL
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  const lastRange = useRef({ start: "", end: "" });

  const fetchAppointments = async (start: Date, end: Date) => {
    try {
      const startStr = start.toISOString();
      const endStr = end.toISOString();

      const res = await fetch(
        `/api/agenda/appointments/range?start=${startStr}&end=${endStr}`
      );
      let data = await res.json();
      data = data.map((appt: any) => ({
        ...appt,
        date_hour: appt.date_hour.replace("Z", ""),
      }));
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

  // 3. HANDLERS PARA ABRIR/CERRAR MODALES
  const handleEventClick = (clickInfo: EventClickArg) => {
    // Guardamos toda la info del evento para mostrarla en el modal
    setSelectedEvent({
      id: clickInfo.event.extendedProps.id, // Asegúrate que tu modelo mapee el ID aquí
      title: clickInfo.event.title,
      description: clickInfo.event.extendedProps.description,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      // Datos extra necesarios para reagendar/cancelar
      patient_id: clickInfo.event.extendedProps.patient_id,
      patient_name: clickInfo.event.extendedProps.patient_name,
      reason: clickInfo.event.extendedProps.description,
      status: clickInfo.event.extendedProps.status,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleReschedule = () => {
    if (selectedEvent) {
        // Lógica para preparar el objeto Appointment para el modal de reagendar
        const appointment: Appointment = {
            id: selectedEvent.id,
            patient_id: selectedEvent.patient_id,
            date_hour: selectedEvent.start,
            reason: selectedEvent.description,
            status: selectedEvent.status || 'PROGRAMMED',
            // Añade campos opcionales si los tienes
        };
        setSelectedAppointment(appointment);
        setIsModalOpen(false);
    }
  };

  const handleCloseRescheduleModal = () => {
    setSelectedAppointment(null);
  };

  const handleSaveReschedule = async (id: number, data: RescheduleData) => {
    // Tu lógica de guardado de reagendación
    try {
        await appointmentController.rescheduleAppointment(id, data);
        alert('Cita reagendada exitosamente');
        setSelectedAppointment(null);
        // Refrescar calendario
        if (lastRange.current.start) {
            fetchAppointments(new Date(lastRange.current.start), new Date(lastRange.current.end));
        }
    } catch (error) {
        console.error(error);
        alert('Error al reagendar');
    }
  };

  // 4. TU FUNCIÓN DE CANCELAR (Ya integrada correctamente)
  const handleCancelAppointment = async () => {
    if (!selectedEvent || !selectedEvent.id) return;

    try {
      // Llama a tu servicio para cancelar/eliminar
      await agendaService.deleteAppointment(selectedEvent.id); 
      
      alert("Cita cancelada con éxito");
      setIsModalOpen(false); // Cierra el modal
      
      // Refresca el calendario
      if (lastRange.current.start && lastRange.current.end) {
        fetchAppointments(
          new Date(lastRange.current.start),
          new Date(lastRange.current.end)
        );
      }
    } catch (error) {
      console.error("Error al cancelar:", error);
      alert("Hubo un error al intentar cancelar la cita.");
    }
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
          height="100%"
          expandRows={true}
          slotMinTime="09:00:00"
          slotMaxTime="19:01:00"
          datesSet={handleDatesSet}
          // 5. IMPORTANTE: Conectar el evento de click
          eventClick={handleEventClick} 
          eventDidMount={(info) => {
            info.el.style.backgroundColor = "#DCEBF1";
            info.el.style.border = "1px solid #DCEBF1";
            info.el.style.cursor = "pointer"; // Añadido cursor pointer
          }}
        />
      </div>

      {/* 6. AQUÍ ES DONDE VA EL MODAL (Fuera del div de FullCalendar pero dentro del contenedor principal) */}
      {isModalOpen && selectedEvent && (
        <AppointmentModal
          event={selectedEvent}
          onClose={handleCloseModal}
          onReschedule={handleReschedule}
          onCancel={handleCancelAppointment}
        />
      )}

      {/* Modal de reagendar (opcional si lo trajiste) */}
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