import React, { useState, useEffect } from "react";
import { Doctor, Patient } from "../../../types/appointment";
import { agendaService } from "../../../services/agenda.service";

interface Props {
  onAppointmentCreated: () => void;
  initialPatientId?: string;
}

const DirectAppointmentForm: React.FC<Props> = ({ onAppointmentCreated, initialPatientId }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [appointmentType, setAppointmentType] = useState<'PRESENCIAL' | 'VIRTUAL'>('PRESENCIAL');
  const [duration, setDuration] = useState<number>(45);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string>("");
  const [patientSearchTerm, setPatientSearchTerm] = useState<string>("");
  const [doctorSearchTerm, setDoctorSearchTerm] = useState<string>("");
  const [showPatientDropdown, setShowPatientDropdown] = useState<boolean>(false);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState<boolean>(false);

  useEffect(() => {
    loadPatients();
    loadDoctors();
  }, []);

  useEffect(() => {
    if (initialPatientId && Array.isArray(patients) && patients.length > 0) {
      const exists = patients.find(p => p.patient_id === initialPatientId);
      if (exists) setSelectedPatient(initialPatientId);
    }
  }, [initialPatientId, patients]);

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
    setPatientSearchTerm("");
    setDoctorSearchTerm("");
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

  const selectedPatientInfo = Array.isArray(patients) ? patients.find((p) => p.patient_id === selectedPatient) : undefined;
  const selectedDoctorInfo = Array.isArray(doctors) ? doctors.find((d) => d.doctor_id === selectedDoctor) : undefined;

  const filteredPatients = Array.isArray(patients) ? (
    patientSearchTerm
      ? patients.filter(patient =>
          patient.full_name.toLowerCase().includes(patientSearchTerm.toLowerCase())
        )
      : patients.slice(0, 10)
  ) : [];

  const filteredDoctors = Array.isArray(doctors) ? (
    doctorSearchTerm
      ? doctors.filter(doctor =>
          (doctor.name.toLowerCase().includes(doctorSearchTerm.toLowerCase()) ||
           doctor.specialty.toLowerCase().includes(doctorSearchTerm.toLowerCase()))
        )
      : doctors.slice(0, 10)
  ) : [];

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient.patient_id);
    setPatientSearchTerm(patient.full_name);
    setShowPatientDropdown(false);
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor.doctor_id);
    setDoctorSearchTerm(`${doctor.name} - ${doctor.specialty}`);
    setShowDoctorDropdown(false);
  };

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
          <div className="relative">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Seleccionar Paciente
            </label>
            <input
              type="text"
              placeholder="Buscar paciente por nombre..."
              value={patientSearchTerm}
              onChange={(e) => {
                setPatientSearchTerm(e.target.value);
                setShowPatientDropdown(true);
                if (!e.target.value) setSelectedPatient("");
              }}
              onFocus={() => setShowPatientDropdown(true)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            />
            {showPatientDropdown && filteredPatients.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.patient_id}
                    onClick={() => handlePatientSelect(patient)}
                    className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-200 last:border-b-0"
                  >
                    <div className="font-medium text-gray-800">{patient.full_name}</div>
                    {patient.phone_number && (
                      <div className="text-sm text-gray-600">{patient.phone_number}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {showPatientDropdown && patientSearchTerm && filteredPatients.length === 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-3">
                <p className="text-gray-500 text-center">No se encontraron pacientes</p>
              </div>
            )}
          </div>

          {/* Doctor Selection */}
          <div className="relative">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Seleccionar Doctor
            </label>
            <input
              type="text"
              placeholder="Buscar doctor por nombre o especialidad..."
              value={doctorSearchTerm}
              onChange={(e) => {
                setDoctorSearchTerm(e.target.value);
                setShowDoctorDropdown(true);
                if (!e.target.value) setSelectedDoctor("");
              }}
              onFocus={() => setShowDoctorDropdown(true)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            />
            {showDoctorDropdown && filteredDoctors.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredDoctors.map((doctor) => (
                  <div
                    key={doctor.doctor_id}
                    onClick={() => handleDoctorSelect(doctor)}
                    className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-200 last:border-b-0"
                  >
                    <div className="font-medium text-gray-800">{doctor.name}</div>
                    <div className="text-sm text-gray-600">{doctor.specialty}</div>
                  </div>
                ))}
              </div>
            )}
            {showDoctorDropdown && doctorSearchTerm && filteredDoctors.length === 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-3">
                <p className="text-gray-500 text-center">No se encontraron doctores</p>
              </div>
            )}
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
