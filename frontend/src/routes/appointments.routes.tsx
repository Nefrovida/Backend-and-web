import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import DoctorAppointments from "../components/page/DoctorAppointments";
import AppointmentTypeManager from "../components/page/AppointmentManager";
import AppointmentModal from "@/components/molecules/appointments/AppointmentModal";

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
    path: "citas",
    element: (
      <ProtectedRoute allowedRoles={[1, 6]}>
        <AppointmentTypeManager />
      </ProtectedRoute>
    ),
  },
  {
    path: "eliminar-cita",
    element: <AppointmentModal modalStatus={false} />,
  },
];

export default appointmentsRoutes;
