import { RouteObject } from "react-router-dom";
import RegisterAdminPage from "../components/page/RegisterAdminPage";
import RegisterDoctorPage from "../components/page/RegisterDoctorpage";
import PendingUsersPage from "../components/page/PendingUsersPage";
import RejectedUsersPage from "../components/page/RejectedUsersPage";
import ResetPasswordPage from "../components/page/ResetPasswordPage";

const adminRoutes: RouteObject[] = [
  {
    path: "registrar-admin",
    element: <RegisterAdminPage />,
  },
  {
    path: "pending-users",
    element: <PendingUsersPage />,
  },
  {
    path: "registrar-doctor",
    element: <RegisterDoctorPage />,
  },
  {
    path: "rejected-users",
    element: <RejectedUsersPage />,
  }
  {
    path: "reestablecer-contraseña",
    element: <ResetPasswordPage />,
  },
];

export default adminRoutes;