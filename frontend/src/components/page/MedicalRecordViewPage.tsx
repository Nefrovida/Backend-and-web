import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMedicalRecord } from "../../hooks/useMedicalRecord";
import Title from "../atoms/Title";

type TabType = "info" | "appointments" | "notes" | "analysis" | "history" | "reports";

const MedicalRecordViewPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { data, loading, error } = useMedicalRecord(patientId);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("info");

  // Derive backend origin from Vite env or default to http://localhost:3001
  const API_BASE = (import.meta as any).env?.VITE_APP_API_URL || "http://localhost:3001/api";
  const BACKEND_ORIGIN = API_BASE.replace(/\/api$/, "");

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando expediente...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6 max-w-md">
          <h2 className="text-red-800 text-lg font-semibold mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">No se encontró el expediente</p>
        </div>
      </div>
    );
  }

  const {
    patient,
    appointments = [],
    notes = [],
    analysis = [],
    clinicalHistory = [],
    reports = [],
  } = data as any;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  function getFullPath(path: string | null | undefined) {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path; // full URL already
    if (path.startsWith("/")) return `${BACKEND_ORIGIN}${path}`; // relative path to backend
    return `${BACKEND_ORIGIN}/${path}`; // other relative path
  }

  const tabs = [
    { id: "info" as TabType, label: "Información", count: null },
    { id: "appointments" as TabType, label: "Citas", count: appointments.length },
    { id: "notes" as TabType, label: "Notas", count: notes.length },
    { id: "analysis" as TabType, label: "Análisis", count: analysis.length },
    { id: "history" as TabType, label: "Historial Clínico", count: clinicalHistory.length },
    { id: "reports" as TabType, label: "Reportes", count: reports.length },
  ];

  return (
    <div className="w-full min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Title>Expediente Médico</Title>
        </div>
        
        {/* Patient Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-3">
                {patient.user.name} {patient.user.parent_last_name}{" "}
                {patient.user.maternal_last_name}
              </h2>
              <div className="text-gray-600 space-y-1 text-sm">
                <p><span className="font-semibold">CURP:</span> {patient.curp}</p>
                <p><span className="font-semibold">Teléfono:</span> {patient.user.phone_number}</p>
                <p>
                  <span className="font-semibold">Fecha de nacimiento:</span> {formatDate(patient.user.birthday)}
                </p>
                <p><span className="font-semibold">Género:</span> {patient.user.gender}</p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/expediente/${patientId}/edit`)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
            >
              Editar
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-t-lg shadow-sm border border-gray-200 border-b-0">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-6 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-primary text-primary bg-blue-50"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab.label}
                {tab.count !== null && tab.count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id 
                      ? "bg-primary text-white" 
                      : "bg-gray-200 text-gray-700"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-lg shadow-sm border border-gray-200 p-6 min-h-[400px]">
          
          {/* Info Tab */}
          {activeTab === "info" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-primary mb-4">Información del Paciente</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Nombre Completo</p>
                  <p className="text-gray-900">
                    {patient.user.name} {patient.user.parent_last_name} {patient.user.maternal_last_name}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-1">CURP</p>
                  <p className="text-gray-900">{patient.curp}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Teléfono</p>
                  <p className="text-gray-900">{patient.user.phone_number}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Fecha de Nacimiento</p>
                  <p className="text-gray-900">{formatDate(patient.user.birthday)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Género</p>
                  <p className="text-gray-900">{patient.user.gender}</p>
                </div>
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === "appointments" && (
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">Citas</h2>
              {appointments.length > 0 ? (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.patient_appointment_id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2 pb-2 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">
                          {appointment.appointment.name}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4 ${
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
                <p className="text-gray-500 text-center py-8">No hay citas registradas</p>
              )}
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === "notes" && (
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">
                Notas Clínicas
              </h2>
              {notes.length > 0 ? (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {notes.map((note) => (
                    <div
                      key={note.note_id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                    >
                      {note.title && (
                        <h3 className="font-semibold text-gray-900 mb-2 pb-2 border-b border-gray-200">
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
                <p className="text-gray-500 text-center py-8">No hay notas clínicas registradas</p>
              )}
            </div>
          )}

          {/* Analysis Tab */}
          {activeTab === "analysis" && (
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">
                Análisis de Laboratorio
              </h2>
              {analysis.length > 0 ? (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {analysis.map((item) => (
                    <div
                      key={item.patient_analysis_id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2 pb-2 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">
                          {item.analysis.name}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4 ${
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
                      {item.results && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Resultado:
                          </p>
                          <div className="bg-white p-2 rounded mb-2 border border-gray-200">
                            <p className="text-sm text-gray-600">
                              Fecha: {formatDate(item.results.date)}
                            </p>
                            {item.results.interpretation && (
                              <p className="text-sm text-gray-600">
                                Interpretación: {item.results.interpretation}
                              </p>
                            )}
                            {item.results.path ? (
                            <div className="flex gap-3 items-center mt-2">
                              <a
                                href={getFullPath(item.results.path)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary text-sm hover:underline"
                              >
                                Abrir en pestaña
                              </a>
                              <button
                                type="button"
                                onClick={() => {
                                  const url = getFullPath(item.results.path);
                                  setPdfUrl(url);
                                  setPdfOpen(Boolean(url));
                                }}
                                className="text-xs px-2 py-1 rounded bg-light-blue hover:bg-opacity-80 transition-colors"
                              >
                                Vista previa
                              </button>
                              <a
                                href={getFullPath(item.results.path)}
                                download
                                className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
                              >
                                Descargar
                              </a>
                            </div>
                            ) : (
                              <span className="text-xs text-slate-500">Sin archivo</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No hay análisis registrados</p>
              )}
            </div>
          )}

        {/* PDF Preview Modal */}
        {pdfOpen && pdfUrl && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setPdfOpen(false)}
          >
            <div
              className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-2 border-b">
                <h3 className="text-sm font-semibold text-primary">Vista previa PDF</h3>
                <div className="flex items-center gap-2">
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline px-2 py-1">Abrir en pestaña</a>
                  <a href={pdfUrl} download className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors">Descargar</a>
                  <button
                    onClick={() => setPdfOpen(false)}
                    className="text-sm px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
              <iframe
                src={pdfUrl}
                title="Vista previa PDF"
                className="w-full h-full"
              />
            </div>
          </div>
        )}

          {/* Clinical History Tab */}
          {activeTab === "history" && (
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">
                Historial Clínico
              </h2>
              {clinicalHistory.length > 0 ? (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {clinicalHistory.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-sm font-semibold text-gray-900 mb-2">
                        {item.question.description}
                      </p>
                      <p className="text-gray-600">{item.answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No hay historial clínico registrado
                </p>
              )}
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">Reportes</h2>
              {reports.length > 0 ? (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {reports.map((report) => (
                    <div
                      key={report.report_id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2 pb-2 border-b border-gray-200">
                        <p className="text-gray-900 font-semibold">{report.cause}</p>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4 ${
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
              ) : (
                <p className="text-gray-500 text-center py-8">No hay reportes registrados</p>
              )}
            </div>
          )}

        </div>

        {/* PDF Preview Modal */}
        {pdfOpen && pdfUrl && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setPdfOpen(false)}
          >
            <div
              className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-2 border-b">
                <h3 className="text-sm font-semibold text-primary">Vista previa PDF</h3>
                <div className="flex items-center gap-2">
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline px-2 py-1">Abrir en pestaña</a>
                  <a href={pdfUrl} download className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors">Descargar</a>
                  <button
                    onClick={() => setPdfOpen(false)}
                    className="text-sm px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
              <iframe
                src={pdfUrl}
                title="Vista previa PDF"
                className="w-full h-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecordViewPage;
