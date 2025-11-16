import App from "../App";
import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "../components/page/NotFoundPage";
import Login from "../components/page/Login";
import Register from "../components/page/Register";
import analisisRoutes from "./analisis.routes";
import forumsRoutes from "./forums.routes";
import Home from "../components/page/Home";
import AddPatientToForumPage from "../components/page/add_patient_to_forum_page";
import notesRoutes from "./notes.routes";
import LandingPage from "../components/page/LandingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/", // ruta raíz
        element: <Home />,
      },
      {
        path: "landing", // 👈 aquí defines /landing
        element: <LandingPage />,
      },
      ...analisisRoutes,
      ...notesRoutes,
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
  {
    path: "/forums/:forumId/add-patient",
    element: <AddPatientToForumPage />,
  },
]);

export default router;