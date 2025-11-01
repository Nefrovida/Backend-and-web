import { RouteObject } from "react-router";
import LabResults from "../components/page/LabResults";

const analisisRoutes: RouteObject[] = [
  {
    path: "/laboratorio",
    element: <LabResults />,
  },
];

export default analisisRoutes;
