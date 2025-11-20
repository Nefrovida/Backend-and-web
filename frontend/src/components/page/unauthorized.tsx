// frontend/src/pages/UnauthorizedPage.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-6">
          <svg 
            className="w-20 h-20 mx-auto text-red-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Acceso No Autorizado
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          No tienes los privilegios necesarios para acceder a esta página.
          Si crees que esto es un error, contacta al administrador del sistema.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 px-4 bg-blue-900 text-white rounded-full font-semibold hover:bg-blue-800 transition-colors"
          >
            Volver atrás
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors"
          >
            Ir al inicio
          </button>
        </div>

        {/* Help text */}
        <p className="text-xs text-gray-500 mt-6">
          ¿Necesitas ayuda? Contacta a soporte técnico
        </p>
      </div>
    </div>
  )
}

export default UnauthorizedPage