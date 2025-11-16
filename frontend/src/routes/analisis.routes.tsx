import { RouteObject } from "react-router-dom";
import LabPage from "../components/page/LabPage";
import LabResults from "../components/organism/lab/LabResults";
import LaboratoristAnalysisCalendar from "../components/page/LaboratoristAnalysisCalendar";
import { LaboratoristAnalysisCalendarC } from "@/controller/laboratoristAnalysisCalendar.controller";
import LabUploadPage from "../components/page/LabUploadPage";
import LabAppointmentUpload from "../components/organism/lab/LabAppointmentUpload";

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
    path: "/analisis-dia",
    element: <LaboratoristAnalysisCalendarC />,
  },
  {
    path: "/laboratorio/subir",
    element: <LabUploadPage />,
    children: [
      {
        path: ":resultadoId",
        element: <LabAppointmentUpload />,
      },
    ],
  },
];

export default analisisRoutes;
