import RegisterDoctorPage from "@/components/page/RegisterDoctorpage";
import DoctorsListPage from "@/components/page/DoctorsListPage";
import { RouteObject } from "react-router-dom";

const doctorsRoutes: RouteObject[] = [
  {
    path: "registrar-doctor",
    element: <RegisterDoctorPage />,
  },
  {
    path: "doctores",
    element: <DoctorsListPage />,
  },
];

export default doctorsRoutes;