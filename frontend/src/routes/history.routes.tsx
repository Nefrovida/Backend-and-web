import { Route, Routes } from 'react-router-dom';
import { HistoryPage } from '../pages/History/HistoryPage';

export const HistoryRoutes = () => (
  <Routes>
    {/* This route gets the patient ID */}
    <Route path="/:patientId" element={<HistoryPage />} />

    {}
  </Routes>
);
