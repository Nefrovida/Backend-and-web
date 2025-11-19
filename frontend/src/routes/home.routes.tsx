import Home from "@/components/page/Home";
import { RouteObject } from "react-router-dom";

const homeRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
];

export default homeRoutes;