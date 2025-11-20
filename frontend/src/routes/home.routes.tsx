import App from "../App";
import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "../components/page/NotFoundPage";
import Login from "../components/page/Login";
import Register from "../components/page/Register";
import analisisRoutes from "./analisis.routes";
import forumsRoutes from "./forums.routes";
import historyRoutes  from './history.routes';
import Home from "@/components/page/Home";
import { RouteObject } from "react-router-dom";

const homeRoutes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      ...analisisRoutes,
      ...forumsRoutes,
      ...historyRoutes,
    ],
    element: <Home />,
  },
];

export default homeRoutes;