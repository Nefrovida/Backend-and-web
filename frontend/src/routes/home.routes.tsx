import App from "../App";
import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "../components/page/NotFoundPage";
import Login from "../components/page/Login";
import Register from "../components/page/Register";
import analisisRoutes from "./analisis.routes";
import forumsRoutes from "./forums.routes";
import Home from "../components/page/Home";

const router = createBrowserRouter([
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
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default router;
