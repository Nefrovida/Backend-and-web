import { RouteObject } from "react-router";
import LabPage from "../components/page/LabPage";
import LabResults from "../components/organism/lab/LabResults";

const analisisRoutes: RouteObject[] = [
  {
    path: "/laboratorio",
    element: <LabPage />,
    children: [
      {
        path: ":resultadoId",
        element: <LabResults />,
      },
    ],
  },
];

export default analisisRoutes;
