import RegisterDoctorPage from "@/components/page/RegisterDoctorpage";
import DoctorsListPage from "@/components/page/DoctorsListPage";
import ExternalUsersListPage from "@/components/page/ExternalUsersListPage";
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
  {
    path: "usuarios-externos",
    element: <ExternalUsersListPage />,
  },
];

export default doctorsRoutes;