import Login from "@/components/page/Login";
import Register from "@/components/page/Register";
import { RouteObject } from "react-router-dom";

const authRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
];

export default authRoutes;