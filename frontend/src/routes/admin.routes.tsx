import { RouteObject } from "react-router-dom";
import RegisterAdminPage from "../components/page/RegisterAdminPage";

const adminRoutes: RouteObject[] = [
  {
    path: "registrar-admin",
    element: <RegisterAdminPage />,
  },
];

export default adminRoutes;