/*import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import es from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";


const locals = {
    "es" : es,
};

const localizer = dateFnsLocalizer({
    format, 
    parse,
    startOfWeek,
    getDay,
    locals,
});

//todo: agregar el resto de los datos necesarios
export interface SchedulerEvent {
    id: number;
    title: string;
    start: Date;
    end : Date;
}

interface Props {
    events: SchedulerEvent[];
    onNavigate?: (newDate: Date) => void;
}

function Scheduler({events, onNavigate}: Props){
    const validEvents = Array.isArray(events) ? events.filter(event => event && typeof event.title === 'string' && event.start && event.end) : [];

    console.log("Valid events for calendar: ", validEvents);
    if (validEvents.length === 0) {
        return (
            <div style={{ height: "600px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "white" }}>
                <p>No hay citas para esta fecha.</p>
            </div>
        );
    }
    return (
        <div style={{height: "600px", width: "100%"}}>
            <Calendar
                localizer={localizer}
                events={validEvents}
                startAccessor="start"
                endAccessor="end"
                view={[Views.DAY, Views.WEEK]}
                defaultView= {Views.WEEK}
                step={30}
                timeslots={2}
                style={{backgroundColor: "white"}}
                onNavigate={(date) => {
                    if (onNavigate) onNavigate(date);
                }}

                />
        </div>
    );
};

export default Scheduler;*/

const now = new Date();

const events: CalendarEvent[] = [
  {
    id: 0,
    title: "All Day Event very long title",
    allDay: true,
    start: new Date(2015, 3, 0),
    end: new Date(2015, 3, 1)
  },
  {
    id: 1,
    title: "Long Event",
    start: new Date(2025, 11, 7),
    end: new Date(2025, 11, 10)
  },
  {
    id: 2,
    title: "DTS STARTS",
    start: new Date(2016, 2, 13),
    end: new Date(2016, 2, 20)
  },
  {
    id: 3,
    title: "DTS ENDS",
    start: new Date(2016, 10, 6),
    end: new Date(2016, 10, 13)
  },
  {
    id: 4,
    title: "Some Event",
    start: new Date(2015, 3, 9),
    end: new Date(2015, 3, 10)
  },
  {
    id: 5,
    title: "Conference",
    start: new Date(2015, 3, 11),
    end: new Date(2015, 3, 13),
    desc: "Big conference for important people"
  },
  {
    id: 6,
    title: "Meeting",
    start: new Date(2015, 3, 12, 10, 30),
    end: new Date(2015, 3, 12, 12, 30),
    desc: "Pre-meeting meeting, to prepare for the meeting"
  },
  {
    id: 7,
    title: "Lunch",
    start: new Date(2015, 3, 12, 12),
    end: new Date(2015, 3, 12, 13),
    desc: "Power lunch"
  },
  {
    id: 8,
    title: "Meeting",
    start: new Date(2015, 3, 12, 14),
    end: new Date(2015, 3, 12, 15)
  },
  {
    id: 9,
    title: "Happy Hour",
    start: new Date(2015, 3, 12, 17),
    end: new Date(2015, 3, 12, 17, 30),
    desc: "Most important meal of the day"
  },
  {
    id: 10,
    title: "Dinner",
    start: new Date(2015, 3, 12, 20),
    end: new Date(2015, 3, 12, 21)
  },
  {
    id: 11,
    title: "Planning Meeting with Paige",
    start: new Date(2015, 3, 13, 8),
    end: new Date(2015, 3, 13, 10, 30)
  },
  {
    id: 12,
    title: "Late Night Event",
    start: new Date(2015, 3, 17, 19, 30),
    end: new Date(2015, 3, 18, 2)
  },
  {
    id: 13,
    title: "Multi-day Event",
    start: new Date(2015, 3, 20, 19, 30),
    end: new Date(2015, 3, 22, 2)
  },
  {
    id: 14,
    title: "Today",
    start: new Date(new Date().setHours(new Date().getHours() - 3)),
    end: new Date(new Date().setHours(new Date().getHours() + 3))
  },
  {
    id: 15,
    title: "Point in Time Event",
    start: now,
    end: now
  },
  {
    id: 16,
    title: "Video Record",
    start: new Date(2015, 3, 14, 15, 30),
    end: new Date(2015, 3, 14, 19)
  },
  {
    id: 17,
    title: "Dutch Song Producing",
    start: new Date(2015, 3, 14, 16, 30),
    end: new Date(2015, 3, 14, 20)
  },
  {
    id: 18,
    title: "Itaewon Halloween Meeting",
    start: new Date(2015, 3, 14, 16, 30),
    end: new Date(2015, 3, 14, 17, 30)
  },
  {
    id: 19,
    title: "Online Coding Test",
    start: new Date(2015, 3, 14, 17, 30),
    end: new Date(2015, 3, 14, 20, 30)
  },
  {
    id: 20,
    title: "An overlapped Event",
    start: new Date(2015, 3, 14, 17),
    end: new Date(2015, 3, 14, 18, 30)
  },
  {
    id: 21,
    title: "Phone Interview",
    start: new Date(2015, 3, 14, 17),
    end: new Date(2015, 3, 14, 18, 30)
  },
  {
    id: 22,
    title: "Cooking Class",
    start: new Date(2015, 3, 14, 17, 30),
    end: new Date(2015, 3, 14, 19)
  },
  {
    id: 23,
    title: "Go to the gym",
    start: new Date(2015, 3, 14, 18, 30),
    end: new Date(2015, 3, 14, 20)
  }
];


import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

// Definimos el tipo de evento
export interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  desc?: string;
  allDay?: boolean;
}

export default function ReactBigCalendar() {
  const [eventsData, setEventsData] = useState<CalendarEvent[]>(events);

  const handleSelect = ({ start, end }: { start: Date; end: Date }) => {
    console.log(start);
    console.log(end);

    const title = window.prompt("New Event name");
    if (title) {
      setEventsData([
        ...eventsData,
        {
          id: Date.now(), // Genera ID único
          start,
          end,
          title
        }
      ]);
    }
  };

  return (
    <div className="App">
      <Calendar
        views={[Views.DAY, Views.AGENDA, Views.WORK_WEEK, Views.MONTH]}
        selectable
        localizer={localizer}
        defaultDate={new Date()}
        defaultView={Views.MONTH}
        events={eventsData}
        style={{ height: "100vh" }}
        onSelectEvent={(event) => alert(event.title)}
        onSelectSlot={handleSelect}
      />
    </div>
  );
}
 
