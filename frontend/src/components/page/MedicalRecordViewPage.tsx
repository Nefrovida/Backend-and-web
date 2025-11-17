import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMedicalRecord } from "../../hooks/useMedicalRecord";

const MedicalRecordViewPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { data, loading, error } = useMedicalRecord(patientId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando expediente...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 text-lg font-semibold mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No se encontró el expediente</p>
      </div>
    );
  }

  const { patient, appointments, notes, analysis, clinicalHistory, reports } = data;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {patient.user.name} {patient.user.parent_last_name}{" "}
                {patient.user.maternal_last_name}
              </h1>
              <div className="text-gray-600 space-y-1">
                <p>CURP: {patient.curp}</p>
                <p>Teléfono: {patient.user.phone_number}</p>
                <p>
                  Fecha de nacimiento: {formatDate(patient.user.birthday)}
                </p>
                <p>Género: {patient.user.gender}</p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/expediente/${patientId}/edit`)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Editar
            </button>
          </div>
        </div>

        {/* Appointments Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Citas</h2>
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.patient_appointment_id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">
                      {appointment.appointment.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        appointment.appointment_status === "completed"
                          ? "bg-green-100 text-green-800"
                          : appointment.appointment_status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {appointment.appointment_status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    Fecha: {formatDate(appointment.date_hour)}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Doctor: {appointment.appointment.doctor.user.name}{" "}
                    {appointment.appointment.doctor.user.parent_last_name}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Especialidad: {appointment.appointment.doctor.specialty}
                  </p>
                  {appointment.place && (
                    <p className="text-gray-600 text-sm">
                      Lugar: {appointment.place}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay citas registradas</p>
          )}
        </div>

        {/* Notes Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Notas Clínicas
          </h2>
          {notes.length > 0 ? (
            <div className="space-y-4">
              {notes.map((note) => (
                <div
                  key={note.note_id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  {note.title && (
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {note.title}
                    </h3>
                  )}
                  <p className="text-gray-600 text-sm mb-2">
                    Fecha: {formatDate(note.creation_date)}
                  </p>
                  {note.general_notes && (
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-700">
                        Notas generales:
                      </p>
                      <p className="text-gray-600">{note.general_notes}</p>
                    </div>
                  )}
                  {note.ailments && (
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-700">
                        Padecimientos:
                      </p>
                      <p className="text-gray-600">{note.ailments}</p>
                    </div>
                  )}
                  {note.prescription && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Receta:
                      </p>
                      <p className="text-gray-600">{note.prescription}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay notas clínicas registradas</p>
          )}
        </div>

        {/* Analysis Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Análisis de Laboratorio
          </h2>
          {analysis.length > 0 ? (
            <div className="space-y-4">
              {analysis.map((item) => (
                <div
                  key={item.patient_analysis_id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">
                      {item.analysis.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        item.analysis_status === "completed"
                          ? "bg-green-100 text-green-800"
                          : item.analysis_status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.analysis_status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    Fecha de análisis: {formatDate(item.analysis_date)}
                  </p>
                  {item.results_date && (
                    <p className="text-gray-600 text-sm mb-2">
                      Fecha de resultados: {formatDate(item.results_date)}
                    </p>
                  )}
                  {item.laboratorist && (
                    <p className="text-gray-600 text-sm mb-2">
                      Laboratorista: {item.laboratorist.user.name}{" "}
                      {item.laboratorist.user.parent_last_name}
                    </p>
                  )}
                  {item.analysis.description && (
                    <p className="text-gray-600 text-sm mb-2">
                      {item.analysis.description}
                    </p>
                  )}
                  {item.results.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Resultados:
                      </p>
                      {item.results.map((result) => (
                        <div
                          key={result.result_id}
                          className="bg-gray-50 p-2 rounded mb-2"
                        >
                          <p className="text-sm text-gray-600">
                            Fecha: {formatDate(result.date)}
                          </p>
                          {result.interpretation && (
                            <p className="text-sm text-gray-600">
                              Interpretación: {result.interpretation}
                            </p>
                          )}
                          <a
                            href={result.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-sm hover:underline"
                          >
                            Ver archivo
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay análisis registrados</p>
          )}
        </div>

        {/* Clinical History Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Historial Clínico
          </h2>
          {clinicalHistory.length > 0 ? (
            <div className="space-y-3">
              {clinicalHistory.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-3">
                  <p className="text-sm font-medium text-gray-700">
                    {item.question.description}
                  </p>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              No hay historial clínico registrado
            </p>
          )}
        </div>

        {/* Reports Section */}
        {reports.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Reportes</h2>
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.report_id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-gray-800 font-medium">{report.cause}</p>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        report.status === "resolved"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Fecha: {formatDate(report.date)}
                  </p>
                  {report.reported_message && (
                    <p className="text-gray-600 text-sm mt-2">
                      {report.reported_message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecordViewPage;
