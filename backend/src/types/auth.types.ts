import { Gender } from '../../prisma/database/prisma/enums';

/**
 * JWT Payload structure
 */
export interface JwtPayload {
  userId: string;
  roleId: number;
  privileges: string[];
}

/**
 * Login request DTO
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Register request DTO
 */
export interface RegisterRequest {
  name: string;
  parent_last_name: string;
  maternal_last_name?: string;
  phone_number: string;
  username: string;
  password: string;
  birthday: Date;
  gender: Gender;
  role_id?: number;
  
  // Patient-specific fields
  curp?: string;
  
  // Doctor-specific fields
  speciality?: string;
  license?: string;
  
  // Familiar-specific fields (Note: familiars are not a role, but users with patient associations)
  patient_id?: string;
}

/**
 * Auth response DTO
 */
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
