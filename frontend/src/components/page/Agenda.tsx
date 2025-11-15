import {useEffect, useState} from "react";
import Scheduler, {SchedulerEvent} from "../organism/agenda/Scheduler";
import { agendaService } from "../../services/agenda.service";

function Agenda() {
    const [events, setEvents] = useState<SchedulerEvent[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const fetchAppointments = async (date: Date) => {
        const yyyy_mm_dd = date.toISOString().split("T")[0];

        const appointments = await agendaService.getAppointmentsPerDay(yyyy_mm_dd);

        const mapped: SchedulerEvent[] = appointments.map((a) => ({
            id: a.patient_appointment_id,
            title: `${a.patient_name} ${a.patient_last_name}`,
            start: new Date(a.date_hour), 
            end: new Date(new Date(a.date_hour).getTime() + a.duration * 60000),
        }));

        setEvents(mapped);
    };

    useEffect(() => {
        fetchAppointments(selectedDate);
    }, [selectedDate]);

    return (
        <div style={{ padding: "1rem"}}>
            <h1>Agenda</h1>

            <Scheduler
                events={events}
                onNavigate={(newDate) => {
                    console.log("Nueva fecha seleccionada:", newDate);
                    setSelectedDate(newDate);
                }}
                />
        </div>
    )

}

export default Agenda;