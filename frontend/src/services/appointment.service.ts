import { AppointmentData, PatientInfo } from '../types/appointment.types';


const API_URL = 'http://localhost:3000/api'; 

/**
 * Calls bacckend for getting detailed info about an appointment by its ID.
 */
export const getDetailledAppointment = async (AppoiID: string): Promise<AppointmentData> => {
  const token = localStorage.getItem('token'); 

  try {
    const response = await fetch(`${API_URL}/appointments/${AppoiID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})); 
      const errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    
    const data: AppointmentData = await response.json();
    return data; 
  } catch (error) {
    console.error("There has been an error obtaining the data:", error);
    throw error;
  }

};

export const getPatientInfo = async (idPaciente: string): Promise<PatientInfo> => {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_URL}/pacientes/${idPaciente}`, {
            method : 'GET', 
             headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})); 
      const errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    
    const data: PatientInfo = await response.json();
    return data; 

  } catch (error) {
    console.error("There has been an error obtaining the data:", error);
    throw error;
  }


};