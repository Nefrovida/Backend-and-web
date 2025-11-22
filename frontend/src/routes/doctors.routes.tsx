import RegisterDoctorPage from "@/components/page/RegisterDoctorpage";
import DoctorsListPage from "@/components/page/DoctorsListPage";
import { RouteObject } from "react-router-dom";

const doctorsRoutes: RouteObject[] = [
  {
    path: "register-doctor",
    element: <RegisterDoctorPage />,
  },
  {
    path: "doctors",
    element: <DoctorsListPage />,
  },
];

export default doctorsRoutes;