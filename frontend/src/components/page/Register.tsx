import React, { useState } from "react";
import { useNavigate } from "react-router";
import { RegisterData, Gender, ROLE_IDS, ROLE_NAMES } from "../../types/auth.types";
import { authService } from "../../services/auth.service";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type RegistrationStep = 1 | 2 | 3;

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState<RegistrationStep>(1);
  const [formData, setFormData] = useState<Partial<RegisterData>>({
    gender: Gender.MALE,
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

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

      if (formData.role_id === ROLE_IDS.DOCTOR) {
        if (!formData.specialty || !formData.license) {
          setError("La especialidad y cédula son requeridas para doctores");
          setLoading(false);
          return;
        }
        if (formData.license.length < 7) {
          setError("La cédula debe tener al menos 7 caracteres");
          setLoading(false);
          return;
        }
      }

      if (formData.role_id === ROLE_IDS.FAMILIAR && !formData.patient_curp) {
        setError("El CURP del paciente es requerido para familiares");
        setLoading(false);
        return;
      }

      const response = await authService.register(formData as RegisterData);
      
      // Check if registration is pending approval
      if (response.pending) {
        // Show success message in UI
        setSuccess(true);
        setSuccessMessage(response.message || "¡Registro exitoso! Tu cuenta está pendiente de aprobación por un administrador. Te notificaremos cuando puedas acceder.");
        // Redirect to login after 5 seconds
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      } else {
        // Fallback for backward compatibility (shouldn't happen with new flow)
        localStorage.setItem("user", JSON.stringify(response.user));
        navigate("/dashboard");
      }
    } catch (err: any) {
      const errorMessage = err.message || "";
      const errorLower = errorMessage.toLowerCase();

      // Translate technical/Prisma errors to user-friendly Spanish messages
      let friendlyMessage = "";

      // Check for duplicate username
      if (errorLower.includes("user already exists") ||
        errorLower.includes("usuario ya existe") ||
        errorLower.includes("username already") ||
        errorLower.includes("unique constraint") && errorLower.includes("username") ||
        errorLower.includes("duplicate") && errorLower.includes("username")) {
        friendlyMessage = "El nombre de usuario ya está registrado. Por favor elige otro.";
        setError(friendlyMessage);
        setStep(1); // Return to step 1 where username field is
        return;
      }

      // Check for duplicate CURP
      if (errorLower.includes("curp") && (errorLower.includes("duplicate") || errorLower.includes("unique"))) {
        friendlyMessage = "El CURP ingresado ya está registrado en el sistema.";
      }
      // Check for duplicate phone number
      else if (errorLower.includes("phone") && (errorLower.includes("duplicate") || errorLower.includes("unique"))) {
        friendlyMessage = "El número de teléfono ya está registrado. Por favor usa otro número.";
        setError(friendlyMessage);
        setStep(1);
        return;
      }
      // Check for invalid CURP format
      else if (errorLower.includes("curp") && errorLower.includes("invalid")) {
        friendlyMessage = "El formato del CURP no es válido. Verifica que tenga 18 caracteres.";
      }
      // Check for patient not found (for familiar registration)
      else if (errorLower.includes("patient not found") || errorLower.includes("paciente no encontrado")) {
        friendlyMessage = "No se encontró un paciente con el CURP proporcionado. Verifica que sea correcto.";
      }
      // Check for invalid license
      else if (errorLower.includes("license") || errorLower.includes("cédula")) {
        friendlyMessage = "La cédula profesional no es válida. Debe tener al menos 7 caracteres.";
      }
      // Check for connection errors
      else if (errorLower.includes("network") || errorLower.includes("fetch") || errorLower.includes("connection")) {
        friendlyMessage = "Error de conexión. Por favor verifica tu internet e intenta nuevamente.";
      }
      // Check for validation errors
      else if (errorLower.includes("validation") || errorLower.includes("required")) {
        friendlyMessage = "Algunos campos no son válidos. Por favor revisa la información ingresada.";
      }
      // Default friendly message for any other error
      else {
        friendlyMessage = "Ocurrió un error al registrar tu cuenta. Por favor intenta nuevamente.";
      }

      setError(friendlyMessage);
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
          maxLength={50}
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
          maxLength={50}
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
          maxLength={50}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-2 ml-1">Teléfono *</label>
        <input
          type="tel"
          value={formData.phone_number || ""}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            if (value.length <= 10) {
              updateFormData({ phone_number: value });
            }
          }}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 transition-colors"
          pattern="[0-9]{10}"
          maxLength={10}
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
          maxLength={30}
          required
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-2 ml-1">Contraseña *</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password || ""}
            onChange={(e) => updateFormData({ password: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 transition-colors pr-10"
            maxLength={100}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
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
        {[ROLE_IDS.PATIENT, ROLE_IDS.DOCTOR, ROLE_IDS.LABORATORIST, ROLE_IDS.FAMILIAR, ROLE_IDS.SECRETARIA].map((roleId) => (
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
              {roleId === ROLE_IDS.SECRETARIA && "Soy secretaria"}
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
            <p className="text-xs text-gray-500 mt-2 ml-1">
              Debe tener al menos 7 caracteres
            </p>
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

        {/* Success Message */}
        {success ? (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                ¡Registro Exitoso!
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <p className="text-sm text-gray-700">
                  {successMessage}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center text-sm text-gray-600">
                <svg className="animate-spin h-4 w-4 mr-2 text-blue-900" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Redirigiendo al inicio de sesión en unos segundos...
              </div>
              
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-blue-900 text-white py-3 rounded-full font-semibold hover:bg-blue-800 transition-colors shadow-lg"
              >
                Ir al Inicio de Sesión
              </button>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}

export default Register;
