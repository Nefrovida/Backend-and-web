import App from "../App";
import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "../components/page/NotFoundPage";
import Login from "../components/page/Login";
import Register from "../components/page/Register";
import analisisRoutes from "./analisis.routes";
import forumsRoutes from "./forums.routes";
import agendaRoutes from "./agenda.routes";
import secretariaRoutes from "./secretaria.routes";

import Home from "../components/page/Home";
import AddPatientToForumPage from "../components/page/add_patient_to_forum_page";
import notesRoutes from "./notes.routes";
import appointmentsRoutes from "./appointments.routes";
import RegisterDoctorPage from "../components/page/RegisterDoctorpage";
import DoctorsListPage from "../components/page/DoctorsListPage";
import expedienteRoutes from "./expediente.routes";

// Module routes
import analisisRoutes from "./analisis.routes";
import forumsRoutes from "./forums.routes";      // admin
import forumRoutes from "./forum.routes";       // chat
import notesRoutes from "./notes.routes";
import appointmentsRoutes from "./appointments.routes";
import agendaRoutes from "./agenda.routes";
import secretariaRoutes from "./secretaria.routes";
import adminRoutes from "./admin.routes";

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

      // Modules
      ...analisisRoutes,
      ...forumsRoutes, // admin
      ...forumRoutes, // chat
      ...notesRoutes,
      ...appointmentsRoutes,
      ...agendaRoutes,
      ...secretariaRoutes,
      ...expedienteRoutes,
     
     
      ...adminRoutes,

      {
        path: "/register-doctor",
        element: <RegisterDoctorPage />,
      },
      {
        path: "/doctors",
        element: <DoctorsListPage />,
      },
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