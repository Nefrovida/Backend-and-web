import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import DoctorAppointments from "../components/page/DoctorAppointments";
import DeleteAppoinmentButton from "../components/atoms/appointments/DeleteAppoinmentButton"

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
    path: 'eliminar-cita',
    element: (
      <DeleteAppoinmentButton appointmentId={2} />
    )
  },
];

export default appointmentsRoutes;
