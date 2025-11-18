import React, { useState } from "react";
import { registerDoctor } from "../../services/doctor.service";
import { DoctorInput } from "../../types/doctor.types";
import { AuthResponse, Gender, ROLE_IDS } from "../../types/auth.types";
import Title from "../atoms/Title";
import ProtectedRoute from "../common/ProtectedRoute";

const RegisterDoctorPage: React.FC = () => {
  const [formData, setFormData] = useState<DoctorInput>({
    name: "",
    parent_last_name: "",
    maternal_last_name: "",
    username: "",
    password: "",
    phone_number: "",
    birthday: "",
    gender: Gender.OTHER,
    specialty: "",
    license: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const currentUser: AuthResponse["user"] = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "gender") {
      setFormData((prev) => ({ ...prev, gender: value as Gender }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await registerDoctor(currentUser, formData);
      setSuccess("Doctor registrado correctamente");
    } catch (err: any) {
      setError(err.message || "Error al registrar doctor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={[ROLE_IDS.ADMIN]}>
      <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
        <Title>Registrar Doctor</Title>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="parent_last_name"
            placeholder="Apellido paterno"
            value={formData.parent_last_name}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="maternal_last_name"
            placeholder="Apellido materno"
            value={formData.maternal_last_name}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="username"
            placeholder="Usuario"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="phone_number"
            placeholder="Teléfono"
            value={formData.phone_number}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleSelectChange}
            className="w-full border p-2 rounded"
          >
            <option value={Gender.MALE}>Masculino</option>
            <option value={Gender.FEMALE}>Femenino</option>
            <option value={Gender.OTHER}>Otro</option>
          </select>

          <input
            type="text"
            name="specialty"
            placeholder="Especialidad"
            value={formData.specialty}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="license"
            placeholder="Licencia"
            value={formData.license}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Registrando..." : "Registrar Doctor"}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </div>
    </ProtectedRoute>
  );
};

export default RegisterDoctorPage;