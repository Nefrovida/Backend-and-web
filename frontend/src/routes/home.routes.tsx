import App from "../App";
import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "../components/page/NotFoundPage";
import Login from "../components/page/Login";
import Register from "../components/page/Register";
import analisisRoutes from "./analisis.routes";
import forumsRoutes from "./forums.routes";
import secretariaRoutes from "./secretaria.routes";
import Home from "../components/page/Home";
import AddPatientToForumPage from "../components/page/add_patient_to_forum_page";
import notesRoutes from "./notes.routes";
import expedienteRoutes from "./expediente.routes";

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
      ...notesRoutes,
      ...forumsRoutes,
      ...secretariaRoutes,
      ...expedienteRoutes,
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
  element: <AddPatientToForumPage />
  },
]);

export default router;
