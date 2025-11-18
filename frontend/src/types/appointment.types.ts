export enum TYPE {
    PRESENCIAL ="PRESENCIAL",
    VIRTUAL = "VIRTUAL",
}

export enum STATUS {
    MISSED = "MISSED",
    CANCELED = "CANCELED",
    FINISHED ="FINISHED",
    PROGRAMMED = "PROGRAMMED",
}

export interface Appointment {
    patient_appointment_id: number;
    patient_id: string;
    appointment_id: number;
    date_hour: string;
    duration: number;
    appointment_type: TYPE;
    link: string;
    place: string;
    appointment_status: STATUS;
    patient_name: string;
    patient_last_name: string;
    patient_maternal_last_name: string;
}