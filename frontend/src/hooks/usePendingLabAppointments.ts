// src/hooks/usePendingLabAppointments.ts
import { useEffect, useState } from "react";
import { LabAppointment } from "../types/labAppointment";

async function fetchPendingAppointments(): Promise<LabAppointment[]> {
    const res = await fetch("/api/laboratory/lab-appointments", {
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error("No se pudieron cargar las citas");
    }

    return res.json();
}

export default function usePendingLabAppointments() {
    const [appointments, setAppointments] = useState<LabAppointment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function reload() {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchPendingAppointments();

            const sorted = [...data].sort((a, b) => {
                const weight = (s: LabAppointment["status"]) =>
                    s === "REQUESTED" ? 0 : 1;

                const wA = weight(a.status);
                const wB = weight(b.status);

                if (wA !== wB) return wA - wB;

                return (
                    new Date(b.date).getTime() -
                    new Date(a.date).getTime()
                );
            });

            setAppointments(sorted);
        } catch (err: any) {
            setError(err.message ?? "Error al cargar citas");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void reload();
    }, []);

    return {
        appointments,
        loading,
        error,
        reload,
    };
}