import MedicalRecordViewPage from "../components/page/MedicalRecordViewPage";
import MedicalRecordFormPage from "../components/page/MedicalRecordFormPage";
import ExpedientesListPage from "../components/page/ExpedientesListPage";

const expedienteRoutes = [
  {
    path: "expedientes",
    element: <ExpedientesListPage />,
  },
  {
    path: "expediente/:patientId",
    element: <MedicalRecordViewPage />,
  },
  {
    path: "expediente/new/:patientId",
    element: <MedicalRecordFormPage />,
  },
  {
    path: "expediente/:patientId/edit",
    element: <MedicalRecordFormPage />,
  },
];

export default expedienteRoutes;
