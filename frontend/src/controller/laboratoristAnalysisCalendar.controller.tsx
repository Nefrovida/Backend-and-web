// frontend/src/controller/laboratoristAnalysisCalendar.controller.tsx
import React, { useEffect, useState } from "react";
import { Calendar } from "../components/organism/Calendar";
import { mapAnalysisToEvents } from "../model/laboratoristCalendar.model";

const API_BASE_URL = (import.meta as any).env.VITE_APP_API_URL || "http://localhost:3001/api";

export const LaboratoristAnalysisCalendarC: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    const fetchEvents = async (date: Date) => {
        try {
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            const formatted = `${year}-${month}-${day}`; // YYYY-MM-DD

            const res = await fetch(
                `${API_BASE_URL}/laboratory/analysis/by-date/${formatted}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            if (!res.ok) {
                console.error("Error al cargar análisis del laboratorio:", res.status);
                setEvents([]);
                return;
            }

            const data = await res.json();
            const mapped = mapAnalysisToEvents(data);
            setEvents(mapped);
        } catch (err) {
            console.error("Error en fetchEvents (laboratorista):", err);
            setEvents([]);
        }
    };

    const handleDateChange = (arg: any) => {
        const newDate = arg.view.currentStart;

        if (newDate.getTime() !== currentDate.getTime()) {
            setCurrentDate(newDate);
            fetchEvents(newDate);
        }
    };

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