import React from "react";
import FullCalendar from "@fullcalendar/react";
import type { DateSelectArg, EventApi, EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import allLocales from "@fullcalendar/core/locales-all";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";

import "../../styles/LaboratoristAnalysisCalendar.css";

function renderEventContent(eventInfo: any) {
  return (
    <div className="event-card">
      <div style={{ fontSize: "11px", opacity: 0.8 }}>
        Paciente: {eventInfo.event.title}
      </div>
      <div style={{ fontSize: "11px", opacity: 0.8 }}>
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

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
      initialView="timeGridDay"
      selectable={true}
      select={handleSelect}
      eventClick={handleEventClick}
      events={[
        { title: "Juan Manuel Murillo López", description:"BIOMETRIA HEMÁTICA (BH)", start: '2025-11-15T16:16:29.557Z'}
      ]}
      eventContent={renderEventContent}
      slotMinTime="09:00:00"
      slotMaxTime="18:01:00"
      dayCellDidMount={(info) => {

        info.el.style.backgroundColor = "#F0F0F0";

      }}
      eventDidMount={(info) => {
        info.el.style.backgroundColor = "#DCEBF1";
        info.el.style.border = "1px solid #DCEBF1";

      }}
    />
  );
}

export default LaboratoristAnalysisCalendar;
