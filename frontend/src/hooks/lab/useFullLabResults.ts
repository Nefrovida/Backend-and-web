import { useEffect, useState, useCallback } from "react";
import { patientFullResultsApi, resultsPDFApi } from "@/services/lab/results.service";


export default function useFullLabResults(
  patient_analysis_id: string
) {
  // variables for full results and user
  const [results, setResults] = useState<any>(null);
  // const [hadResults, setHadResults] = useState(false);
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
      // console.log("attempting to get full lab restuls:")
      setIsLoading(true);
      setError("");
      // Clear PDF when loading new results
      setPdf(null);
      setPdfError("");
      
      const res = await patientFullResultsApi(Number(id));
      
      if (res.success && res.data) {
        setResults(res.data.results);
        setUser(res.data.user);
        setAnalysis(res.data.analysis);
        setError("");
      } else {
        setError("Request for patient results failed");
      }
    } catch (err: any) {
      console.log("error getting patient lab results: ", err);
      setError(err?.message || "Failed to load patient results");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getResultsPDFFile = useCallback(async (results_id: number) => {
    try {
      setPdfIsLoading(true);
      setPdfError("");
      setPdf(null);
      
      const pdfUrl = await resultsPDFApi(results_id);
      setPdf(pdfUrl);
    } catch (err: any) {
      console.log("error getting results document for patient analysis ", err);
      setPdfError(err?.message || "Failed to load PDF");
      setPdf(null);
    } finally {
      setPdfIsLoading(false);
    }
  }, []);

  // Clear PDF when patient_analysis_id changes
  useEffect(() => {
    setPdf(null);
    setPdfError("");
  }, [patient_analysis_id]);

  // Load patient full results on mount and when patient_analysis_id changes
  useEffect(() => {
    if (patient_analysis_id) {
      loadPatientFullResults(patient_analysis_id);
    }
  }, [patient_analysis_id, loadPatientFullResults]);

  // Load PDF only once results, analysis, and user are all available
  useEffect(() => {
    if (results && analysis && user && results.result_id) {
      getResultsPDFFile(results.result_id);
    }
  }, [results, analysis, user, getResultsPDFFile]);

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
    // hadResults,
    user,
    analysis,
    error,
    isLoading,
    pdf,
    pdfIsLoading,
    pdfError,
    loadPatientFullResults,
    getResultsPDFFile,
    refresh
  }
};