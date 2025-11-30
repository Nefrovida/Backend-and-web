import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import DoctorAppointments from "../components/page/DoctorAppointments";
import AppointmentTypeManager from "../components/page/AppointmentManager";

const appointmentsRoutes: RouteObject[] = [
  {
    // Only Doctor (2) can access their appointments
    path: "mis-citas",
    element: (
      <ProtectedRoute allowedRoles={[2]}>
        <DoctorAppointments />
      </ProtectedRoute>
    ),
  },
  {
    // Solo Admin (1) y Secretaria (6) pueden administrar tipos de cita
    path: "tipos-cita",
    element: (
      <ProtectedRoute allowedRoles={[1, 6]}>
        <AppointmentTypeManager />
      </ProtectedRoute>
    ),
  },
];

export default appointmentsRoutes;
