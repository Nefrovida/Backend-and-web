// src/types/labAppointment.ts
import { ANALYSIS_STATUS } from "./Analysis_status";

export interface LabAppointment {
    id: number;
    date: string; // ISO
    status: ANALYSIS_STATUS;
    analysisName: string;
    patientName: string;
    resultURI: string | null;
}