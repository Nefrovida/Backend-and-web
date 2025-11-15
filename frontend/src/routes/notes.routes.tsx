import Notas from "@/components/page/Notas";
import NotesListPage from "@/components/page/NotesListPage";
import { RouteObject } from "react-router-dom";

const notesRoutes: RouteObject[] = [
  {
    path: "/notas",
    element: <Notas />,
  },
  {
    path: "/patients/:patientId/notes",
    element: <NotesListPage />,
  },
];

export default notesRoutes;