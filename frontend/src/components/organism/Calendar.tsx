import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarEventContent } from "../molecules/CalendarEventContent";

export const Calendar = ({ events }) => {
    return (
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
            initialView="timeGridDay"
            events={events}
            eventContent={CalendarEventContent}
            slotMinTime="09:00:00"
            slotMaxTime="18:01:00"
            dayCellDidMount={(info) => {
                const today = new Date().toDateString();
                const cellDate = info.date.toDateString();
                info.el.style.backgroundColor = "#F0F0F0";

            }}
            eventDidMount={(info) => {
                info.el.style.backgroundColor = "#DCEBF1";
                info.el.style.border = "1px solid #DCEBF1";

            }}
        />
    )
}