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

      if (formData.role_id === ROLE_IDS.DOCTOR && (!formData.specialty || !formData.license)) {
        setError("La especialidad y cédula son requeridas para doctores");
        setLoading(false);
        return;
      }

      if (formData.role_id === ROLE_IDS.FAMILIAR && !formData.patient_curp) {
        setError("El CURP del paciente es requerido para familiares");
        setLoading(false);
        return;
      }

      const response = await authService.register(formData as RegisterData);
      
      // Store only user data (tokens are in httpOnly cookies)
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
    <form onSubmit={handleStep1Submit} className="space-y-5">
      <div>
        <label className="block text-sm text-gray-600 mb-2 ml-1">Nombre *</label>
        <input
          type="text"
          value={formData.name || ""}
          onChange={(e) => updateFormData({ name: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 transition-colors"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-2 ml-1">Apellido Paterno *</label>
        <input
          type="text"
          value={formData.parent_last_name || ""}
          onChange={(e) => updateFormData({ parent_last_name: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 transition-colors"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-2 ml-1">Apellido Materno</label>
        <input
          type="text"
          value={formData.maternal_last_name || ""}
          onChange={(e) => updateFormData({ maternal_last_name: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-2 ml-1">Teléfono *</label>
        <input
          type="tel"
          value={formData.phone_number || ""}
          onChange={(e) => updateFormData({ phone_number: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 transition-colors"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-2 ml-1">Fecha de Nacimiento *</label>
        <input
          type="date"
          value={formData.birthday || ""}
          onChange={(e) => updateFormData({ birthday: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 transition-colors"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-2 ml-1">Género *</label>
        <select
          value={formData.gender}
          onChange={(e) => updateFormData({ gender: e.target.value as Gender })}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 transition-colors"
          required
        >
          <option value={Gender.MALE}>Masculino</option>
          <option value={Gender.FEMALE}>Femenino</option>
          <option value={Gender.OTHER}>Otro</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-2 ml-1">Usuario *</label>
        <input
          type="text"
          value={formData.username || ""}
          onChange={(e) => updateFormData({ username: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 transition-colors"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-2 ml-1">Contraseña *</label>
        <input
          type="password"
          value={formData.password || ""}
          onChange={(e) => updateFormData({ password: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 transition-colors"
          required
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-900 text-white py-3 rounded-full font-semibold hover:bg-blue-800 transition-colors shadow-lg"
      >
        Siguiente
      </button>

      <p className="text-center text-sm text-gray-600">
        ¿Ya tienes cuenta?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
        >
          Inicia sesión
        </button>
      </p>
    </form>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center mb-2 text-gray-800">Tipo de Usuario</h2>
      <p className="text-center text-gray-600 mb-6">¿Qué tipo de usuario eres?</p>

      <div className="space-y-3">
        {[ROLE_IDS.PATIENT, ROLE_IDS.DOCTOR, ROLE_IDS.LABORATORIST, ROLE_IDS.FAMILIAR].map((roleId) => (
          <button
            key={roleId}
            onClick={() => handleStep2Submit(roleId)}
            className="w-full p-5 border-2 border-gray-300 rounded-xl hover:border-blue-900 hover:bg-blue-50 transition-all text-left shadow-sm hover:shadow-md"
          >
            <h3 className="font-semibold text-lg text-gray-800">{ROLE_NAMES[roleId as keyof typeof ROLE_NAMES]}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {roleId === ROLE_IDS.PATIENT && "Registrarme como paciente"}
              {roleId === ROLE_IDS.DOCTOR && "Soy un profesional de la salud"}
              {roleId === ROLE_IDS.LABORATORIST && "Trabajo en laboratorio"}
              {roleId === ROLE_IDS.FAMILIAR && "Soy familiar de un paciente"}
            </p>
          </button>
        ))}
      </div>

      <button
        onClick={() => setStep(1)}
        className="w-full py-3 text-gray-600 hover:text-gray-800 font-medium"
      >
        ← Volver
      </button>
    </div>
  );

  const renderStep3 = () => (
    <form onSubmit={handleFinalSubmit} className="space-y-5">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
        Información de {ROLE_NAMES[formData.role_id as keyof typeof ROLE_NAMES]}
      </h2>

      {formData.role_id === ROLE_IDS.PATIENT && (
        <div>
          <label className="block text-sm text-gray-600 mb-2 ml-1">CURP *</label>
          <input
            type="text"
            value={formData.curp || ""}
            onChange={(e) => updateFormData({ curp: e.target.value.toUpperCase() })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 transition-colors uppercase"
            placeholder="ABCD123456HDFXYZ01"
            maxLength={18}
            required
          />
          <p className="text-xs text-gray-500 mt-2 ml-1">
            Clave Única de Registro de Población (18 caracteres)
          </p>
        </div>
      )}

      {formData.role_id === ROLE_IDS.DOCTOR && (
        <>
          <div>
            <label className="block text-sm text-gray-600 mb-2 ml-1">Especialidad *</label>
            <input
              type="text"
              value={formData.specialty || ""}
              onChange={(e) => updateFormData({ specialty: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 transition-colors"
              placeholder="Ej: Nefrología, Medicina General, etc."
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2 ml-1">Cédula Profesional *</label>
            <input
              type="text"
              value={formData.license || ""}
              onChange={(e) => updateFormData({ license: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 transition-colors"
              placeholder="Número de cédula"
              maxLength={20}
              required
            />
          </div>
        </>
      )}

      {formData.role_id === ROLE_IDS.LABORATORIST && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-gray-700">
            Como laboratorista, no necesitas información adicional.
            Presiona "Completar Registro" para finalizar.
          </p>
        </div>
      )}

      {formData.role_id === ROLE_IDS.FAMILIAR && (
        <div>
          <label className="block text-sm text-gray-600 mb-2 ml-1">CURP del Paciente *</label>
          <input
            type="text"
            value={formData.patient_curp || ""}
            onChange={(e) => updateFormData({ patient_curp: e.target.value.toUpperCase() })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 transition-colors uppercase"
            placeholder="ABCD123456HDFXYZ01"
            maxLength={18}
            required
          />
          <p className="text-xs text-gray-500 mt-2 ml-1">
            Ingrese el CURP del paciente al que está asociado como familiar
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg"
      >
        {loading ? "Registrando..." : "Completar Registro"}
      </button>

      <button
        type="button"
        onClick={() => setStep(2)}
        className="w-full py-3 text-gray-600 hover:text-gray-800 font-medium"
        disabled={loading}
      >
        ← Volver
      </button>
    </form>
  );

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4" 
      style={{
        background: "linear-gradient(180deg, #A8C5DD 0%, #1E3A8A 100%)"
      }}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold">
              <span style={{ color: "#1E3A8A" }}>NEFR</span>
              <span style={{ color: "#DC2626" }}>O</span>
              <span style={{ color: "#84CC16" }}>Vida</span>
            </h1>
            <p className="text-xs text-gray-600 mt-1">Asociación Civil</p>
          </div>
        </div>

        {/* Welcome message - only on step 1 */}
        {step === 1 && (
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            ¡Bienvenid@!
          </h2>
        )}

        {/* Progress indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step >= s ? "bg-blue-900 text-white" : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && <div className={`w-8 h-1 transition-colors ${step > s ? "bg-blue-900" : "bg-gray-300"}`} />}
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
