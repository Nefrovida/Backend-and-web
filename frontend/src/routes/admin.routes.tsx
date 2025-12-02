import { RouteObject } from "react-router-dom";
import RegisterAdminPage from "../components/page/RegisterAdminPage";
import RegisterDoctorPage from "../components/page/RegisterDoctorpage";
import PendingUsersPage from "../components/page/PendingUsersPage";

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
  }
];

export default adminRoutes;