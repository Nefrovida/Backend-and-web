import { RouteObject } from "react-router-dom";
import Agenda from "../components/page/Agenda";

const agendaRoutes : RouteObject[] = [
    {
        path: "/agenda",
        element: <Agenda/>,
        
    },
];

export default agendaRoutes;