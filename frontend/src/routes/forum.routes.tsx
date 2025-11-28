import Forums from "@/components/page/Forums";
import { RouteObject } from "react-router-dom";

const forumRoutes: RouteObject[] = [
  {
    path: "foro/:forumId?",
    element: <Forums />,
  },
];

export default forumRoutes;
