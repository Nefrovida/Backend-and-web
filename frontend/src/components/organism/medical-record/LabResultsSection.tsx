import React, { useState, useEffect } from "react";
import { LabResultFormData } from "../../../types/expediente.types";
import { MedicalRecordAnalysis } from "../../../types/expediente.types";
import { expedienteService } from "../../../services/expediente.service";

interface Props {
  data: LabResultFormData;
  onChange: (data: Partial<LabResultFormData>) => void;
  existingAnalysis?: MedicalRecordAnalysis[];
  patientId?: string;
}

interface AnalysisWithUpload extends MedicalRecordAnalysis {
  uploadFile?: File;
  uploadInterpretation?: string;
  uploading?: boolean;
  uploadSuccess?: boolean;
  uploadError?: string;
}

const LabResultsSection: React.FC<Props> = ({ 
  data, 
  onChange, 
  existingAnalysis = [],
  patientId 
}) => {
  const [analysisItems, setAnalysisItems] = useState<AnalysisWithUpload[]>(existingAnalysis);

  // Derive backend origin from Vite env or default to production API
  const API_BASE = (import.meta as any).env?.VITE_APP_API_URL || "https://www.snefrovidaac.com/api";
  const BACKEND_ORIGIN = API_BASE.replace(/\/api$/, "");

  function getFullPath(path: string | null | undefined) {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path; // full URL already
    if (path.startsWith("/")) return `${BACKEND_ORIGIN}${path}`; // relative path to backend
    return `${BACKEND_ORIGIN}/${path}`; // other relative path
  }

  useEffect(() => {
    setAnalysisItems(existingAnalysis);
  }, [existingAnalysis]);

  const handleFileSelect = (analysisId: string, file: File | null) => {
    setAnalysisItems(prev => 
      prev.map(item => 
        item.patient_analysis_id === analysisId 
          ? { ...item, uploadFile: file || undefined, uploadSuccess: false, uploadError: undefined }
          : item
      )
    );
  };

  const handleInterpretationChange = (analysisId: string, interpretation: string) => {
    setAnalysisItems(prev => 
      prev.map(item => 
        item.patient_analysis_id === analysisId 
          ? { ...item, uploadInterpretation: interpretation }
          : item
      )
    );
  };

  const handleUpload = async (analysis: AnalysisWithUpload) => {
    if (!analysis.uploadFile || !patientId) {
      console.error("Missing file or patientId", { uploadFile: analysis.uploadFile, patientId });
      return;
    }

    console.log("Starting upload for analysis", {
      patientAnalysisId: analysis.patient_analysis_id,
      fileName: analysis.uploadFile.name,
      patientId
    });

    setAnalysisItems(prev => 
      prev.map(item => 
        item.patient_analysis_id === analysis.patient_analysis_id 
          ? { ...item, uploading: true, uploadError: undefined, uploadSuccess: false }
          : item
      )
    );

    try {
      const result = await expedienteService.uploadAnalysisPDF({
        patientId,
        patientAnalysisId: parseInt(analysis.patient_analysis_id),
        file: analysis.uploadFile,
        interpretation: analysis.uploadInterpretation,
      });

      console.log("Upload successful", result);

      setAnalysisItems(prev => 
        prev.map(item => 
          item.patient_analysis_id === analysis.patient_analysis_id 
            ? { 
                ...item, 
                uploading: false, 
                uploadSuccess: true,
                uploadFile: undefined,
                uploadInterpretation: undefined,
              }
            : item
        )
      );

      // Refresh the page after 2 seconds to show the new result
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error: any) {
      console.error("Upload failed", error);
      setAnalysisItems(prev => 
        prev.map(item => 
          item.patient_analysis_id === analysis.patient_analysis_id 
            ? { 
                ...item, 
                uploading: false, 
                uploadError: error.message || "Error al subir el archivo"
              }
            : item
        )
      );
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-6">Resultados de laboratorio</h3>

      {analysisItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No hay análisis registrados para este paciente.</p>
          <p className="text-sm mt-2">
            Los análisis deben ser creados primero a través del sistema de laboratorio.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {analysisItems.map((analysis) => (
            <div 
              key={analysis.patient_analysis_id} 
              className="border border-gray-200 rounded-lg p-4 bg-white"
            >
              <div className="mb-3">
                <h4 className="font-semibold text-gray-800">
                  {analysis.analysis.name}
                </h4>
                <p className="text-sm text-gray-600">
                  Fecha de análisis: {formatDate(analysis.analysis_date)}
                </p>
                {analysis.results_date && (
                  <p className="text-sm text-gray-600">
                    Fecha de resultados: {formatDate(analysis.results_date)}
                  </p>
                )}
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
                    analysis.analysis_status === "SENT"
                      ? "bg-green-100 text-green-800"
                      : analysis.analysis_status === "REQUESTED"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {analysis.analysis_status}
                </span>
              </div>

              {/* Existing Results */}
              {analysis.results && (
                <div className="mb-3 p-3 bg-gray-50 rounded">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Resultado existente:
                  </p>
                  <div className="text-sm text-gray-600 mb-1">
                    <a
                      href={getFullPath(analysis.results.path) || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Ver PDF ({formatDate(analysis.results.date)})
                    </a>
                    {analysis.results.interpretation && (
                      <p className="text-xs mt-1">
                        Interpretación: {analysis.results.interpretation}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Upload Section */}
              <div className="border-t border-gray-200 pt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {analysis.results 
                    ? "Actualizar resultado" 
                    : "Subir resultado"}
                </p>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Archivo PDF
                    </label>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(e) => handleFileSelect(analysis.patient_analysis_id, e.target.files?.[0] || null)}
                      disabled={analysis.uploading}
                      className="text-sm"
                    />
                    {analysis.uploadFile && (
                      <p className="text-xs text-gray-500 mt-1">
                        Seleccionado: {analysis.uploadFile.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Interpretación (opcional)
                    </label>
                    <textarea
                      value={analysis.uploadInterpretation || ""}
                      onChange={(e) => handleInterpretationChange(analysis.patient_analysis_id, e.target.value)}
                      placeholder="Interpretación de los resultados..."
                      rows={2}
                      disabled={analysis.uploading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleUpload(analysis)}
                    disabled={!analysis.uploadFile || analysis.uploading}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      !analysis.uploadFile || analysis.uploading
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    {analysis.uploading ? "Subiendo..." : "Subir PDF"}
                  </button>

                  {analysis.uploadSuccess && (
                    <p className="text-sm text-green-600">
                      ✓ Resultado subido exitosamente
                    </p>
                  )}
                  
                  {analysis.uploadError && (
                    <p className="text-sm text-red-600">
                      ✗ {analysis.uploadError}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LabResultsSection;
