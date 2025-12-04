import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMedicalRecord } from "../../hooks/useMedicalRecord";
import { API_BASE_URL } from "../../config/api.config";
import Title from "../atoms/Title";
import {
  FaUserCircle,
  FaCalendarAlt,
  FaStickyNote,
  FaVial,
  FaFileMedicalAlt,
  FaExclamationTriangle,
  FaEdit,
  FaPhone,
  FaIdCard,
  FaVenusMars,
  FaBirthdayCake,
} from "react-icons/fa";

type TabType = "info" | "appointments" | "notes" | "analysis" | "history" | "reports";

const MedicalRecordViewPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("info");

  // Get medical record data from hook
  const { data, loading, error } = useMedicalRecord(patientId || "");

  // Derive backend origin from API_BASE_URL
  const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api$/, "");

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Cargando expediente...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg border border-red-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-red-500 text-2xl" />
          </div>
          <h2 className="text-red-800 text-xl font-bold mb-2">Error al cargar</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-lg font-medium"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center max-w-md">
          <p className="text-gray-600 text-lg">No se encontró el expediente</p>
          <button
            onClick={() => navigate("/dashboard/expedientes")}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all"
          >
            Volver a la lista
          </button>
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
    { id: "info" as TabType, label: "Información", icon: FaUserCircle, count: null },
    { id: "appointments" as TabType, label: "Citas", icon: FaCalendarAlt, count: appointments.length },
    { id: "notes" as TabType, label: "Notas", icon: FaStickyNote, count: notes.length },
    { id: "analysis" as TabType, label: "Análisis", icon: FaVial, count: analysis.length },
    { id: "history" as TabType, label: "Historial", icon: FaFileMedicalAlt, count: clinicalHistory.length },
    { id: "reports" as TabType, label: "Reportes", icon: FaExclamationTriangle, count: reports.length },
  ];

  return (
    <div className="w-full h-screen overflow-y-auto bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Expediente Médico</h1>
            <p className="text-gray-500 mt-1">Visualiza y gestiona la información del paciente</p>
          </div>
          <button
            onClick={() => navigate(`/dashboard/expediente/${patientId}/edit`)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all shadow-sm hover:shadow-md font-medium"
          >
            <FaEdit />
            <span>Editar Expediente</span>
          </button>
        </div>

        {/* Patient Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 border-2 border-blue-100">
                <span className="text-2xl font-bold text-primary">
                  {patient.user.name.charAt(0)}{patient.user.parent_last_name.charAt(0)}
                </span>
              </div>

              <div className="flex-1 w-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {patient.user.name} {patient.user.parent_last_name} {patient.user.maternal_last_name}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="p-2 bg-white rounded-md shadow-sm text-blue-500">
                      <FaIdCard />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase">CURP</p>
                      <p className="text-sm font-semibold text-gray-900 truncate" title={patient.curp}>{patient.curp}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="p-2 bg-white rounded-md shadow-sm text-blue-500">
                      <FaPhone />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase">Teléfono</p>
                      <p className="text-sm font-semibold text-gray-900">{patient.user.phone_number}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="p-2 bg-white rounded-md shadow-sm text-blue-500">
                      <FaBirthdayCake />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase">Nacimiento</p>
                      <p className="text-sm font-semibold text-gray-900">{formatDate(patient.user.birthday)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="p-2 bg-white rounded-md shadow-sm text-blue-500">
                      <FaVenusMars />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase">Género</p>
                      <p className="text-sm font-semibold text-gray-900">{patient.user.gender}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px] flex flex-col">
          <div className="border-b border-gray-200 bg-gray-50/50 px-2 pt-2">
            <div className="flex overflow-x-auto hide-scrollbar gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-3.5 font-medium text-sm transition-all rounded-t-lg relative group ${activeTab === tab.id
                      ? "bg-white text-primary shadow-[0_-1px_2px_rgba(0,0,0,0.05)] border-t border-x border-gray-200 z-10"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50 border-transparent"
                      }`}
                    style={{ marginBottom: "-1px" }}
                  >
                    <Icon className={`text-lg ${activeTab === tab.id ? "text-primary" : "text-gray-400 group-hover:text-gray-600"}`} />
                    <span className="whitespace-nowrap">{tab.label}</span>
                    {tab.count !== null && tab.count > 0 && (
                      <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === tab.id
                        ? "bg-blue-50 text-primary"
                        : "bg-gray-200 text-gray-600"
                        }`}>
                        {tab.count}
                      </span>
                    )}
                    {activeTab === tab.id && (
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8 flex-1 bg-white">

            {/* Info Tab */}
            {activeTab === "info" && (
              <div className="animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FaUserCircle className="text-primary" />
                  Información Detallada
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Nombre Completo</p>
                    <p className="text-lg font-medium text-gray-900">
                      {patient.user.name} {patient.user.parent_last_name} {patient.user.maternal_last_name}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">CURP</p>
                    <p className="text-lg font-medium text-gray-900 font-mono">{patient.curp}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Teléfono de Contacto</p>
                    <p className="text-lg font-medium text-gray-900">{patient.user.phone_number}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Fecha de Nacimiento</p>
                    <p className="text-lg font-medium text-gray-900">{formatDate(patient.user.birthday)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Género</p>
                    <p className="text-lg font-medium text-gray-900">{patient.user.gender}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === "appointments" && (
              <div className="animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FaCalendarAlt className="text-primary" />
                  Historial de Citas
                </h3>
                {appointments.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.patient_appointment_id}
                        className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all hover:border-blue-200 group"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                          <div>
                            <h4 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                              {appointment.appointment.name}
                            </h4>
                            <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                              <FaCalendarAlt className="text-gray-400" />
                              {formatDate(appointment.date_hour)}
                            </p>
                          </div>
                          <span
                            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${appointment.appointment_status === "completed"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : appointment.appointment_status === "pending"
                                ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                                : "bg-gray-100 text-gray-700 border border-gray-200"
                              }`}
                          >
                            {appointment.appointment_status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                          <div>
                            <p className="text-xs text-gray-500 font-medium uppercase mb-1">Doctor</p>
                            <p className="text-sm text-gray-900 font-medium">
                              {appointment.appointment.doctor.user.name} {appointment.appointment.doctor.user.parent_last_name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">{appointment.appointment.doctor.specialty}</p>
                          </div>
                          {appointment.place && (
                            <div>
                              <p className="text-xs text-gray-500 font-medium uppercase mb-1">Lugar</p>
                              <p className="text-sm text-gray-900">{appointment.place}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <FaCalendarAlt className="mx-auto text-4xl text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">No hay citas registradas</p>
                  </div>
                )}
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === "notes" && (
              <div className="animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FaStickyNote className="text-primary" />
                  Notas Clínicas
                </h3>
                {notes.length > 0 ? (
                  <div className="space-y-6">
                    {notes.map((note) => (
                      <div
                        key={note.note_id}
                        className="bg-yellow-50/50 border border-yellow-100 rounded-xl p-6 hover:shadow-md transition-all relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-lg font-bold text-gray-900">
                            {note.title || "Nota sin título"}
                          </h4>
                          <span className="text-xs font-medium text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full">
                            {formatDate(note.creation_date)}
                          </span>
                        </div>

                        <div className="space-y-4">
                          {note.general_notes && (
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase mb-1">Notas Generales</p>
                              <p className="text-gray-700 leading-relaxed">{note.general_notes}</p>
                            </div>
                          )}

                          {note.ailments && (
                            <div className="bg-white/50 p-3 rounded-lg border border-yellow-100/50">
                              <p className="text-xs font-bold text-gray-500 uppercase mb-1">Padecimientos</p>
                              <p className="text-gray-700">{note.ailments}</p>
                            </div>
                          )}

                          {note.prescription && (
                            <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100/50">
                              <p className="text-xs font-bold text-blue-600 uppercase mb-1">Receta / Tratamiento</p>
                              <p className="text-gray-700">{note.prescription}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <FaStickyNote className="mx-auto text-4xl text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">No hay notas clínicas registradas</p>
                  </div>
                )}
              </div>
            )}

            {/* Analysis Tab */}
            {activeTab === "analysis" && (
              <div className="animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FaVial className="text-primary" />
                  Análisis de Laboratorio
                </h3>
                {analysis.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {analysis.map((item) => (
                      <div
                        key={item.patient_analysis_id}
                        className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all hover:border-blue-200"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-primary rounded-lg">
                              <FaVial />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">
                                {item.analysis.name}
                              </h4>
                              <p className="text-xs text-gray-500">
                                Solicitado: {formatDate(item.analysis_date)}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${item.analysis_status === "completed"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : item.analysis_status === "pending"
                                ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                                : "bg-gray-100 text-gray-700 border border-gray-200"
                              }`}
                          >
                            {item.analysis_status}
                          </span>
                        </div>

                        <div className="space-y-3">
                          {item.analysis.description && (
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                              {item.analysis.description}
                            </p>
                          )}

                          {item.results && (
                            <div className="mt-4 bg-blue-50/30 rounded-xl p-4 border border-blue-100">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <p className="text-sm font-bold text-gray-900">Resultados</p>
                                <span className="text-xs text-gray-500 ml-auto">
                                  {formatDate(item.results.date)}
                                </span>
                              </div>

                              {item.results.interpretation && (
                                <div className="mb-4">
                                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">Interpretación</p>
                                  <p className="text-sm text-gray-700">{item.results.interpretation}</p>
                                </div>
                              )}

                              {item.results.path ? (
                                <div className="flex flex-wrap gap-3 mt-3">
                                  <button
                                    onClick={() => {
                                      const url = getFullPath(item.results.path);
                                      setPdfUrl(url);
                                      setPdfOpen(Boolean(url));
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium shadow-sm"
                                  >
                                    <FaFileMedicalAlt className="text-primary" />
                                    Vista previa
                                  </button>
                                  <a
                                    href={getFullPath(item.results.path)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium shadow-sm"
                                  >
                                    Abrir en pestaña
                                  </a>
                                  <a
                                    href={getFullPath(item.results.path)}
                                    download
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all text-sm font-medium shadow-sm ml-auto"
                                  >
                                    Descargar PDF
                                  </a>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-gray-400 text-sm italic bg-white p-2 rounded border border-dashed border-gray-200">
                                  <FaExclamationTriangle />
                                  Sin archivo adjunto
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <FaVial className="mx-auto text-4xl text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">No hay análisis registrados</p>
                  </div>
                )}
              </div>
            )}

            {/* Clinical History Tab */}
            {activeTab === "history" && (
              <div className="animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FaFileMedicalAlt className="text-primary" />
                  Historial Clínico
                </h3>
                {clinicalHistory.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {clinicalHistory.map((item, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all">
                        <p className="text-sm font-bold text-gray-900 mb-3 flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          {item.question.description}
                        </p>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <p className="text-gray-700 text-sm">{item.answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <FaFileMedicalAlt className="mx-auto text-4xl text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">No hay historial clínico registrado</p>
                  </div>
                )}
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === "reports" && (
              <div className="animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FaExclamationTriangle className="text-primary" />
                  Reportes
                </h3>
                {reports.length > 0 ? (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div
                        key={report.report_id}
                        className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all border-l-4 border-l-red-500"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-lg font-bold text-gray-900">{report.cause}</h4>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${report.status === "resolved"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                              }`}
                          >
                            {report.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                          <FaCalendarAlt />
                          {formatDate(report.date)}
                        </p>
                        {report.reported_message && (
                          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                            {report.reported_message}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <FaExclamationTriangle className="mx-auto text-4xl text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">No hay reportes registrados</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* PDF Preview Modal */}
        {pdfOpen && pdfUrl && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
            onClick={() => setPdfOpen(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-5xl h-[85vh] flex flex-col animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FaFileMedicalAlt className="text-primary" />
                  Vista previa del documento
                </h3>
                <div className="flex items-center gap-3">
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-primary font-medium transition-colors"
                  >
                    Abrir en nueva pestaña
                  </a>
                  <button
                    onClick={() => setPdfOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-gray-100 p-1">
                <iframe
                  src={pdfUrl}
                  title="Vista previa PDF"
                  className="w-full h-full rounded-b-xl"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecordViewPage;
