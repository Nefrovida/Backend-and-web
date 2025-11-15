import { RouteObject } from "react-router-dom";
import LabPage from "../components/page/LabPage";
import LabResults from "../components/organism/lab/LabResults";
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
