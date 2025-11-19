import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import DoctorAppointments from "../components/page/DoctorAppointments";

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
];

export default appointmentsRoutes;
