import { PatientHistoryResponse } from '../types/history.types';

// El puerto 3000 es el estándar del backend
const API_URL = 'http://localhost:3000/api'; 

export const getPatientHistory = async (patientId: string): Promise<PatientHistoryResponse> => {
  // Usamos fetch, igual que auth.service.ts
  const response = await fetch(`${API_URL}/history/${patientId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Aquí necesitarás añadir el token de autenticación del doctor
      // 'Authorization': `Bearer ${token}` 
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener el historial del paciente');
  }

  return response.json();
};