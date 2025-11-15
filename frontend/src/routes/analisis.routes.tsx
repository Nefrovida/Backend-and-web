import { RouteObject } from "react-router-dom";
import LabPage from "../components/page/LabPage";
import LabResults from "../components/organism/lab/LabResults";
import AnalysisManager from "../components/page/AnalysisManager";
import ProtectedRoute from "../components/common/ProtectedRoute";
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
    // Analysis manager must not be a child of /laboratorio
    path: "/analisis",
    element: (
      <ProtectedRoute>
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
