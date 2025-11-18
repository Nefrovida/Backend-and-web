import React, { useState } from "react";
import AppointmentRequestsList from "../organism/appointments/AppointmentRequestsList";
import AppointmentScheduleForm from "../organism/appointments/AppointmentScheduleForm";
import DirectAppointmentForm from "../organism/appointments/DirectAppointmentForm";
import { AppointmentRequest } from "../../types/appointment";

const AgendarCitaPage: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<AppointmentRequest | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [mode, setMode] = useState<'requests' | 'direct'>('direct');

  const handleSelectRequest = (request: AppointmentRequest) => {
    setSelectedRequest(request);
  };

  const handleScheduleComplete = () => {
    setSelectedRequest(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleAppointmentCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <section className="flex flex-col w-full h-screen">
      {/* Mode Toggle */}
      <div className="bg-white border-b-2 border-gray-200 p-4">
        <div className="flex items-center justify-center gap-4">
          <span className="text-gray-700 font-medium">Modo:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setMode('direct')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                mode === 'direct'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Nueva Cita
            </button>
            <button
              onClick={() => setMode('requests')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                mode === 'requests'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Solicitudes Pendientes
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {mode === 'requests' ? (
        <div className="flex flex-1 overflow-hidden">
          <AppointmentRequestsList
            onSelectRequest={handleSelectRequest}
            selectedRequest={selectedRequest}
            refreshTrigger={refreshTrigger}
          />
          <AppointmentScheduleForm
            selectedRequest={selectedRequest}
            onScheduleComplete={handleScheduleComplete}
          />
        </div>
      ) : (
        <DirectAppointmentForm onAppointmentCreated={handleAppointmentCreated} />
      )}
    </section>
  );
};

export default AgendarCitaPage;
