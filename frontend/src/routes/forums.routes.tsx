import ForumsPage from "@/components/page/ForumsPage";
import { RouteObject } from "react-router-dom";

const forumsRoutes: RouteObject[] = [
  {
    path: "foros",
    element: <ForumsPage />,
  },
];

export default forumsRoutes;
