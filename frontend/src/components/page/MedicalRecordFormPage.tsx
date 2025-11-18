import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ClinicalHistoryFormSection from "../organism/medical-record/ClinicalHistoryFormSection";
import LabResultsSection from "../organism/medical-record/LabResultsSection";
import { useMedicalRecord } from "../../hooks/useMedicalRecord";
import { clinicalHistoryService } from "../../services/clinicalHistory.service";
import Title from "../atoms/Title";
import {
  LabResultFormData,
  ClinicalHistoryAnswer,
} from "../../types/expediente.types";
import { FaChevronRight, FaChevronLeft, FaSave, FaCheck, FaFileMedical, FaVial } from "react-icons/fa";

const MedicalRecordFormPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();
  const [currentSection, setCurrentSection] = useState(0);

  // Fetch existing medical record data if editing
  const { data: existingData, loading } = useMedicalRecord(patientId);

  const [clinicalHistory, setClinicalHistory] = useState<ClinicalHistoryAnswer[]>([]);
  const [labResult, setLabResult] = useState<LabResultFormData>({});

  const sections = [
    {
      title: "Historial Clínico",
      icon: FaFileMedical,
      description: "Antecedentes y evaluación inicial",
      component: (
        <ClinicalHistoryFormSection
          patientId={patientId}
          data={clinicalHistory}
          onChange={(data) => setClinicalHistory(data)}
        />
      ),
    },
    {
      title: "Resultados de Laboratorio",
      icon: FaVial,
      description: "Registro de análisis y pruebas",
      component: (
        <LabResultsSection
          data={labResult}
          onChange={(data) => setLabResult({ ...labResult, ...data })}
          existingAnalysis={existingData?.analysis || []}
          patientId={patientId}
        />
      ),
    },
  ];

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!patientId) {
        alert("Error: No se proporcionó el ID del paciente");
        return;
      }

      // Submit clinical history answers if any
      if (clinicalHistory && clinicalHistory.length > 0) {
        await clinicalHistoryService.submitRiskForm(patientId, clinicalHistory);
      }

      // Note: PDFs are uploaded individually using the "Subir PDF" button on each analysis
      navigate(`/expediente/${patientId}`);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar el historial clínico");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Cargando formulario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-y-auto bg-gray-50/50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {existingData ? "Editar Expediente Médico" : "Crear Expediente Médico"}
          </h1>
          <p className="text-gray-500 mt-2">
            Complete la información requerida en cada sección para actualizar el expediente.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          {/* Progress Stepper */}
          <div className="bg-gray-50/80 border-b border-gray-200 p-6 md:p-8">
            <div className="flex items-center justify-center md:justify-between max-w-3xl mx-auto relative">
              {/* Connecting Line */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0 transform -translate-y-1/2 hidden md:block rounded-full"></div>
              <div
                className="absolute top-1/2 left-0 h-1 bg-primary -z-0 transform -translate-y-1/2 hidden md:block rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${(currentSection / (sections.length - 1)) * 100}%` }}
              ></div>

              {sections.map((section, index) => {
                const Icon = section.icon;
                const isActive = index === currentSection;
                const isCompleted = index < currentSection;

                return (
                  <div key={index} className="flex flex-col items-center relative z-10 bg-gray-50 px-2 md:px-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 shadow-sm ${isActive
                        ? "bg-primary text-white scale-110 ring-4 ring-blue-100"
                        : isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-white text-gray-400 border-2 border-gray-200"
                        }`}
                    >
                      {isCompleted ? <FaCheck /> : <Icon className="text-lg" />}
                    </div>
                    <div className="mt-3 text-center hidden md:block">
                      <p className={`text-sm font-bold transition-colors ${isActive ? "text-primary" : "text-gray-500"}`}>
                        {section.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 max-w-[120px] mx-auto">
                        {section.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Step Title */}
            <div className="md:hidden text-center mt-6">
              <p className="text-sm font-bold text-primary uppercase tracking-wider">Paso {currentSection + 1} de {sections.length}</p>
              <h3 className="text-xl font-bold text-gray-900 mt-1">{sections[currentSection].title}</h3>
            </div>
          </div>

          {/* Current Section Content */}
          <div className="p-6 md:p-10 min-h-[400px]">
            <div className="animate-fadeIn">
              {sections[currentSection].component}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="bg-gray-50 px-6 md:px-10 py-6 border-t border-gray-200 flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentSection === 0}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${currentSection === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm hover:shadow"
                }`}
            >
              <FaChevronLeft className="text-sm" />
              Anterior
            </button>

            {currentSection < sections.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-2.5 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg font-medium"
              >
                Siguiente
                <FaChevronRight className="text-sm" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-8 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg font-medium"
              >
                <FaSave />
                Guardar Expediente
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordFormPage;
