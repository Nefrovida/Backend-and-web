import Dashboard from "../App";
import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "../components/page/NotFoundPage";
import homeRoutes from "./home.routes";
import authRoutes from "./auth.routes";
import doctorsRoutes from "./doctors.routes";
import patientsRoutes from "./patients.routes";
import analisisRoutes from "./analisis.routes";
import forumsRoutes from "./forums.routes"; // admin
import forumRoutes from "./forum.routes"; // chat
import notesRoutes from "./notes.routes";
import appointmentsRoutes from "./appointments.routes";
import agendaRoutes from "./agenda.routes";
import secretariaRoutes from "./secretaria.routes";
import adminRoutes from "./admin.routes";
import expedienteRoutes from "./expediente.routes";
import profileRoutes from "./profile.routes";

import ProtectedRoute from "../components/common/ProtectedRoute";
import GenericDashboard from "@/components/organism/GenericDashboard";

const router = createBrowserRouter([
  ...authRoutes,
  ...patientsRoutes,
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "",
        element: <GenericDashboard />,
      },
      ...analisisRoutes,
      ...forumsRoutes, // admin
      ...forumRoutes, // chat
      ...notesRoutes,
      ...appointmentsRoutes,
      ...agendaRoutes,
      ...secretariaRoutes,
      ...expedienteRoutes,
      ...profileRoutes,
      ...adminRoutes,
      ...doctorsRoutes,
    ],
  },
  ...homeRoutes,
]);

export default router;
