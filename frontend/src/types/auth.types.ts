export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export interface RegisterData {
  // Basic user info
  name: string;
  parent_last_name: string;
  maternal_last_name?: string;
  phone_number: string;
  username: string;
  password: string;
  birthday: string;
  gender: Gender;
  role_id?: number;

  // Patient-specific fields
  curp?: string;

  // Doctor-specific fields
  specialty?: string;
  license?: string;

  // Familiar-specific fields
  patient_curp?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    user_id: string;
    name: string;
    username: string;
    role_id: number;
  };
}

export interface LoginData {
  username: string;
  password: string;
}

// NOTE: these IDs should match the IDs in the database `roles` table (see seed.sql)
// Keep values in sync with backend.DEFAULT_ROLES / roles table.
export const ROLE_IDS = {
  ADMIN: 1,
  SECRETARIA: 2,
  DOCTOR: 3,
  PATIENT: 4,
  LABORATORIST: 5,
  FAMILIAR: 6,
} as const;

export const ROLE_NAMES = {
  [ROLE_IDS.ADMIN]: "Administrador",
  [ROLE_IDS.SECRETARIA]: "Secretaria",
  [ROLE_IDS.DOCTOR]: "Doctor",
  [ROLE_IDS.PATIENT]: "Paciente",
  [ROLE_IDS.LABORATORIST]: "Laboratorista",
  [ROLE_IDS.FAMILIAR]: "Familiar",
} as const;
