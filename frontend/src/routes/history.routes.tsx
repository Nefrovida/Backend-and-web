import { Route, Routes } from 'react-router-dom';
import { HistoryPage } from '../pages/History/HistoryPage';

export const HistoryRoutes = () => (
  <Routes>
    {/* Esta ruta captura el ID del paciente */}
    <Route path="/:patientId" element={<HistoryPage />} />

    {/* TODO: Crear una página 'PatientListPage' que muestre
        una lista de pacientes y navegue a la ruta de arriba.
        <Route path="/" element={<PatientListPage />} /> 
    */}
  </Routes>
);