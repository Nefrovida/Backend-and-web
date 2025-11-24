import patient from "@/types/patient";
import React, { FC } from "react";

interface Props {
  patients: patient[];
  handlePatientChange: (string) => void;
}

const PatientSelector: FC<Props> = ({ patients, handlePatientChange }) => {
  return (
    <div className="flex-1 w-full sm:w-auto">
      <label
        htmlFor="patient"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Seleccionar paciente
      </label>
      <select
        name="patient"
        id="patient"
        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        onChange={(e) => {
          handlePatientChange(e.target.value);
        }}
        defaultValue=""
      >
        <option value="" disabled>
          Elige un paciente...
        </option>
        {patients.map((patient, idx) => {
          const patientName =
            patient.name +
            " " +
            patient.parentalLastName +
            " " +
            patient.maternalLastName;
          return (
            <option value={patient.userId} key={idx}>
              {patientName}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default PatientSelector;
