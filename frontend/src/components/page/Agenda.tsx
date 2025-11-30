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
import { AppointmentModal } from "../molecules/AppointmentModal";

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

  const handleEventClick = (clickInfo: EventClickArg) => {
    setSelectedEvent({
      title: clickInfo.event.title,
      description: clickInfo.event.extendedProps.description,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
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
      
      {isModalOpen && selectedEvent && (
        <AppointmentModal
          event={selectedEvent}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default Agenda;