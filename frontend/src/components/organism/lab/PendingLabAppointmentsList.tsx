// src/components/organism/lab/PendingLabAppointmentsList.tsx
import Title from "../../atoms/Title";
import Search from "../../atoms/Search";
import usePendingLabAppointments from "../../../hooks/usePendingLabAppointments";
import LabAppointmentComponent from "../../atoms/labs/LabAppointmentComponent";
import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 7;

function PendingLabAppointmentsList() {
    const { appointments, loading, error, reload } = usePendingLabAppointments();
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    // Filter by patient name + analysis name
    const filtered = useMemo(
        () =>
            appointments.filter((a) =>
                `${a.patientName} ${a.analysisName}`
                    .toLowerCase()
                    .includes(query.toLowerCase())
            ),
        [appointments, query]
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

    // Always reset to page 1 when the filter or the number of appointments changes
    useEffect(() => {
        setPage(1);
    }, [query, appointments.length]);

    const startIndex = (page - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(startIndex, startIndex + PAGE_SIZE);

    const handlePrev = () => {
        setPage((prev) => Math.max(1, prev - 1));
    };

    const handleNext = () => {
        setPage((prev) => Math.min(totalPages, prev + 1));
    };

    const hasAnyPending = appointments.length > 0;
    const hasFilteredResults = filtered.length > 0;

    return (
        <div className="w-1/3 p-2 h-full overflow-hidden border-r border-slate-200 flex flex-col">
            <Title>Resultados de estudios pendientes</Title>

            <div className="w-full flex items-end justify-end gap-5 pb-2">
                <Search onChange={setQuery} />
            </div>

            {loading && (
                <p className="text-sm text-slate-500">Cargando…</p>
            )}

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
                <>
                    <ul className="flex flex-col gap-2 flex-1 overflow-y-auto">
                        {/* Case 1: nothing pending to upload */}
                        {!hasAnyPending && (
                            <p className="text-sm text-slate-500">
                                No hay estudios pendientes de subir resultados.
                            </p>
                        )}

                        {/* Case 2: there are pending items, but the filter does not match any */}
                        {hasAnyPending && !hasFilteredResults && (
                            <p className="text-sm text-slate-500">
                                No hay estudios pendientes que coincidan con la búsqueda.
                            </p>
                        )}

                        {/* Case 3: there are filtered results */}
                        {hasFilteredResults &&
                            pageItems.map((appt) => (
                                <li key={appt.id}>
                                    <LabAppointmentComponent appointment={appt} />
                                </li>
                            ))}
                    </ul>

                    {/* Pagination controls */}
                    {hasFilteredResults && (
                        <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                            <button
                                type="button"
                                onClick={handlePrev}
                                disabled={page === 1}
                                className={`px-3 py-1 rounded-full border ${page === 1
                                        ? "border-slate-200 text-slate-300 cursor-not-allowed"
                                        : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                                    }`}
                            >
                                Anterior
                            </button>

                            <span>
                                Página {page} de {totalPages}
                            </span>

                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={page === totalPages || !hasFilteredResults}
                                className={`px-3 py-1 rounded-full border ${page === totalPages || !hasFilteredResults
                                        ? "border-slate-200 text-slate-300 cursor-not-allowed"
                                        : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                                    }`}
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default PendingLabAppointmentsList;