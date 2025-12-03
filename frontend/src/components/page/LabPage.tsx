import { Outlet } from "react-router";
import ListResults from "../organism/lab/ListResults";

function LabPage() {
  return (
    <section className="flex w-full">
      <ListResults />
      <Outlet />
    </section>
  );
}

export default LabPage;
