import Home from "../components/page/Home";
import { RouterType } from "./types";

// Routing component:
// @path: String, La ruta en la que se carga el componente principal
// @component: ReactNode, Componente que se va a cargar
// @childRoutes: RouterType[], para componentes anidados que cambian su
// estructura dependiendo la ruta
export const homeRoute: RouterType[] = [
  {
    path: "/",
    component: <Home />,
  },
];
