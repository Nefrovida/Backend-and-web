import AddPatientToForumPage from "@/components/page/add_patient_to_forum_page";
import { RouteObject } from "react-router-dom";

const patientsRoutes: RouteObject[] = [
  {
    path: "forums/:forumId/add-patient",
    element: <AddPatientToForumPage />,
  },
];

export default patientsRoutes;