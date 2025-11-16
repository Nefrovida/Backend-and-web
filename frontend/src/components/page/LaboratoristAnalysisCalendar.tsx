import React from "react";
import FullCalendar from "@fullcalendar/react";
import type { DateSelectArg, EventApi, EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import allLocales from "@fullcalendar/core/locales-all";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import esLocale from '@fullcalendar/core/locales/es';


import "../../styles/Calendar.css";

function renderEventContent(eventInfo: any) {
  return (
    <div className="calendar-event-card">
      <div>
        Paciente: {eventInfo.event.title}
      </div>
      <div>
        Análisis: {eventInfo.event.extendedProps.description}
      </div>
    </div>
  );
}

function LaboratoristAnalysisCalendar() {
  const handleSelect = (arg: DateSelectArg) => {
    console.log("Seleccionado:", arg);
  };

  const handleEventClick = (arg: EventClickArg) => {
    console.log("Evento:", arg.event.title);
    const actualDate = new Date().toISOString();
    console.log(actualDate);
  };

  const [currentView, setCurrentView] = React.useState("timeGridWeek");

  return ( 
  <div 
            className={
                currentView === "timeGridWeek"
                    ? "calendar-container-week"
                    : "calendar-container-day"
            }
        >
    <FullCalendar
    locales={[esLocale]}
    locale="es"
      plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
      initialView={currentView}
      slotDuration="00:15:00"
allDaySlot={false}
      events={[
        { title: "Juan Manuel Murillo López", description:"BIOMETRIA HEMÁTICA (BH)", start: '2025-11-15T10:00:00', end: '2025-11-15T10:30:00'},
        { title: "Juan Manuel Murillo López", description:"BIOMETRIA HEMÁTICA (BH)", start: '2025-11-15T12:00:00', end: '2025-11-15T12:30:00'}
      ]}
      eventContent={renderEventContent}

      height="100%"
       
      expandRows={true}
      slotMinTime="09:00:00"
      slotMaxTime="18:01:00"

      eventDidMount={(info) => {
        info.el.style.backgroundColor = "#DCEBF1";
        info.el.style.border = "1px solid #DCEBF1";
      }}
    />
  </div>
  );
}

export default LaboratoristAnalysisCalendar;
