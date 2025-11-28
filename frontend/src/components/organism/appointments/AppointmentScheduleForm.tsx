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
  const [allSlots, setAllSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadDoctors();
    if (selectedRequest) {
      // Parse date components to avoid timezone issues
      const requestDate = new Date(selectedRequest.requested_date);
      const year = requestDate.getFullYear();
      const month = requestDate.getMonth() + 1;
      const day = requestDate.getDate();
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
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
      const availableSlotsData = await agendaService.getDoctorAvailability(selectedDoctor, selectedDate);
      console.log('Available slots received:', availableSlotsData); // Debug log
      
      // Generate all possible time slots (8 AM to 6 PM, every 30 minutes)
      const allSlots: string[] = [];
      const workStart = 8; // 8 AM
      const workEnd = 18; // 6 PM
      
      for (let hour = workStart; hour < workEnd; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const slotString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
          allSlots.push(slotString);
        }
      }
      
      // Set available slots from API
      setAvailableSlots(availableSlotsData || []);
      setAllSlots(allSlots);
      setSelectedTime("");
    } catch (error) {
      console.error("Error loading availability:", error);
      setError("Error al cargar la disponibilidad");
      setAvailableSlots([]);
      setAllSlots([]);
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
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const [year, month, day] = selectedDate.split('-').map(Number);
      
      // Create date string directly without Date object to avoid timezone issues
      // Format: YYYY-MM-DDTHH:MM:00 (no timezone suffix - server will interpret as local)
      const dateHourString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
      
      await agendaService.scheduleAppointment({
        patientAppointmentId: selectedRequest.patient_appointment_id,
        doctorId: selectedDoctor,
        dateHour: dateHourString,
        duration: selectedRequest.duration,
        appointmentType: selectedRequest.appointment_type,
        place: selectedRequest.appointment_type === "PRESENCIAL" ? "Consultorio" : undefined,
      });

      setShowConfirmation(false);
      setShowSuccess(true);
      // Refresh availability after successful appointment scheduling with a small delay
      if (selectedDoctor && selectedDate) {
        setTimeout(() => {
          loadAvailability();
        }, 500); // Small delay to ensure backend transaction is complete
      }
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      // Extract the actual error message from backend response
      let errorMessage = "Error al agendar la cita";
      if ((error as any)?.message) {
        // Check for specific backend error messages and translate them
        const backendMessage = (error as any).message;
        if (backendMessage.includes("Doctor has a conflicting appointment")) {
          errorMessage = "El doctor ya tiene una cita programada en ese horario";
        } else if (backendMessage.includes("Patient has a conflicting appointment")) {
          errorMessage = "El paciente ya tiene una cita programada en ese horario";
        } else if (backendMessage.includes("must be in the future")) {
          errorMessage = "La fecha y hora de la cita deben ser en el futuro";
        } else if (backendMessage.includes("No appointment type found")) {
          errorMessage = "No se pudo encontrar el tipo de cita para este doctor";
        } else if (backendMessage.includes("Doctor not found")) {
          errorMessage = "Doctor no encontrado";
        } else if (backendMessage.includes("Patient not found")) {
          errorMessage = "Paciente no encontrado";
        } else if (backendMessage.includes("Invalid date") || backendMessage.includes("Invalid time")) {
          errorMessage = "Fecha u hora inválida";
        } else if (backendMessage.includes("Time slot is not available")) {
          errorMessage = "El horario seleccionado no está disponible";
        } else {
          // Use the backend message directly if it's user-friendly, otherwise keep generic
          errorMessage = backendMessage.length > 10 && !backendMessage.includes("Error:") ? backendMessage : "Error al agendar la cita";
        }
      }
      setError(errorMessage);
      setShowConfirmation(false);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedDoctor("");
    setSelectedDate("");
    setAvailableSlots([]);
    setAllSlots([]);
    setSelectedTime("");
    setError("");
  };

  const handleConfirm = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      setError("Por favor complete todos los campos");
      return;
    }

    // Parse date components to avoid timezone issues
    const [year, month, day] = selectedDate.split('-').map(Number);
    const selectedDateObj = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDateObj < today) {
      setError("No se puede agendar citas en fechas pasadas");
      return;
    }

    // If date is today, validate time is in the future
    if (selectedDateObj.toDateString() === today.toDateString()) {
      const [hours, minutes] = selectedTime.split(":");
      const selectedTimeObj = new Date();
      selectedTimeObj.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      if (selectedTimeObj <= new Date()) {
        setError("La hora seleccionada debe ser en el futuro");
        return;
      }
    }

    setShowConfirmation(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    resetForm();
    onScheduleComplete();
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
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
    <div className="flex-1 p-4 bg-white overflow-y-auto">
      {/* Error Message */}
      {error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Patient Info Header */}
      <div className="mb-4 pb-3 border-b-2 border-gray-200">
        <h2 className="text-xl font-semibold text-primary mb-2">
          Agendando cita para: {selectedRequest.patient_name}
        </h2>
        <p className="text-gray-600 text-sm">
          {selectedRequest.appointment_name} - {selectedRequest.appointment_type}
        </p>
        {/* Prominent Requested Date Banner */}
        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center text-blue-800">
            <span className="font-semibold text-xs mr-1">FECHA SOLICITADA:</span>
            <span className="font-medium text-sm">
              {new Date(selectedRequest.requested_date).toLocaleString('es-MX')}
            </span>
          </div>
        </div>
      </div>

      {!showConfirmation ? (
        <div className="space-y-3">
          {/* Doctor Selection */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1">
              Seleccionar Doctor
            </label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
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
            <label className="block text-base font-medium text-gray-700 mb-1">
              Seleccionar Fecha
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            />
            {selectedDate && selectedRequest && selectedDate !== (() => {
              const requestDate = new Date(selectedRequest.requested_date);
              const year = requestDate.getFullYear();
              const month = requestDate.getMonth() + 1;
              const day = requestDate.getDate();
              return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            })() && (
              <div className="mt-1 p-2 bg-orange-100 border border-orange-300 rounded-md">
                <p className="text-orange-800 text-xs">
                  ⚠️ La fecha seleccionada es diferente a la solicitada por el paciente
                </p>
              </div>
            )}
          </div>

          {/* Time Slots */}
          {selectedDoctor && selectedDate && (
            <div>
              <label className="block text-base font-medium text-gray-700 mb-1">
                Horarios Disponibles
              </label>
              {loadingSlots ? (
                <p className="text-gray-500 text-sm">Cargando horarios...</p>
              ) : allSlots.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay horarios disponibles para esta fecha</p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {allSlots.map((slot) => {
                    const isAvailable = availableSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        onClick={() => isAvailable && setSelectedTime(slot)}
                        disabled={!isAvailable}
                        className={`p-2 border-2 rounded-lg font-medium text-sm transition-all ${
                          !isAvailable
                            ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed opacity-60"
                            : selectedTime === slot
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                        }`}
                        title={isAvailable ? "Horario disponible" : "Horario ocupado"}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              )}
              {allSlots.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  Los horarios en gris están ocupados
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              onClick={resetForm}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
            >
              Limpiar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedDoctor || !selectedDate || !selectedTime}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Confirmar Cita
            </button>
          </div>
        </div>
      ) : null}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              ¿Estás seguro?
            </h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Paciente:</span>
                <span>{selectedRequest.patient_name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Doctor:</span>
                <span>{selectedDoctorInfo?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Especialidad:</span>
                <span>{selectedDoctorInfo?.specialty}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Fecha solicitada:</span>
                <span className="text-blue-600 font-semibold">{new Date(selectedRequest.requested_date).toLocaleString('es-MX')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Fecha agendada:</span>
                <span>{formatDate(selectedDate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Hora:</span>
                <span>{selectedTime}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Duración:</span>
                <span>{selectedRequest.duration} minutos</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Tipo:</span>
                <span>{selectedRequest.appointment_type}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                disabled={loading}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleSchedule}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
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
