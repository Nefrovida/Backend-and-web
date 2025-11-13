import Notas from "@/components/page/Notas";
import { RouteObject } from "react-router-dom";

const notesRoutes: RouteObject[] = [
  {
    path: "/notas",
    element: <Notas />,
  },
];

export default notesRoutes;