import { RouteObject } from "react-router-dom";
import LabPage from "../components/page/LabPage";
import LabResults from "../components/organism/lab/LabResults";
import AnalysisManager from "../components/page/AnalysisManager";

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
  {
    // Analysis manager must not be a child of /laboratorio
    path: "/analisis",
    element: <AnalysisManager />,
  },
];

export default analisisRoutes;
