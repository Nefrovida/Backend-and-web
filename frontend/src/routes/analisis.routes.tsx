import { RouteObject } from "react-router-dom";
import LabPage from "../components/page/LabPage";
import LabResults from "../components/organism/lab/LabResults";
import LaboratoristAnalysisCalendar from "../components/page/LaboratoristAnalysisCalendar";
import { LaboratoristAnalysisCalendarC } from "@/controller/laboratoristAnalysisCalendar.controller";

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
    path: "/test/:date",
    element: <LaboratoristAnalysisCalendar />,
  },
  {
    path: "/analisis-dia/:date",
    element: <LaboratoristAnalysisCalendarC />,
  },
];

export default analisisRoutes;
