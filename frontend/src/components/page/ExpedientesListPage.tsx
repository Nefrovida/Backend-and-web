import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { patientsService, Patient } from "../../services/patients.service";
import { FaUser, FaFileAlt } from "react-icons/fa";

function ExpedientesListPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await patientsService.getAllPatients();
      setPatients(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar pacientes");
    } finally {
      setLoading(false);
    }
  };

  const handlePatientClick = (patientId: string) => {
    navigate(`/dashboard/expediente/${patientId}`);
  };

  const getFullName = (patient: Patient) => {
    // Some responses may come flattened with `full_name` (agenda) or with nested `user` object.
    if ((patient as any).full_name) return (patient as any).full_name as string;

    const parts = [
      patient.user?.name,
      patient.user?.parent_last_name,
      patient.user?.maternal_last_name,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(" ") : "Sin nombre";
  };

  const filteredPatients = patients.filter((patient) => {
    const fullName = getFullName(patient).toLowerCase();
    const curp = patient.curp?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || curp.includes(search);
  });

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-600">Cargando pacientes...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button
            onClick={loadPatients}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Expedientes de Pacientes
          </h1>
          <p className="text-gray-600">
            Selecciona un paciente para ver su expediente médico
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre o CURP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Patients List */}
        {filteredPatients.length === 0 ? (
          <div className="text-center py-12">
            <FaUser className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-xl text-gray-500">
              {searchTerm
                ? "No se encontraron pacientes"
                : "No hay pacientes registrados"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <div
                key={patient.patient_id}
                onClick={() => handlePatientClick(patient.patient_id)}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-200 hover:border-blue-500"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <FaUser className="text-blue-600 text-2xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {getFullName(patient)}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">CURP:</span>
                      <span className="font-mono">{patient.curp}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">ID:</span>
                      <span className="font-mono text-xs">
                        {patient.patient_id.slice(0, 8)}...
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="flex items-center text-blue-600 hover:text-blue-800 font-medium">
                      <FaFileAlt className="mr-2" />
                      Ver Expediente
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Count */}
        {filteredPatients.length > 0 && (
          <div className="mt-6 text-center text-gray-600">
            Mostrando {filteredPatients.length} de {patients.length} pacientes
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpedientesListPage;
