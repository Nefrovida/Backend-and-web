import React, { useState, useEffect } from "react";
import { Doctor, Patient } from "../../../types/appointment";
import { agendaService } from "../../../services/agenda.service";

interface Props {
  onAppointmentCreated: () => void;
}

const DirectAppointmentForm: React.FC<Props> = ({ onAppointmentCreated }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [appointmentType, setAppointmentType] = useState<'PRESENCIAL' | 'VIRTUAL'>('PRESENCIAL');
  const [duration, setDuration] = useState<number>(45);
  const [place, setPlace] = useState<string>("Consultorio");
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    loadPatients();
    loadDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      loadAvailability();
    } else {
      setAvailableSlots([]);
      setSelectedTime("");
    }
  }, [selectedDoctor, selectedDate]);

  const loadPatients = async () => {
    try {
      const patientsList = await agendaService.getAllPatients();
      setPatients(patientsList);
    } catch (error) {
      console.error("Error loading patients:", error);
      setError("Error al cargar los pacientes");
    }
  };

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
      setAvailableSlots(slots);
      setSelectedTime("");
    } catch (error) {
      console.error("Error loading availability:", error);
      setError("Error al cargar la disponibilidad");
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleCreateAppointment = async () => {
    if (!selectedPatient || !selectedDoctor || !selectedDate || !selectedTime) {
      return;
    }

    setLoading(true);
    setError("");
    try {
      const [hours, minutes] = selectedTime.split(":");
      const dateTime = new Date(selectedDate);
      dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      await agendaService.createAppointment({
        patientId: selectedPatient,
        doctorId: selectedDoctor,
        dateHour: dateTime.toISOString(),
        duration,
        appointmentType,
        place: appointmentType === "PRESENCIAL" ? place : undefined,
      });

      setShowConfirmation(false);
      setShowSuccess(true);
    } catch (error) {
      console.error("Error creating appointment:", error);
      setError("Error al crear la cita");
      setShowConfirmation(false);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedPatient("");
    setSelectedDoctor("");
    setSelectedDate("");
    setAvailableSlots([]);
    setSelectedTime("");
    setAppointmentType("PRESENCIAL");
    setDuration(45);
    setPlace("Consultorio");
    setSearchTerm("");
    setError("");
  };

  const handleConfirm = () => {
    if (!selectedPatient || !selectedDoctor || !selectedDate || !selectedTime) {
      setError("Por favor complete todos los campos");
      return;
    }
    setShowConfirmation(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    resetForm();
    onAppointmentCreated();
  };

  const selectedPatientInfo = patients.find((p) => p.patient_id === selectedPatient);
  const selectedDoctorInfo = doctors.find((d) => d.doctor_id === selectedDoctor);

  const filteredPatients = patients.filter(patient =>
    patient.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 bg-white overflow-y-auto">
      <h2 className="text-2xl font-semibold text-primary mb-6">
        Nueva Cita
      </h2>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {!showConfirmation ? (
        <div className="space-y-6">
          {/* Patient Selection */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Seleccionar Paciente
            </label>
            <input
              type="text"
              placeholder="Buscar paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 mb-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            />
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            >
              <option value="">-- Selecciona un paciente --</option>
              {filteredPatients.map((patient) => (
                <option key={patient.patient_id} value={patient.patient_id}>
                  {patient.full_name} {patient.phone_number ? `- ${patient.phone_number}` : ''}
                </option>
              ))}
            </select>
          </div>

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

          {/* Appointment Type */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Tipo de Cita
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="PRESENCIAL"
                  checked={appointmentType === 'PRESENCIAL'}
                  onChange={(e) => setAppointmentType(e.target.value as 'PRESENCIAL')}
                  className="mr-2"
                />
                <span>Presencial</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="VIRTUAL"
                  checked={appointmentType === 'VIRTUAL'}
                  onChange={(e) => setAppointmentType(e.target.value as 'VIRTUAL')}
                  className="mr-2"
                />
                <span>Virtual</span>
              </label>
            </div>
          </div>

          {/* Place (only for PRESENCIAL) */}
          {appointmentType === 'PRESENCIAL' && (
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Lugar
              </label>
              <input
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
          )}

          {/* Duration */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Duración (minutos)
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            >
              <option value={30}>30 minutos</option>
              <option value={45}>45 minutos</option>
              <option value={60}>60 minutos</option>
              <option value={90}>90 minutos</option>
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
              disabled={!selectedPatient || !selectedDoctor || !selectedDate || !selectedTime}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Crear Cita
            </button>
          </div>
        </div>
      ) : null}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              ¿Confirmar nueva cita?
            </h3>
            
            <div className="bg-gray-50 p-6 rounded-lg space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Paciente:</span>
                <span>{selectedPatientInfo?.full_name}</span>
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
                <span className="font-medium text-gray-700">Fecha:</span>
                <span>{new Date(selectedDate).toLocaleDateString("es-MX")}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Hora:</span>
                <span>{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Duración:</span>
                <span>{duration} minutos</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Tipo:</span>
                <span>{appointmentType}</span>
              </div>
              {appointmentType === 'PRESENCIAL' && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Lugar:</span>
                  <span>{place}</span>
                </div>
              )}
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
                onClick={handleCreateAppointment}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? "Creando..." : "Confirmar"}
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
              ¡Cita Creada!
            </h3>
            <p className="text-gray-600 mb-6">
              La cita se ha creado exitosamente
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

export default DirectAppointmentForm;
