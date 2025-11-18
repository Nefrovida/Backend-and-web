import { RouteObject } from "react-router-dom";
import RegisterDoctorPage from "../components/page/RegisterDoctorpage";

const adminRoutes: RouteObject[] = [
  {
    path: "/register-doctor",
    element: <RegisterDoctorPage />,
  },
];

export default adminRoutes;