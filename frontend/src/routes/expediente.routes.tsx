import MedicalRecordViewPage from "../components/page/MedicalRecordViewPage";
import MedicalRecordFormPage from "../components/page/MedicalRecordFormPage";

const expedienteRoutes = [
  {
    path: "/expediente/:patientId",
    element: <MedicalRecordViewPage />,
  },
  {
    path: "/expediente/new/:patientId",
    element: <MedicalRecordFormPage />,
  },
  {
    path: "/expediente/:patientId/edit",
    element: <MedicalRecordFormPage />,
  },
];

export default expedienteRoutes;
