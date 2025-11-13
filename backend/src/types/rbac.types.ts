/**
 * RBAC (Role-Based Access Control) Types
 * 
 * Define los privilegios del sistema que se asignan a roles.
 * Debe sincronizarse con la tabla `privileges` en la base de datos.
 */

export enum Privilege {
  // Gestión de Usuarios
  CREATE_USER = 'Crear usuario',
  EDIT_USER = 'Editar usuario',
  DELETE_USER = 'Eliminar usuario',
  
  // Gestión de Foros
  CREATE_FORUMS = 'Crear foros',
  VIEW_FORUMS = 'Ver foros',
  UPDATE_FORUMS = 'Actualizar foros',
  DELETE_FORUMS = 'Eliminar foros',
  MANAGE_FORUMS = 'Administrar foros', // Privilegio legacy del seed
  
  // Reportes
  VIEW_REPORTS = 'Ver reportes',
  
  // Citas Médicas
  ASSIGN_APPOINTMENTS = 'Asignar citas',
}

/**
 * Helper function to check if a user has a specific privilege
 */
export function hasPrivilege(
  userPrivileges: string[],
  requiredPrivilege: Privilege
): boolean {
  return userPrivileges.includes(requiredPrivilege);
}

/**
 * Helper function to check if a user has any of the required privileges
 */
export function hasAnyPrivilege(
  userPrivileges: string[],
  requiredPrivileges: Privilege[]
): boolean {
  return requiredPrivileges.some(privilege => 
    userPrivileges.includes(privilege)
  );
}

/**
 * Helper function to check if a user has all required privileges
 */
export function hasAllPrivileges(
  userPrivileges: string[],
  requiredPrivileges: Privilege[]
): boolean {
  return requiredPrivileges.every(privilege => 
    userPrivileges.includes(privilege)
  );
}
