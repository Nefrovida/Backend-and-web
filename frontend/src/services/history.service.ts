import { PatientHistoryResponse } from '../types/history.types';

// Port 3000 is the back-end standard
const API_URL = 'http://localhost:3000/api'; 

export const getPatientHistory = async (patientId: string): Promise<PatientHistoryResponse> => {
  // Use fetch, the same as in auth.service.ts
  const response = await fetch(`${API_URL}/history/${patientId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Add the doctor's auth token
      // 'Authorization': `Bearer ${token}` 
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener el historial del paciente');
  }

  return response.json();
};
