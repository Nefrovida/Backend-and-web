/**
 * RBAC (Role-Based Access Control) Middleware
 * 
 * Valida que el usuario autenticado tenga los privilegios necesarios
 * para acceder a un endpoint
 */

import { Request, Response, NextFunction } from 'express';
import { Privilege } from '../types/rbac.types';

/**
 * Middleware factory para requerir privilegios específicos
 * 
 * @param requiredPrivileges - Lista de privilegios, el usuario debe tener AL MENOS UNO
 * @returns Middleware de Express que valida privilegios
 * 
 * @example
 * router.post('/forums', 
 *   authenticate, 
 *   requirePrivileges(Privilege.CREATE_FORUMS),
 *   controller.create
 * );
 */
export function requirePrivileges(...requiredPrivileges: Privilege[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // 1. Verificar que el usuario esté autenticado
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Debe estar autenticado para acceder a este recurso',
      });
      return;
    }

    // 2. Extraer privilegios del usuario
    const userPrivileges = req.user.role.role_privileges.map(
      (rp) => rp.privilege.description
    );

    // 3. Verificar si el usuario tiene AL MENOS UNO de los privilegios requeridos
    const hasRequiredPrivilege = requiredPrivileges.some((privilege) =>
      userPrivileges.includes(privilege)
    );

    if (!hasRequiredPrivilege) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'No tiene permisos suficientes para realizar esta acción',
        required: requiredPrivileges,
      });
      return;
    }

    // 4. Usuario autorizado, continuar
    next();
  };
}

/**
 * Middleware para requerir TODOS los privilegios especificados
 * 
 * @param requiredPrivileges - Lista de privilegios, el usuario debe tener TODOS
 */
export function requireAllPrivileges(...requiredPrivileges: Privilege[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Debe estar autenticado para acceder a este recurso',
      });
      return;
    }

    const userPrivileges = req.user.role.role_privileges.map(
      (rp) => rp.privilege.description
    );

    // Verificar que el usuario tenga TODOS los privilegios requeridos
    const hasAllPrivileges = requiredPrivileges.every((privilege) =>
      userPrivileges.includes(privilege)
    );

    if (!hasAllPrivileges) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'No tiene todos los permisos necesarios',
        required: requiredPrivileges,
      });
      return;
    }

    next();
  };
}

/**
 * Middleware para verificar si el usuario es el owner de un recurso
 * O tiene privilegios de administración
 * 
 * @param getOwnerId - Función que extrae el owner_id del recurso
 * @param adminPrivilege - Privilegio que otorga acceso como admin
 */
export function requireOwnershipOrPrivilege(
  getOwnerId: (req: Request) => Promise<string | null>,
  adminPrivilege: Privilege
) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'Debe estar autenticado',
        });
        return;
      }

      // Verificar si es el owner
      const ownerId = await getOwnerId(req);
      const isOwner = ownerId === req.user.user_id;

      if (isOwner) {
        next();
        return;
      }

      // Si no es owner, verificar privilegio de admin
      const userPrivileges = req.user.role.role_privileges.map(
        (rp) => rp.privilege.description
      );

      const hasAdminPrivilege = userPrivileges.includes(adminPrivilege);

      if (!hasAdminPrivilege) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'Solo el creador o administradores pueden modificar este recurso',
        });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
