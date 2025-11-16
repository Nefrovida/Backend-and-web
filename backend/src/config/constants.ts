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
  SECRETARIA: 6,
  DOCTOR: 3,
  PATIENT: 4,
  LABORATORIST: 5,
  FAMILIAR: 2,
} as const;

/**
 * Re-export the Privilege enum for easy access throughout the application.
 * This enum defines all possible privileges (e.g., VIEW_USERS, CREATE_PATIENTS) that can be assigned to roles
 * via the role_privilege table in the database. It ensures consistency when checking or assigning permissions
 * in your RBAC (Role-Based Access Control) system.
 */
export { Privilege };