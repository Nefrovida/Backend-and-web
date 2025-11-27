import React, { useState } from "react";
import { useNavigate } from "react-router";
import { authService } from "../../services/auth.service";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login({ username, password });

      // Store only user data (tokens are in httpOnly cookies)
      localStorage.setItem("user", JSON.stringify(response.user));

      // Redirect to home
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Error en el inicio de sesión");
    } finally {
      setLoading(false);
    }
  };

  const clearUsername = () => setUsername("");
  const clearPassword = () => setPassword("");

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4" 
      style={{
        background: "linear-gradient(180deg, #A8C5DD 0%, #1E3A8A 100%)"
      }}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold">
              <span style={{ color: "#1E3A8A" }}>NEFR</span>
              <span style={{ color: "#DC2626" }}>O</span>
              <span style={{ color: "#84CC16" }}>Vida</span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">Asociación Civil</p>
          </div>
        </div>

        {/* Welcome message */}
        <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
          ¡Bienvenid@!
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username field */}
          <div className="relative">
            <label className="block text-sm text-gray-600 mb-2 ml-1">Usuario</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 transition-colors"
                placeholder="correo@ejemplo.com"
                required
              />
              {username && (
                <button
                  type="button"
                  onClick={clearUsername}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Password field */}
          <div className="relative">
            <label className="block text-sm text-gray-600 mb-2 ml-1">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 transition-colors"
                placeholder="••••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Forgot password link */}
          <div className="text-center">
            <button
              type="button"
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-3 rounded-full font-semibold hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg"
          >
            {loading ? "Iniciando Sesión..." : "Iniciar Sesión"}
          </button>

          {/* Register link */}
          <p className="text-center text-sm text-gray-600">
            ¿Nuevo? <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              Crea tu cuenta aquí
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
