import Login from "@/components/page/Login";
import Register from "@/components/page/Register";
import PublicRoute from "../components/common/PublicRoute";
import { RouteObject } from "react-router-dom";

const authRoutes: RouteObject[] = [
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
];

export default authRoutes;