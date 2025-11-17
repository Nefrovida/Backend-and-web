export type AppointmentRecord = {
   patient_appointment_id: number;  
   date_hour: Date;  
   duration: number;
   link: string | null;
   place: string | null;
   appointment_type: string;
   appointment_status: string;  
   name: string | null; 
   appointment_name: string;
};