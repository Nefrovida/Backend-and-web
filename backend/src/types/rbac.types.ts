/**
 * Privilege constants - these should match the descriptions in your database
 */
export enum Privilege {
  // User management
  VIEW_USERS = 'VIEW_USERS',
  CREATE_USERS = 'CREATE_USERS',
  UPDATE_USERS = 'UPDATE_USERS',
  DELETE_USERS = 'DELETE_USERS',
  
  // Role management
  VIEW_ROLES = 'VIEW_ROLES',
  CREATE_ROLES = 'CREATE_ROLES',
  UPDATE_ROLES = 'UPDATE_ROLES',
  DELETE_ROLES = 'DELETE_ROLES',
  
  // Privilege management
  VIEW_PRIVILEGES = 'VIEW_PRIVILEGES',
  CREATE_PRIVILEGES = 'CREATE_PRIVILEGES',
  UPDATE_PRIVILEGES = 'UPDATE_PRIVILEGES',
  DELETE_PRIVILEGES = 'DELETE_PRIVILEGES',
  
  // Patient management
  VIEW_PATIENTS = 'VIEW_PATIENTS',
  CREATE_PATIENTS = 'CREATE_PATIENTS',
  UPDATE_PATIENTS = 'UPDATE_PATIENTS',
  DELETE_PATIENTS = 'DELETE_PATIENTS',
  
  // Appointment management
  VIEW_APPOINTMENTS = 'VIEW_APPOINTMENTS',
  CREATE_APPOINTMENTS = 'CREATE_APPOINTMENTS',
  UPDATE_APPOINTMENTS = 'UPDATE_APPOINTMENTS',
  DELETE_APPOINTMENTS = 'DELETE_APPOINTMENTS',
  
  // Analysis management
  VIEW_ANALYSIS = 'VIEW_ANALYSIS',
  CREATE_ANALYSIS = 'CREATE_ANALYSIS',
  UPDATE_ANALYSIS = 'UPDATE_ANALYSIS',
  DELETE_ANALYSIS = 'DELETE_ANALYSIS',
  
  // Forum management
  VIEW_FORUMS = 'VIEW_FORUMS',
  CREATE_FORUMS = 'CREATE_FORUMS',
  UPDATE_FORUMS = 'UPDATE_FORUMS',
  DELETE_FORUMS = 'DELETE_FORUMS',
}

/**
 * Request with authenticated user
 */
export interface AuthenticatedRequest {
  user?: {
    userId: string;
    roleId: number;
    privileges: string[];
  };
}
