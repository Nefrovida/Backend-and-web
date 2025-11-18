import React, { useState } from "react";
import AppointmentRequestsList from "../organism/appointments/AppointmentRequestsList";
import AppointmentScheduleForm from "../organism/appointments/AppointmentScheduleForm";
import { AppointmentRequest } from "../../types/appointment";

const AgendarCitaPage: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<AppointmentRequest | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSelectRequest = (request: AppointmentRequest) => {
    setSelectedRequest(request);
  };

  const handleScheduleComplete = () => {
    setSelectedRequest(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <section className="flex w-full h-screen">
      <AppointmentRequestsList
        onSelectRequest={handleSelectRequest}
        selectedRequest={selectedRequest}
        refreshTrigger={refreshTrigger}
      />
      <AppointmentScheduleForm
        selectedRequest={selectedRequest}
        onScheduleComplete={handleScheduleComplete}
      />
    </section>
  );
};

export default AgendarCitaPage;
