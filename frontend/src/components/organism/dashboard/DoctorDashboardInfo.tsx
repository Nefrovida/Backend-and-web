import StatCard from "@/components/molecules/StatCard";
import React, { useEffect, useState } from "react";
import { FaClipboardCheck, FaRegFolder } from "react-icons/fa";
import { IoFlaskOutline } from "react-icons/io5";

const DoctorDashboardInfo = () => {
  const [appointments, setAppointments] = useState<number>(0);
  const [active, setActive] = useState<number>(0);
  const [pending, setPending] = useState<number>(0);

  useEffect(() => {
    fetch("/api/update-dashboard/doctor")
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data.appointments);
        setActive(data.active);
        setPending(data.pending);
      })
      .catch();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        label="Citas Hoy"
        value={appointments}
        icon={<FaClipboardCheck size={24} />}
        color="blue"
      />
      <StatCard
        label="Expedientes Activos"
        value={active}
        icon={<FaRegFolder size={24} />}
        color="green"
      />
      <StatCard
        label="Resultados Pendientes"
        value={pending}
        icon={<IoFlaskOutline size={24} />}
        color="orange"
      />
    </div>
  );
};

export default DoctorDashboardInfo;
