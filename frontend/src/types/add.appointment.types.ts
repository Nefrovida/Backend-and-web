export interface AppointmentTypeResponse {
  appointmentId: number;
  doctorId: string;
  name: string;
  cost: number;
  communityCost?: number;
  imageUrl: string;
}

export interface CreateAppointmentTypeData {
  doctorId: string;
  name: string;
  cost: number;
  communityCost?: number;
  imageUrl?: string;
}

export interface UpdateAppointmentTypeData {
  appointmentId: number;
  doctorId: string;
  name: string;
  cost: number;
  communityCost?: number;
  imageUrl?: string;
}