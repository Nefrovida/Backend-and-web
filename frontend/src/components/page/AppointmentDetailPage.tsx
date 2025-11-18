import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppointmentDetails } from '../../controller/useAppointDetails'; 

const Title = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-bold text-gray-800 mb-3">{children}</h2>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-1">{children}</h3>
);

const InfoField = ({ label, value }: { label: string, value: React.ReactNode }) => (
  <p className="text-sm text-gray-600 mb-1">
    <strong className="font-medium text-gray-900">{label}:</strong> {value}
  </p>
);

// --- Principal Interface ---
export const AppointmentDetailPage = () => {
  // Reads ID from URL params
  const { AppoiID } = useParams<{ AppoiID: string }>();

  //Calls the hook to fetch appointment details
  const { appointment, loading, error } = useAppointmentDetails(AppoiID || null);

  // Charging status
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-medium text-gray-600">Cargando datos de la cita</div>
      </div>
    );
  }

  // Error Status
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">Error: {error}</div>
      </div>
    );
  }

  // Content Display
  return (
    <div className="flex justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-6">
        
        <div className="bg-sky-100 p-4 rounded-lg mb-4 text-center">
          <Title>{appointment?.patient.name}</Title>
        </div>
        
        {/* Section: Appointment Information*/}
        <section className="mb-4">
          <SectionTitle>Información de la Cita</SectionTitle>
          <InfoField label="Fecha" value={appointment?.date} />
          <InfoField label="Horario" value={appointment?.schedule} />
          <InfoField label="Motivo de la cita" value={appointment?.reason} />
          <InfoField label="Consultorio asignado" value={appointment?.consulting_room} />
        </section>

        {/* Section: Patient Info */}
        <section>
          <SectionTitle>Información del Paciente</SectionTitle>
          <InfoField label="Edad" value={`${appointment?.patient.age} años`} />
          <InfoField label="Sexo" value={appointment?.patient.genre} />
          <InfoField label="Diagnóstico Actual" value={appointment?.patient.diagnostic} />
          <InfoField 
            label="Último Análisis" 
            value={
              appointment?.patient.LastAnalisisUrl ? (
                <a 
                  href={appointment.patient.LastAnalisisUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {appointment.patient.LastAnalisisUrl.split('/').pop()}
                </a>
              ) : (
                'No disponible'
              )
            } 
          />
        </section>
      </div>
    </div>
  );
};

export default AppointmentDetailPage;