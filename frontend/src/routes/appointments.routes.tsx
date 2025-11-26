import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import DoctorAppointments from "../components/page/DoctorAppointments";
import DeleteAppoinmentButton from "../components/atoms/appointments/DeleteAppoinmentButton"
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
    path: 'eliminar-cita',
    element: (
      <AppointmentModal  modalStatus={false}/>
    )
  },
];

export default appointmentsRoutes;
