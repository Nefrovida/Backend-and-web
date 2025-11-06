import { Outlet } from "react-router";
import ListaResultados from "../organism/lab/ListaResultados";

function LabPage() {
  return (
    <section className="flex w-full">
      <ListaResultados />
      <Outlet />
    </section>
  );
}

export default LabPage;
