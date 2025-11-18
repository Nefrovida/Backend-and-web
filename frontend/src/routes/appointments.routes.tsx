import { RouteObject } from "react-router-dom";

import AgendaPage from "../components/page/AgendaPage";
import AppointmentDetailPage from "../components/page/AppointmentDetailPage";
import ProtectedRoute from "../components/common/ProtectedRoute";
import DoctorAppointments from "../components/page/DoctorAppointments";


const appointmentsRoutes: RouteObject[] = [
  {
    // Only Doctor (2) can access their appointments
    path: "/mis-citas",
    element: (
      <ProtectedRoute allowedRoles={[2]}>
        <DoctorAppointments />
      </ProtectedRoute>
    ),
  },
  {
    path: "/agenda",
    element: <AgendaPage />,
  },
  {
    path: "/citas/:AppoiID",
    element: <AppointmentDetailPage />,
  }
];

export default appointmentsRoutes;
