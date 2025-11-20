import { useParams } from 'react-router-dom';
import { usePatientHistory } from '../../hooks/usePatientHistory';
import { Title } from '../../components/atoms/Title'; // Re-use the component

export const HistoryPage = () => {
  // Obtain patient ID from the URL
  const { patientId } = useParams<{ patientId: string }>();

  if (!patientId) {
    return <Title title="Error: Paciente no especificado" />;
  }

  const { history, loading, error } = usePatientHistory(patientId);

  if (loading) return <Title title="Cargando historial..." />;
  if (error) return <Title title={`Error: ${error}`} />;

  return (
    <div className="container mx-auto p-4">
      <Title title={`Historial Clínico - Paciente ${patientId}`} />
      <div className="mt-4 space-y-4">
        {history.length > 0 ? (
          history.map((record) => (
            <div key={record.id} className="p-4 border rounded shadow">
              <p className="font-bold">{new Date(record.date).toLocaleDateString()}</p>
              <p>{record.description}</p>
              <p className="text-sm text-gray-600">Atendido por: {record.doctorName}</p>
            </div>
          ))
        ) : (
          <p>No hay registros en el historial de este paciente.</p>
        )}
      </div>
    </div>
  );
};
