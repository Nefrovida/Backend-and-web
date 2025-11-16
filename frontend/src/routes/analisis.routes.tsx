// frontend/src/routes/analisis.routes.tsx
import { RouteObject } from "react-router-dom";
import LabPage from "../components/page/LabPage";
import LabResults from "../components/organism/lab/LabResults";
import AnalysisManager from "../components/page/AnalysisManager";
import ProtectedRoute from "../components/common/ProtectedRoute";
import LaboratoristAnalysisCalendar from "../components/page/LaboratoristAnalysisCalendar";
import { LaboratoristAnalysisCalendarC } from "@/controller/laboratoristAnalysisCalendar.controller";
import LabUploadPage from "../components/page/LabUploadPage";
import LabAppointmentUpload from "../components/organism/lab/LabAppointmentUpload";

const analisisRoutes: RouteObject[] = [
  {
    path: "/laboratorio",
    element: (
      <ProtectedRoute>
        <LabPage />
      </ProtectedRoute>
    ),
    children: [
      {
        path: ":resultadoId",
        element: <LabResults />,
      },
    ],
  },
  {
    // Secretary view to manage analysis types (US 28, 29, 30)
    path: "/analisis",
    element: (
      <ProtectedRoute>
        <AnalysisManager />
      </ProtectedRoute>
    ),
  },
  {
    // Routes added in develop for laboratorist calendar
    path: "/test/:date",
    element: <LaboratoristAnalysisCalendar />,
  },
  {
    path: "/analisis-dia",
    element: <LaboratoristAnalysisCalendarC />,
  },
  {
    // Laboratorist view to upload PDF results (US5)
    path: "/laboratorio/subir",
    element: (
      <ProtectedRoute>
        <LabUploadPage />
      </ProtectedRoute>
    ),
    children: [
      {
        path: ":resultadoId",
        element: <LabAppointmentUpload />,
      },
    ],
  },
];

export default analisisRoutes;