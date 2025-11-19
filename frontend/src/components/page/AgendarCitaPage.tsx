import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AppointmentRequestsList from "../organism/appointments/AppointmentRequestsList";
import AppointmentScheduleForm from "../organism/appointments/AppointmentScheduleForm";
import DirectAppointmentForm from "../organism/appointments/DirectAppointmentForm";
import { AppointmentRequest } from "../../types/appointment";

const AgendarCitaPage: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<AppointmentRequest | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isDirectMode, setIsDirectMode] = useState(false);
  const [searchParams] = useSearchParams();
  const patientIdFromQuery = searchParams.get("patientId") || undefined;
  const directFromQuery = searchParams.get("direct") === "true";

  useEffect(() => {
    if (directFromQuery) {
      setIsDirectMode(true);
    }
  }, [directFromQuery]);

  const handleSelectRequest = (request: AppointmentRequest) => {
    setSelectedRequest(request);
    setIsDirectMode(false); // When selecting a request, exit direct mode
  };

  const handleScheduleComplete = () => {
    setSelectedRequest(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleAppointmentCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
    setIsDirectMode(false); // After creating, exit direct mode
  };

  const handleCreateNew = () => {
    setIsDirectMode(true);
    setSelectedRequest(null); // Clear selected request
  };

  return (
    <section className="flex flex-col w-full h-screen">
      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        <AppointmentRequestsList
          onSelectRequest={handleSelectRequest}
          selectedRequest={selectedRequest}
          refreshTrigger={refreshTrigger}
          onCreateNew={handleCreateNew}
        />
        {selectedRequest ? (
          <AppointmentScheduleForm
            selectedRequest={selectedRequest}
            onScheduleComplete={handleScheduleComplete}
          />
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
