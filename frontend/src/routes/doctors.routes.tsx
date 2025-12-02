import RegisterDoctorPage from "@/components/page/RegisterDoctorpage";

import { RouteObject } from "react-router-dom";

const doctorsRoutes: RouteObject[] = [
  {
    path: "registrar-doctor",
    element: <RegisterDoctorPage />,
  },

];

export default doctorsRoutes;