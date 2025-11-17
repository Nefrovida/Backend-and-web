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
    // Only Admin (1) and Secretaria (6) can access the analysis types manager
    path: "/analisis",
    element: (
      <ProtectedRoute allowedRoles={[1, 6]}>
        <AnalysisManager />
      </ProtectedRoute>
    ),
  },
  {
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