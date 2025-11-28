import { RouteObject } from "react-router-dom";
import RegisterDoctorPage from "../components/page/RegisterDoctorpage";
import PendingUsersPage from "../components/page/PendingUsersPage";

const adminRoutes: RouteObject[] = [
  {
    path: "register-doctor",
    element: <RegisterDoctorPage />,
  },
  {
    path: "pending-users",
    element: <PendingUsersPage />,
  },
];

export default adminRoutes;