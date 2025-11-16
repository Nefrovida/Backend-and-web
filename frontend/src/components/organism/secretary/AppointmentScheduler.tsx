// src/components/organism/secretary/AppointmentScheduler.tsx
import { FC } from "react";
import DoctorSelector from "../../molecules/secretary/DoctorSelector";
import DateSelector from "../../molecules/secretary/DateSelector";
import TimeSlotGrid from "../../molecules/secretary/TimeSlotGrid";
import { MdCheckCircle } from "react-icons/md";

interface Appointment {
  patient_appointment_id: number;
  patient_name: string;
  patient_parent_last_name: string;
  patient_maternal_last_name: string;
  appointment_type: string;
}

interface Doctor {
  user_id: string;
  name: string;
  parent_last_name: string;
  maternal_last_name: string;
}

interface AppointmentSchedulerProps {
  selectedAppointment: Appointment | null;
  doctors: Doctor[];
  selectedDoctor: string | null;
  selectedDate: string;
  selectedTime: string;
  availableSlots: string[];
  loading: boolean;
  onDoctorChange: (doctorId: string) => void;
  onDateChange: (date: string) => void;
  onTimeSelect: (time: string) => void;
  onSchedule: () => void;
}

const AppointmentScheduler: FC<AppointmentSchedulerProps> = ({
  selectedAppointment,
  doctors,
  selectedDoctor,
  selectedDate,
  selectedTime,
  availableSlots,
  loading,
  onDoctorChange,
  onDateChange,
  onTimeSelect,
  onSchedule,
}) => {
  if (!selectedAppointment) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50">
        <div className="text-center text-slate-400">
          <MdCheckCircle className="text-6xl mx-auto mb-4" />
          <p className="text-lg">Selecciona una cita de la lista para comenzar</p>
        </div>
      </div>
    );
  }

  const canSchedule = selectedDoctor && selectedDate && selectedTime && !loading;

  return (
    <div className="w-full h-full p-10 overflow-y-auto bg-white">
      <h2 className="text-4xl font-bold text-slate-800 mb-8">
        Agendar Cita
      </h2>
      
      <div className="bg-gradient-to-r from-[#F0FBFF] to-[#E8F8FF] border-l-4 border-[#9AE5FB] p-6 mb-10 rounded-lg shadow-sm">
          <p className="text-sm text-slate-600 mb-1">Paciente</p>
          <p className="text-lg font-semibold text-slate-900">
            {selectedAppointment.patient_name} {selectedAppointment.patient_parent_last_name}{" "}
            {selectedAppointment.patient_maternal_last_name}
          </p>
          <p className="text-sm text-slate-600 mt-1">
            Tipo: <span className="font-medium">{selectedAppointment.appointment_type}</span>
          </p>
        </div>

        <div className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <DoctorSelector
            doctors={doctors}
            selectedDoctor={selectedDoctor}
            onDoctorChange={onDoctorChange}
          />

          {selectedDoctor && (
            <DateSelector selectedDate={selectedDate} onDateChange={onDateChange} />
          )}
        </div>

        {selectedDoctor && selectedDate && (
          <TimeSlotGrid
            availableSlots={availableSlots}
            selectedTime={selectedTime}
            onTimeSelect={onTimeSelect}
          />
        )}

        {selectedTime && (
          <button
            onClick={onSchedule}
            disabled={!canSchedule}
            className={[
              "w-full py-5 px-8 rounded-lg text-lg font-semibold text-white transition-all shadow-md",
              canSchedule
                ? "bg-gradient-to-r from-[#9AE5FB] to-[#8ADDFB] hover:from-[#8ADDFB] hover:to-[#7AD5FA] hover:shadow-lg"
                : "bg-slate-300 cursor-not-allowed",
            ].join(" ")}
          >
            {loading ? "Agendando..." : "Confirmar Cita"}
          </button>
        )}
      </div>
    </div>
  );
};

export default AppointmentScheduler;
