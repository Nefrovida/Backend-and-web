import { Routes, Route, BrowserRouter } from "react-router";
import { RouterType } from "./routes/types";
import { homeRoute } from "./routes/home.routes";

// Create a dynamic routing tree based on the route file structure:
// @routeTree: {path: String, component: React-component, childRoutes?:
// routeTree}
// @return: Route component
function dynamicRouting(routeTree: RouterType[]) {
  return routeTree.map((route: RouterType, i) => {
    return route.childRoutes ? (
      <Route key={i + 1} path={route.path} element={route.component}>
        {dynamicRouting(route.childRoutes)}
      </Route>
    ) : (
      <Route key={i + 1} path={route.path} element={route.component} />
    );
  });
}

function App() {
  return (
    // Crea rutas de manera dinámica a partir a partir de objeto RouterType[]
    <BrowserRouter>
      <Routes>{dynamicRouting(homeRoute)}</Routes>
    </BrowserRouter>
  );
}

export default App;
