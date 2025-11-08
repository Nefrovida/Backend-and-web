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
  speciality?: string;
  license?: string;
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

export const ROLE_IDS = {
  PATIENT: 1,
  DOCTOR: 2,
  LABORATORIST: 3,
  ADMIN: 4,
} as const;

export const ROLE_NAMES = {
  [ROLE_IDS.PATIENT]: "Paciente",
  [ROLE_IDS.DOCTOR]: "Doctor",
  [ROLE_IDS.LABORATORIST]: "Laboratorista",
  [ROLE_IDS.ADMIN]: "Administrador",
} as const;
