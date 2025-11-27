import React, { useState, useEffect } from "react";
import { Doctor, AppointmentRequest } from "../../../types/appointment";
import { agendaService } from "../../../services/agenda.service";

interface Props {
  selectedRequest: AppointmentRequest | null;
  onScheduleComplete: () => void;
}

const AppointmentScheduleForm: React.FC<Props> = ({ selectedRequest, onScheduleComplete }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadDoctors();
    if (selectedRequest) {
      const requestDate = new Date(selectedRequest.requested_date);
      const dateStr = requestDate.toISOString().split('T')[0];
      setSelectedDate(dateStr);
    }
  }, [selectedRequest]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      loadAvailability();
    } else {
      setAvailableSlots([]);
      setSelectedTime("");
    }
  }, [selectedDoctor, selectedDate]);

  const loadDoctors = async () => {
    try {
      const doctorsList = await agendaService.getDoctors();
      setDoctors(doctorsList);
    } catch (error) {
      console.error("Error loading doctors:", error);
      setError("Error al cargar los doctores");
    }
  };

  const loadAvailability = async () => {
    if (!selectedDoctor || !selectedDate) return;

    setLoadingSlots(true);
    setError("");
    try {
      const slots = await agendaService.getDoctorAvailability(selectedDoctor, selectedDate);
      
      // If the selected date is the same as the requested date, sort slots by proximity to requested time
      let sortedSlots = slots;
      if (selectedRequest) {
        const requestDate = new Date(selectedRequest.requested_date);
        const requestDateStr = requestDate.toISOString().split('T')[0];
        if (selectedDate === requestDateStr) {
          const requestedTime = `${requestDate.getHours().toString().padStart(2, '0')}:${requestDate.getMinutes().toString().padStart(2, '0')}`;
          
          sortedSlots = slots.sort((a, b) => {
            const timeA = a.split(':').map(Number);
            const timeB = b.split(':').map(Number);
            const reqTime = requestedTime.split(':').map(Number);
            
            const diffA = Math.abs((timeA[0] * 60 + timeA[1]) - (reqTime[0] * 60 + reqTime[1]));
            const diffB = Math.abs((timeB[0] * 60 + timeB[1]) - (reqTime[0] * 60 + reqTime[1]));
            
            return diffA - diffB;
          });
        }
      }
      
      setAvailableSlots(sortedSlots);
      setSelectedTime("");
    } catch (error) {
      console.error("Error loading availability:", error);
      setError("Error al cargar la disponibilidad");
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSchedule = async () => {
    if (!selectedRequest || !selectedDoctor || !selectedDate || !selectedTime) {
      return;
    }

    setLoading(true);
    setError("");
    try {
      const [hours, minutes] = selectedTime.split(":");
      const dateTime = new Date(selectedDate);
      dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      await agendaService.scheduleAppointment({
        patientAppointmentId: selectedRequest.patient_appointment_id,
        doctorId: selectedDoctor,
        dateHour: dateTime.toISOString(),
        duration: selectedRequest.duration,
        appointmentType: selectedRequest.appointment_type,
        place: selectedRequest.appointment_type === "PRESENCIAL" ? "Consultorio" : undefined,
      });

      setShowConfirmation(false);
      setShowSuccess(true);
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      setError("Error al agendar la cita");
      setShowConfirmation(false);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedDoctor("");
    setSelectedDate("");
    setAvailableSlots([]);
    setSelectedTime("");
    setError("");
  };

  const handleConfirm = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      setError("Por favor complete todos los campos");
      return;
    }
    setShowConfirmation(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    resetForm();
    onScheduleComplete();
  };

  const selectedDoctorInfo = doctors.find((d) => d.doctor_id === selectedDoctor);

  if (!selectedRequest) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          Selecciona una solicitud de cita para comenzar
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-white">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Patient Info Header */}
      <div className="mb-6 pb-4 border-b-2 border-gray-200">
        <h2 className="text-2xl font-semibold text-primary mb-2">
          Agendando cita para: {selectedRequest.patient_name}
        </h2>
        <p className="text-gray-600">
          {selectedRequest.appointment_name} - {selectedRequest.appointment_type}
        </p>
        {/* Prominent Requested Date Banner */}
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center text-blue-800">
            <span className="font-semibold text-sm mr-2">FECHA SOLICITADA:</span>
            <span className="font-medium text-base">
              {new Date(selectedRequest.requested_date).toLocaleString('es-MX')}
            </span>
          </div>
        </div>
      </div>

      {!showConfirmation ? (
        <div className="space-y-6">
          {/* Doctor Selection */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Seleccionar Doctor
            </label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            >
              <option value="">-- Selecciona un doctor --</option>
              {doctors.map((doctor) => (
                <option key={doctor.doctor_id} value={doctor.doctor_id}>
                  {doctor.name} - {doctor.specialty}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Seleccionar Fecha
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            />
            {selectedDate && selectedRequest && selectedDate !== new Date(selectedRequest.requested_date).toISOString().split('T')[0] && (
              <div className="mt-2 p-2 bg-orange-100 border border-orange-300 rounded-md">
                <p className="text-orange-800 text-sm">
                  ⚠️ La fecha seleccionada es diferente a la solicitada por el paciente
                </p>
              </div>
            )}
          </div>

          {/* Time Slots */}
          {selectedDoctor && selectedDate && (
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Horarios Disponibles
              </label>
              {loadingSlots ? (
                <p className="text-gray-500">Cargando horarios...</p>
              ) : availableSlots.length === 0 ? (
                <p className="text-gray-500">No hay horarios disponibles para esta fecha</p>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`p-3 border-2 rounded-lg font-medium transition-all ${
                        selectedTime === slot
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              onClick={resetForm}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Limpiar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedDoctor || !selectedDate || !selectedTime}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Confirmar Cita
            </button>
          </div>
        </div>
      ) : null}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              ¿Estás seguro?
            </h3>
            
            <div className="bg-gray-50 p-6 rounded-lg space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Paciente:</span>
                <span>{selectedRequest.patient_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Doctor:</span>
                <span>{selectedDoctorInfo?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Especialidad:</span>
                <span>{selectedDoctorInfo?.specialty}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Fecha solicitada:</span>
                <span className="text-blue-600 font-semibold">{new Date(selectedRequest.requested_date).toLocaleString('es-MX')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Fecha agendada:</span>
                <span>{new Date(selectedDate).toLocaleDateString("es-MX")}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Hora:</span>
                <span>{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Duración:</span>
                <span>{selectedRequest.duration} minutos</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Tipo:</span>
                <span>{selectedRequest.appointment_type}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmation(false)}
                disabled={loading}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSchedule}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? "Agendando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              ¡Cita Agendada!
            </h3>
            <p className="text-gray-600 mb-6">
              La cita se ha agendado exitosamente
            </p>
            <button
              onClick={handleSuccessClose}
              className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentScheduleForm;
