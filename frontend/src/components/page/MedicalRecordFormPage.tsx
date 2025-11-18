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
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
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
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando expediente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Title>{existingData ? "Editar Expediente Médico" : "Crear Expediente Médico"}</Title>
          <p className="text-gray-600 text-sm mt-2">
            Sección {currentSection + 1} de {sections.length}: {sections[currentSection].title}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {sections.map((section, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      index <= currentSection
                        ? "bg-primary text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < sections.length - 1 && (
                    <div
                      className={`h-1 w-20 mx-2 transition-colors ${
                        index < currentSection ? "bg-primary" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Current Section Content */}
          <div className="mb-8">{sections[currentSection].component}</div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentSection === 0}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                currentSection === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Anterior
            </button>

            {currentSection < sections.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center px-6 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                Siguiente
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Guardar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordFormPage;
