import { Privilege } from '../types/rbac.types';

/**
 * Default role IDs that correspond to the roles stored in the database.
 * These constants help avoid hardcoding magic numbers in the code and improve readability.
 * The IDs should match the role_id values in the 'roles' table (e.g., PATIENT = 1, DOCTOR = 2, etc.).
 * Use these constants instead of raw numbers when referencing roles in your application logic.
 */
// Role IDs should reflect the actual ordering in the database seed file.
export const DEFAULT_ROLES = {
  ADMIN: 1,
  DOCTOR: 2,
  PATIENT: 3,
  LABORATORIST: 4,
  FAMILIAR: 5,
  SECRETARIA: 6,
} as const;

/**
 * Re-export the Privilege enum for easy access throughout the application.
 * This enum defines all possible privileges (e.g., VIEW_USERS, CREATE_PATIENTS) that can be assigned to roles
 * via the role_privilege table in the database. It ensures consistency when checking or assigning permissions
 * in your RBAC (Role-Based Access Control) system.
 */
export { Privilege };

// Password policy regex: at least 8 chars, one uppercase, one digit and one special char
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*\-]).{8,}$/;

// Bcrypt salt rounds: can be overridden by env var BCRYPT_ROUNDS
export const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 10;

/**
 * Re-export the UserStatus enum for tracking user approval state.
 * PENDING - User registered but awaiting admin approval
 * APPROVED - User has been approved by an admin and can access the platform
 * REJECTED - User registration was rejected by an admin
 */
export { UserStatus } from '@prisma/client';