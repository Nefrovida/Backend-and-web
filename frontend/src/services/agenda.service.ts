import {Appointment} from "../types/appointment.types";

const API_BASE_URL = import.meta.env.VITE_APP_API_URL || "/api";

export const agendaService = {
    async getAppointmentsPerDay(date: string): Promise<Appointment[]> {
        const response = await fetch(`${API_BASE_URL}/agenda/appointments-per-day?date=${date}`, {
            method: "GET",
            //credentials: "include",
    }); 
    

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error obteniendo citas");
    }
    return response.json();
},
};
