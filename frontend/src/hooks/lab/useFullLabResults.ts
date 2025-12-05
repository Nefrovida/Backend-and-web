// frontend/src/hooks/lab/useFullLabResults.ts
import { useEffect, useState, useCallback } from "react";
import { patientFullResultsApi } from "@/services/lab/results.service";

export default function useFullLabResults(patient_analysis_id: string) {
  // variables for full results and user
  const [results, setResults] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // variables for the pdf results document to render
  const [pdf, setPdf] = useState<string | null>(null);
  const [pdfIsLoading, setPdfIsLoading] = useState(false);
  const [pdfError, setPdfError] = useState("");

  const loadPatientFullResults = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setPdfIsLoading(true);
      setError("");
      setPdf(null);
      setPdfError("");

      const res = await patientFullResultsApi(Number(id));

      if (res.success && res.data) {
        // datos principales
        setResults(res.data.results);
        setUser(res.data.user);
        setAnalysis(res.data.analysis);
        setError("");

        // aquí usamos directamente la ruta del PDF que viene del backend
        const pdfPath = res.data.results?.path || null;
        setPdf(pdfPath);
      } else {
        setError("Request for patient results failed");
      }
    } catch (err: any) {
      console.log("error getting patient lab results: ", err);
      setError(err?.message || "Failed to load patient results");
      setPdfError(err?.message || "Failed to load PDF");
      setPdf(null);
    } finally {
      setIsLoading(false);
      setPdfIsLoading(false);
    }
  }, []);

  // limpiar PDF cuando cambia el id
  useEffect(() => {
    setPdf(null);
    setPdfError("");
  }, [patient_analysis_id]);

  // cargar resultados completos al montar y cuando cambie el id
  useEffect(() => {
    if (patient_analysis_id) {
      loadPatientFullResults(patient_analysis_id);
    }
  }, [patient_analysis_id, loadPatientFullResults]);

  // Refresh function to reload all data
  const refresh = useCallback(() => {
    if (patient_analysis_id) {
      setPdf(null);
      setPdfError("");
      loadPatientFullResults(patient_analysis_id);
    }
  }, [patient_analysis_id, loadPatientFullResults]);

  return {
    results,
    user,
    analysis,
    error,
    isLoading,
    pdf,
    pdfIsLoading,
    pdfError,
    loadPatientFullResults,
    refresh,
  };
}