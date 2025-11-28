import React, { useEffect, useState } from "react";
import { getDoctors } from "../../services/doctor.service";
import { ROLE_IDS } from "../../types/auth.types";
import ProtectedRoute from "../common/ProtectedRoute";

interface Doctor {
  doctor_id: number;
  name: string;
  parent_last_name: string;
  maternal_last_name?: string;
  specialty: string;
  license: string;
}

const DoctorsListPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar doctores");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <ProtectedRoute allowedRoles={[ROLE_IDS.ADMIN]}>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4">Lista de Doctores</h1>

        {loading && <p>Cargando doctores...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Nombre</th>
                <th className="border p-2">Especialidad</th>
                <th className="border p-2">Licencia</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc) => (
                <tr key={doc.doctor_id}>
                  <td className="border p-2">
                    {doc.name} {doc.parent_last_name} {doc.maternal_last_name}
                  </td>
                  <td className="border p-2">{doc.specialty}</td>
                  <td className="border p-2">{doc.license}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default DoctorsListPage;