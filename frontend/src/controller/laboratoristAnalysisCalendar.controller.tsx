import React, { useEffect, useState } from "react";
import { Calendar } from "../components/organism/Calendar";
import { mapAnalysisToEvents } from "../model/laboratoristCalendar.model";

export const LaboratoristAnalysisCalendarC = () => {

    const [events, setEvents] = useState<any[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    console.log("EVENTS: ", events)

    // Llama al backend por fecha
    const fetchEvents = async (date: Date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const formatted = `${day}-${month}-${year}`;
        const res = await fetch(`/api/laboratory/analysis/by-date/${formatted}`);
        const data = await res.json();

        const mapped = mapAnalysisToEvents(data);
        setEvents(mapped);
    };

    // Cuando cambia el día (navegación)
    const handleDateChange = (arg: any) => {
        const newDate = arg.view.currentStart;

        if (newDate.getTime() !== currentDate.getTime()) {
            setCurrentDate(newDate);
            fetchEvents(newDate);
        }
    };


    // Cargar por primera vez
    useEffect(() => {
        fetchEvents(currentDate);
    }, []);

    return (
        <Calendar
            events={events}
            viewType="timeGridDay"
            onDatesSet={handleDateChange}  
        />
    );
};
