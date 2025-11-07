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
  user: string;
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
  user: string;
  password: string;
  birthday: Date;
  gender: Gender;
  role_id?: number;
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
    user: string;
    role_id: number;
  };
}
