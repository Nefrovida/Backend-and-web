import { RouteObject } from "react-router-dom";
import RegisterAdminPage from "../components/page/RegisterAdminPage";
import ResetPasswordPage from "../components/page/ResetPasswordPage";

const adminRoutes: RouteObject[] = [
  {
    path: "registrar-admin",
    element: <RegisterAdminPage />,
  },
  {
    path: "reestablecer-contraseña",
    element: <ResetPasswordPage />,
  },
];

export default adminRoutes;