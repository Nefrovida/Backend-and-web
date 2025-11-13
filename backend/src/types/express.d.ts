/**
 * Express Type Extensions
 * 
 * Extiende los tipos de Express para incluir propiedades personalizadas
 * como el usuario autenticado en req.user
 */

// Importar tipos de modelos generados por Prisma Client
import type { usersModel } from '../../prisma/database/prisma/models/users';
import type { rolesModel } from '../../prisma/database/prisma/models/roles';
import type { privilegesModel } from '../../prisma/database/prisma/models/privileges';

declare global {
  namespace Express {
    /**
     * Usuario autenticado con su rol y privilegios cargados
     * Disponible después del middleware authenticate()
     */
    interface Request {
      user?: usersModel & {
        role: rolesModel & {
          role_privileges: Array<{
            privilege: privilegesModel;
          }>;
        };
      };
    }
  }
}

export {};
