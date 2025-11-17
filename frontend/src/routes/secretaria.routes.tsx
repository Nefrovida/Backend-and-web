import { RouteObject } from "react-router-dom";
import AgendarCitaPage from "../components/page/AgendarCitaPage";

const secretariaRoutes: RouteObject[] = [
  {
    path: "/secretaria/agendar",
    element: <AgendarCitaPage />,
  },
];

export default secretariaRoutes;
