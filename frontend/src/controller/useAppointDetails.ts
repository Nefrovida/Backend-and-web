import { useState, useEffect } from 'react';
import { AppointmentData } from '../types/appointment.types';
import { getDetailledAppointment } from '../services/appointment.service';

''
export const useAppointmentDeatils = (AppoiID: string | null) => {
  
  const [appointment, setAppointment] = useState<AppointmentData | null>(null);
  
 
  const [loading, setLoading] = useState(false);
  

  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    if (!AppoiID) return; 

    const uploadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getDetailledAppointment(AppoiID);
        setAppointment(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    uploadData();
  }, [AppoiID]); 

  
  return { appointment, loading, error };
};