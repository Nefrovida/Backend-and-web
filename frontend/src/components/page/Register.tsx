import React, { useState } from "react";
import { useNavigate } from "react-router";
import { RegisterData, Gender, ROLE_IDS, ROLE_NAMES } from "../../types/auth.types";
import { authService } from "../../services/auth.service";

type RegistrationStep = 1 | 2 | 3;

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState<RegistrationStep>(1);
  const [formData, setFormData] = useState<Partial<RegisterData>>({
    gender: Gender.MALE,
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const updateFormData = (data: Partial<RegisterData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setError("");
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.parent_last_name || !formData.username || 
        !formData.password || !formData.birthday || !formData.phone_number) {
      setError("Por favor complete todos los campos requeridos");
      return;
    }

    setStep(2);
  };

  const handleStep2Submit = (selectedRoleId: number) => {
    updateFormData({ role_id: selectedRoleId });
    setStep(3);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate role-specific fields
      if (formData.role_id === ROLE_IDS.PATIENT && !formData.curp) {
        setError("El CURP es requerido para pacientes");
        setLoading(false);
        return;
      }

      if (formData.role_id === ROLE_IDS.DOCTOR && (!formData.speciality || !formData.license)) {
        setError("La especialidad y cédula son requeridas para doctores");
        setLoading(false);
        return;
      }

      const response = await authService.register(formData as RegisterData);
      
      // Store tokens
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Redirect to home
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Error en el registro");
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <form onSubmit={handleStep1Submit} className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Información Básica</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Nombre *</label>
        <input
          type="text"
          value={formData.name || ""}
          onChange={(e) => updateFormData({ name: e.target.value })}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Apellido Paterno *</label>
        <input
          type="text"
          value={formData.parent_last_name || ""}
          onChange={(e) => updateFormData({ parent_last_name: e.target.value })}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Apellido Materno</label>
        <input
          type="text"
          value={formData.maternal_last_name || ""}
          onChange={(e) => updateFormData({ maternal_last_name: e.target.value })}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Teléfono *</label>
        <input
          type="tel"
          value={formData.phone_number || ""}
          onChange={(e) => updateFormData({ phone_number: e.target.value })}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Fecha de Nacimiento *</label>
        <input
          type="date"
          value={formData.birthday || ""}
          onChange={(e) => updateFormData({ birthday: e.target.value })}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Género *</label>
        <select
          value={formData.gender}
          onChange={(e) => updateFormData({ gender: e.target.value as Gender })}
          className="w-full px-3 py-2 border rounded-md"
          required
        >
          <option value={Gender.MALE}>Masculino</option>
          <option value={Gender.FEMALE}>Femenino</option>
          <option value={Gender.OTHER}>Otro</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Usuario *</label>
        <input
          type="text"
          value={formData.username || ""}
          onChange={(e) => updateFormData({ username: e.target.value })}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Contraseña *</label>
        <input
          type="password"
          value={formData.password || ""}
          onChange={(e) => updateFormData({ password: e.target.value })}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        Siguiente
      </button>

      <p className="text-center text-sm">
        ¿Ya tienes cuenta?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-blue-600 hover:underline"
        >
          Inicia sesión
        </button>
      </p>
    </form>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Tipo de Usuario</h2>
      <p className="text-center text-gray-600 mb-6">¿Qué tipo de usuario eres?</p>

      <div className="space-y-3">
        {[ROLE_IDS.PATIENT, ROLE_IDS.DOCTOR, ROLE_IDS.LABORATORIST].map((roleId) => (
          <button
            key={roleId}
            onClick={() => handleStep2Submit(roleId)}
            className="w-full p-4 border-2 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition text-left"
          >
            <h3 className="font-semibold text-lg">{ROLE_NAMES[roleId as keyof typeof ROLE_NAMES]}</h3>
            <p className="text-sm text-gray-600">
              {roleId === ROLE_IDS.PATIENT && "Registrarme como paciente"}
              {roleId === ROLE_IDS.DOCTOR && "Soy un profesional de la salud"}
              {roleId === ROLE_IDS.LABORATORIST && "Trabajo en laboratorio"}
            </p>
          </button>
        ))}
      </div>

      <button
        onClick={() => setStep(1)}
        className="w-full py-2 text-gray-600 hover:text-gray-800"
      >
        ← Volver
      </button>
    </div>
  );

  const renderStep3 = () => (
    <form onSubmit={handleFinalSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">
        Información de {ROLE_NAMES[formData.role_id as keyof typeof ROLE_NAMES]}
      </h2>

      {formData.role_id === ROLE_IDS.PATIENT && (
        <div>
          <label className="block text-sm font-medium mb-1">CURP *</label>
          <input
            type="text"
            value={formData.curp || ""}
            onChange={(e) => updateFormData({ curp: e.target.value.toUpperCase() })}
            className="w-full px-3 py-2 border rounded-md uppercase"
            placeholder="ABCD123456HDFXYZ01"
            maxLength={18}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Clave Única de Registro de Población (18 caracteres)
          </p>
        </div>
      )}

      {formData.role_id === ROLE_IDS.DOCTOR && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Especialidad *</label>
            <input
              type="text"
              value={formData.speciality || ""}
              onChange={(e) => updateFormData({ speciality: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Ej: Nefrología, Medicina General, etc."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cédula Profesional *</label>
            <input
              type="text"
              value={formData.license || ""}
              onChange={(e) => updateFormData({ license: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Número de cédula"
              maxLength={20}
              required
            />
          </div>
        </>
      )}

      {formData.role_id === ROLE_IDS.LABORATORIST && (
        <div className="p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-gray-700">
            Como laboratorista, no necesitas información adicional.
            Presiona "Completar Registro" para finalizar.
          </p>
        </div>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
      >
        {loading ? "Registrando..." : "Completar Registro"}
      </button>

      <button
        type="button"
        onClick={() => setStep(2)}
        className="w-full py-2 text-gray-600 hover:text-gray-800"
        disabled={loading}
      >
        ← Volver
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* Progress indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= s ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && <div className="w-8 h-1 bg-gray-300" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
}

export default Register;
