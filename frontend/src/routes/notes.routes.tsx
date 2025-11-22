import Notes from "@/components/page/Notes";
import NotesListPage from "@/components/page/NotesListPage";
import { RouteObject } from "react-router-dom";

const notesRoutes: RouteObject[] = [
  {
    path: "notas",
    element: <Notes />,
  },
  {
    path: "patients/:patientId/notes",
    element: <NotesListPage />,
  },
];

export default notesRoutes;
