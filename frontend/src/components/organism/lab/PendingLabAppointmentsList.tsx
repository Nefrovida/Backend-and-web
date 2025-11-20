// src/components/organism/lab/PendingLabAppointmentsList.tsx
import Title from "../../atoms/Title";
import Search from "../../atoms/Search";
import usePendingLabAppointments from "../../../hooks/usePendingLabAppointments";
import LabAppointmentComponent from "../../atoms/labs/LabAppointmentComponent";
import { useMemo, useState } from "react";

function PendingLabAppointmentsList() {
    const { appointments, loading, error, reload } = usePendingLabAppointments();
    const [query, setQuery] = useState("");

    const filtered = useMemo(
        () =>
            appointments.filter((a) =>
                `${a.patientName} ${a.analysisName}`
                    .toLowerCase()
                    .includes(query.toLowerCase())
            ),
        [appointments, query]
    );

    return (
        <div className="w-1/3 p-2 h-screen overflow-hidden border-r border-slate-200">
            <Title>Resultados de estudios pendientes</Title>

            <div className="w-full flex items-end justify-end gap-5 pb-2">
                {}
                <Search onChange={setQuery} />
            </div>

            {loading && <p className="text-sm text-slate-500">Cargando…</p>}
            {error && (
                <div className="space-y-2">
                    <p className="text-sm text-red-600">{error}</p>
                    <button
                        type="button"
                        onClick={() => reload()}
                        className="text-xs px-3 py-1 rounded bg-slate-900 text-white"
                    >
                        Reintentar
                    </button>
                </div>
            )}

            {!loading && !error && (
                <ul className="flex flex-col gap-2 h-[calc(100%-4rem)] overflow-y-auto">
                    {filtered.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            No hay citas pendientes que coincidan con la búsqueda.
                        </p>
                    ) : (
                        filtered.map((appt) => (
                            <li key={appt.id}>
                                <LabAppointmentComponent appointment={appt} />
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
}

export default PendingLabAppointmentsList;