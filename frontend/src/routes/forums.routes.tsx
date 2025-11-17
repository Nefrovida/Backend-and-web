import { RouteObject } from "react-router-dom";
import ForumsPage from "../pages/Forums/ForumsPage";

const forumsRoutes: RouteObject[] = [
  {
    path: "/foros",
    element: <ForumsPage />,
  },
];

export default forumsRoutes;
