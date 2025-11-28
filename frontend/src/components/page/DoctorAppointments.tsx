import { DoctorAppointmentsController } from "../../controller/doctorAppointments.controller";

function DoctorAppointments() {
  return (
    <div className="w-full min-h-screen p-2">
      <h1 className="text-3xl font-semibold mb-4">Mis Citas</h1>
      <DoctorAppointmentsController />
    </div>
  );
}

export default DoctorAppointments;
