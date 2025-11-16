// src/components/molecules/secretary/DoctorSelector.tsx
import type { FC } from "react";
import { FaUserDoctor } from "react-icons/fa6";

interface Doctor {
  user_id: string;
  name: string;
  parent_last_name: string;
  maternal_last_name: string;
}

interface DoctorSelectorProps {
  doctors: Doctor[];
  selectedDoctor: string | null;
  onDoctorChange: (doctorId: string) => void;
}

const DoctorSelector: FC<DoctorSelectorProps> = ({
  doctors,
  selectedDoctor,
  onDoctorChange,
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        <FaUserDoctor className="inline mr-2 text-[#9AE5FB]" />
        Seleccionar Doctor
      </label>
      <select
        value={selectedDoctor || ""}
        onChange={(e) => onDoctorChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 bg-white text-slate-900 focus:border-[#9AE5FB] focus:outline-none transition-colors"
      >
        <option value="" disabled>
          -- Selecciona un doctor --
        </option>
        {doctors.map((doctor) => (
          <option key={doctor.user_id} value={doctor.user_id}>
            Dr. {doctor.name} {doctor.parent_last_name} {doctor.maternal_last_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DoctorSelector;
