import React from 'react';
import { useNavigate } from 'react-router-dom';

/*Pagina creada para poner a prueba la historia de usuario. Solo te redirige
a una pagina con un boton para que simule el hecho de pulsar a alguna cita agendada en el calendario
*/

export const AgendaPage = () => {
  const navigate = useNavigate();

  const handleViewAppointment = (id: string) => {
    navigate(`/citas/${id}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-semibold">Agenda de Citas</h1>
      <p className="mt-2 text-gray-700">
        (Boton de Prueba)
      </p>

      <button
        onClick={() => handleViewAppointment('1')} 
        className="mt-6 p-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      >
        Ver Detalle Cita (Prueba ID: 1)
      </button>
    </div>
  );
};

export default AgendaPage;