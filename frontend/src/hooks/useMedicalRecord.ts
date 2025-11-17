import { useState, useEffect } from "react";
import { MedicalRecordData } from "../types/expediente.types";
import { expedienteService } from "../services/expediente.service";

export const useMedicalRecord = (patientId: string | undefined) => {
  const [data, setData] = useState<MedicalRecordData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) return;

    const fetchMedicalRecord = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await expedienteService.getMedicalRecord(patientId);
        setData(result);
      } catch (err: any) {
        setError(err.message || "Error al cargar el expediente");
        console.error("Error fetching medical record:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecord();
  }, [patientId]);

  const refetch = async () => {
    if (!patientId) return;

    try {
      setLoading(true);
      setError(null);
      const result = await expedienteService.getMedicalRecord(patientId);
      setData(result);
    } catch (err: any) {
      setError(err.message || "Error al cargar el expediente");
      console.error("Error fetching medical record:", err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};
