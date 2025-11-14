import { RouteObject } from "react-router";
import AppointmentsPage from "../components/page/AppointmentsPage";

const appointmentsRoutes: RouteObject[] = [
    {
        path: "/citas",
        element: <AppointmentsPage />,
    },
];

export default appointmentsRoutes;