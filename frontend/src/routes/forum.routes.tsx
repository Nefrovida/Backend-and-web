import Forums from "@/components/page/Forums";
import ReplyMessage from "@/components/page/ReplyMessage";
import { RouteObject } from "react-router-dom";

const forumRoutes: RouteObject[] = [
  {
    path: "foro/:forumId?",
    element: <Forums />,
  },
  {
    path: "foro/:forumId/mensaje/:messageId",
    element: <ReplyMessage />,
  },
];

export default forumRoutes;
