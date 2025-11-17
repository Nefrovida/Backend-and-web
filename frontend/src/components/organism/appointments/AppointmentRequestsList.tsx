import React, { useEffect, useState } from "react";
import Title from "../../atoms/Title";
import Search from "../../atoms/Search";
import AppointmentRequestCard from "../../atoms/appointments/AppointmentRequestCard";
import { AppointmentRequest } from "../../../types/appointment";
import { agendaService } from "../../../services/agenda.service";

interface Props {
  onSelectRequest: (request: AppointmentRequest) => void;
  selectedRequest: AppointmentRequest | null;
  refreshTrigger: number;
}

const AppointmentRequestsList: React.FC<Props> = ({ 
  onSelectRequest, 
  selectedRequest,
  refreshTrigger 
}) => {
  const [requests, setRequests] = useState<AppointmentRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<AppointmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadRequests();
  }, [refreshTrigger]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = requests.filter((req) =>
        req.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.appointment_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRequests(filtered);
    } else {
      setFilteredRequests(requests);
    }
  }, [searchTerm, requests]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await agendaService.getPendingRequests();
      setRequests(data);
      setFilteredRequests(data);
    } catch (error) {
      console.error("Error loading appointment requests:", error);
      // No mostrar alert, solo log del error
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="w-1/3 p-4 h-screen overflow-hidden border-r-2 border-gray-200 bg-gray-50">
      <Title>Solicitudes de Citas</Title>
      
      <div className="w-full flex items-end justify-end pb-4 pt-2">
        <Search onChange={handleSearch} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Cargando solicitudes...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">
            {searchTerm ? "No se encontraron resultados" : "No hay solicitudes pendientes"}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3 h-[85%] overflow-auto pr-2">
          {filteredRequests.map((request) => (
            <li key={request.patient_appointment_id}>
              <AppointmentRequestCard
                request={request}
                isSelected={selectedRequest?.patient_appointment_id === request.patient_appointment_id}
                onSelect={onSelectRequest}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AppointmentRequestsList;
