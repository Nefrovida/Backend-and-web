import React from "react";

/* ============ Componentes Reutilizables ================= */

const Empty = ({ message }: { message: string }) => (
  <div className="bg-white rounded-lg shadow p-12 text-center">
    <h3 className="text-lg text-gray-900 font-medium">{message}</h3>
    <p className="text-gray-500 text-sm">No hay información disponible.</p>
  </div>
);

export default Empty;
