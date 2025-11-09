import App from "../App";
import { createBrowserRouter } from "react-router";
import NotFoundPage from "../components/page/NotFoundPage";
import analisisRoutes from "./analisis.routes";
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
    ],
  },
]);

export default router;
