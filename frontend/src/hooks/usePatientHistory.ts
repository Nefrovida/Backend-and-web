import { useState, useEffect } from 'react';
import { HistoryRecord } from '../types/history.types';
import { getPatientHistory } from '../services/history.service';

export const usePatientHistory = (patientId: string) => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) return; // No buscar si no hay ID

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await getPatientHistory(patientId);
        setHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [patientId]); // Se ejecuta cada vez que el patientId cambie

  return { history, loading, error };
};