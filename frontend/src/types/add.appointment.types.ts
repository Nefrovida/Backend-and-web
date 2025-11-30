
export interface AppointmentTypeResponse {
  appointmentId: number;
  doctorId: string;
  name: string;
  cost: number;
  communityCost?: number;
  imageUrl: string;
}

// Datos para crear un tipo de cita
export interface CreateAppointmentTypeData {
  name: string;
  description: string;
  cost: number;
  communityCost?: number;
}

// Datos para actualizar un tipo de cita
export interface UpdateAppointmentTypeData {
  name?: string;
  description?: string;
  cost?: number;
  communityCost?: number;
  active?: boolean;
}