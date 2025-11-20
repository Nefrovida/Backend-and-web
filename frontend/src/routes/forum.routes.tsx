import ForumPage from "@/components/page/ForumPage";
import Forums from "@/components/page/Forums";
import { RouteObject } from "react-router-dom";

const forumRoutes: RouteObject[] = [
  {
    path: "foro",
    element: <Forums />,
    children: [
      {
        path: ":foroId",
        element: <ForumPage />,
      },
    ],
  },
];

export default forumRoutes;
