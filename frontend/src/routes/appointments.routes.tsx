import { RouteObject } from "react-router-dom";

import AgendaPage from "../components/page/AgendaPage";
import AppointmentDetailPage from "../components/page/AppointmentDetailPage";


const appointmentsRutas: RouteObject[] = [
  {
    path: "/agenda",
    element: <AgendaPage />,
  },
  {
    path: "/citas/:AppoiID",
    element: <AppointmentDetailPage />,
  }
];

export default appointmentsRutas;