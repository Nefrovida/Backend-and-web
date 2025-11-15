import { RouteObject } from "react-router-dom";
import AppointmentsPage from "../components/page/AppointmentsPage";

const appointmentsRoutes: RouteObject[] = [
  {
    path: "/citas",
    element: <AppointmentsPage />,
  },
];

export default appointmentsRoutes;