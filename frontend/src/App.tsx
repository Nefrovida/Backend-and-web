import { Outlet } from "react-router-dom";
import Navbar from "./components/organism/Navbar";

function App() {
  return (
    <div className="bg-gray-200 min-h-screen">
      <Navbar>
        <Outlet />
      </Navbar>
    </div>
  );
}

export default App;