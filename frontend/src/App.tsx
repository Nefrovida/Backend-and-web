import { Outlet } from "react-router";
import Navbar from "./components/organism/Navbar";

function App() {
  return (
    <main className="bg-gray-200">
      <Navbar>
        <Outlet />
      </Navbar>
    </main>
  );
}

export default App;
