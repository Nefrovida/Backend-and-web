import React from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarEventContent } from "../molecules/CalendarEventContent";
import esLocale from '@fullcalendar/core/locales/es';
import { CalendarProps } from "@/types/calendarProps";

import "../../styles/Calendar.css";

export const Calendar = ({
    events,
    viewType = "timeGridDay",
    minTime = "07:00:00",
    maxTime = "18:01:00",
    onDatesSet,
    onEventClick,
}: CalendarProps) => {

    return (
        <div 
            className={
                viewType === "timeGridWeek"
                    ? "calendar-container-week"
                    : "calendar-container-day"
            }
        >
        <FullCalendar

            // Configure language to spanish
            locales={[esLocale]}
            locale="es"

            // Add pluggins
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}

            // timeGridDay or timeGridWeek
            initialView={viewType}

            // Add events array
            events={events}
            eventContent={CalendarEventContent}

            // Adyust time limits
            slotMinTime={minTime}
            slotMaxTime={maxTime}

            // Set slots by hour to 4
            slotDuration="00:15:00"

            // Don't show 'Todo el día' cell
            allDaySlot={false}

            // Change brackground visualization
            eventDidMount={(info) => {
                info.el.style.backgroundColor = "#DCEBF1";
                info.el.style.border = "1px solid #DCEBF1";
            }}

            // Exec every time the user navigates thru dates
            datesSet={onDatesSet}

            // Handle event clicks
            eventClick={onEventClick}
        />
        </div>
    )
}