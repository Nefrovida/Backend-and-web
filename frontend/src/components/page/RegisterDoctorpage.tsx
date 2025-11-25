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
        <div className="mb-8">
          <Title size="large">Registrar Doctor</Title>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold mb-2">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Nombre"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="parent_last_name" className="block text-sm font-semibold mb-2">
              Apellido Paterno <span className="text-red-500">*</span>
            </label>
            <input
              id="parent_last_name"
              type="text"
              name="parent_last_name"
              placeholder="Apellido paterno"
              value={formData.parent_last_name}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="maternal_last_name" className="block text-sm font-semibold mb-2">
              Apellido Materno
            </label>
            <input
              id="maternal_last_name"
              type="text"
              name="maternal_last_name"
              placeholder="Apellido materno"
              value={formData.maternal_last_name}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-semibold mb-2">
              Usuario <span className="text-red-500">*</span>
            </label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Usuario"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-2">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="phone_number" className="block text-sm font-semibold mb-2">
              Teléfono
            </label>
            <input
              id="phone_number"
              type="text"
              name="phone_number"
              placeholder="Teléfono"
              value={formData.phone_number}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label htmlFor="birthday" className="block text-sm font-semibold mb-2">
              Fecha de Nacimiento
            </label>
            <input
              id="birthday"
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-semibold mb-2">
              Género
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleSelectChange}
              className="w-full border p-2 rounded"
            >
              <option value={Gender.MALE}>Masculino</option>
              <option value={Gender.FEMALE}>Femenino</option>
              <option value={Gender.OTHER}>Otro</option>
            </select>
          </div>

          <div>
            <label htmlFor="specialty" className="block text-sm font-semibold mb-2">
              Especialidad <span className="text-red-500">*</span>
            </label>
            <input
              id="specialty"
              type="text"
              name="specialty"
              placeholder="Especialidad"
              value={formData.specialty}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="license" className="block text-sm font-semibold mb-2">
              Licencia <span className="text-red-500">*</span>
            </label>
            <input
              id="license"
              type="text"
              name="license"
              placeholder="Licencia"
              value={formData.license}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

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