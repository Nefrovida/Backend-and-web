import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AppointmentRequestsList from "../organism/appointments/AppointmentRequestsList";
import AppointmentScheduleForm from "../organism/appointments/AppointmentScheduleForm";
import DirectAppointmentForm from "../organism/appointments/DirectAppointmentForm";
import { AppointmentRequest } from "../../types/appointment";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

const AgendarCitaPage: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<AppointmentRequest | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isDirectMode, setIsDirectMode] = useState(false);
  const [isRescheduleMode, setIsRescheduleMode] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const [searchParams] = useSearchParams();
  const patientIdFromQuery = searchParams.get("patientId") || undefined;
  const directFromQuery = searchParams.get("direct") === "true";

  useEffect(() => {
    if (directFromQuery) {
      setIsDirectMode(true);
    }
  }, [directFromQuery]);

  const handleSelectRequest = (request: AppointmentRequest) => {
    console.log("📌 REQUEST SELECCIONADA:", request); // 👈 Mira el ID en la consola
    setSelectedRequest(request);
    setIsDirectMode(false);
    setIsRescheduleMode(false);
  };

  const handleScheduleComplete = () => {
    setSelectedRequest(null);
    setIsRescheduleMode(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleAppointmentCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
    setIsDirectMode(false);
  };

  const handleCreateNew = () => {
    setIsDirectMode(true);
    setSelectedRequest(null);
    setIsRescheduleMode(false);
  };

  // 👇 Aprobar la solicitud tal cual está
  const handleApproveSelected = async () => {
    if (!selectedRequest) return;

    // 🔥 EDITA SOLO ESTA LÍNEA (usa el nombre correcto del ID, mira la consola)
    const appointmentId =
      selectedRequest.patient_appointment_id || // 👈 Opción 1
      selectedRequest.patient_appointment_id || // 👈 Opción 2
      selectedRequest.patient_appointment_id;                       // 👈 Opción 3

    if (!appointmentId) {
      console.error("❌ No se pudo obtener el ID de la solicitud:", selectedRequest);
      alert("No se reconoce el ID de la cita");
      return;
    }

    try {
      setIsApproving(true);
      console.log("🆔 Enviando al backend:", appointmentId);

      const res = await fetch(
        `${API_BASE_URL}/appointments/${appointmentId}/change-status`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error(await res.text());

      alert("Cita aprobada correctamente");
      setSelectedRequest(null);
      setIsRescheduleMode(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al aprobar la cita");
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <section className="flex flex-col w-full min-h-screen">
      <div className="flex flex-1 overflow-hidden">
        <AppointmentRequestsList
          onSelectRequest={handleSelectRequest}
          selectedRequest={selectedRequest}
          refreshTrigger={refreshTrigger}
          onCreateNew={handleCreateNew}
        />

        {selectedRequest ? (
          <div className="flex-1 flex flex-col border-l border-gray-200">
            <div className="flex items-center justify-between gap-4 p-4 border-b bg-gray-50">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Solicitud seleccionada</span>
                <span className="font-semibold">
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  className="px-3 py-1.5 rounded bg-emerald-600 text-white text-sm hover:bg-emerald-700 disabled:bg-emerald-300"
                  onClick={handleApproveSelected}
                  disabled={isApproving}
                >
                  {isApproving ? "Aprobando..." : "Aprobar"}
                </button>

                <button
                  className="px-3 py-1.5 rounded border border-blue-500 text-blue-600 text-sm hover:bg-blue-50"
                  onClick={() => setIsRescheduleMode(true)}
                >
                  Re-agendar
                </button>
              </div>
            </div>

            {isRescheduleMode ? (
              <AppointmentScheduleForm
                selectedRequest={selectedRequest}
                onScheduleComplete={handleScheduleComplete}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                <p>
                  Puedes aprobar la solicitud tal cual, o hacer clic en{" "}
                  <span className="font-semibold">"Re-agendar"</span>.
                </p>
              </div>
            )}
          </div>
        ) : isDirectMode ? (
          <DirectAppointmentForm
            onAppointmentCreated={handleAppointmentCreated}
            initialPatientId={patientIdFromQuery}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Selecciona una solicitud o crea una nueva cita</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AgendarCitaPage;