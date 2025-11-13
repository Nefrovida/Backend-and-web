/**
 * Forums Routes
 * 
 * Define las rutas para la gestión de foros con sus middlewares de autenticación y autorización
 */

import { Router } from 'express';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware';
import { requirePrivileges } from '../middleware/rbac.middleware';
import { Privilege } from '../types/rbac.types';
import * as forumsController from '../controller/forums.controller';

const router = Router();

/**
 * POST /api/forums
 * Crea un nuevo foro
 * 
 * Requiere:
 * - Autenticación (JWT)
 * - Privilegio: CREATE_FORUMS
 */
router.post(
  '/',
  authenticate,
  requirePrivileges(Privilege.CREATE_FORUMS),
  forumsController.createForum
);

/**
 * GET /api/forums
 * Lista todos los foros con paginación
 * 
 * Autenticación opcional:
 * - Si está autenticado: ve foros PUBLIC + sus foros PRIVATE (creados o miembro)
 * - Si NO está autenticado: solo ve foros PUBLIC
 */
router.get(
  '/',
  optionalAuthenticate,
  forumsController.getForums
);

/**
 * GET /api/forums/:id
 * Obtiene un foro por ID
 * 
 * Autenticación opcional:
 * - Foros PUBLIC: accesibles sin autenticación
 * - Foros PRIVATE: requiere ser miembro, creador o tener MANAGE_FORUMS
 */
router.get(
  '/:id',
  optionalAuthenticate,
  forumsController.getForumById
);

/**
 * PATCH /api/forums/:id
 * Actualiza la visibilidad de un foro
 * 
 * Requiere:
 * - Autenticación (JWT)
 * - Ser el creador del foro O tener privilegio UPDATE_FORUMS/MANAGE_FORUMS
 */
router.patch(
  '/:id',
  authenticate,
  requirePrivileges(Privilege.UPDATE_FORUMS, Privilege.MANAGE_FORUMS),
  forumsController.updateForum
);

/**
 * DELETE /api/forums/:id
 * Elimina un foro
 * 
 * Requiere:
 * - Autenticación (JWT)
 * - Ser el creador del foro O tener privilegio DELETE_FORUMS/MANAGE_FORUMS
 */
router.delete(
  '/:id',
  authenticate,
  requirePrivileges(Privilege.DELETE_FORUMS, Privilege.MANAGE_FORUMS),
  forumsController.deleteForum
);

/**
 * POST /api/forums/:id/members
 * Agrega un miembro a un foro PRIVATE
 * 
 * Requiere:
 * - Autenticación (JWT)
 * - Ser el creador del foro O tener privilegio MANAGE_FORUMS
 * 
 * Body: { userId: string }
 */
router.post(
  '/:id/members',
  authenticate,
  requirePrivileges(Privilege.MANAGE_FORUMS),
  forumsController.addMember
);

/**
 * DELETE /api/forums/:id/members/:userId
 * Remueve un miembro de un foro
 * 
 * Requiere:
 * - Autenticación (JWT)
 * - Ser el creador del foro O tener privilegio MANAGE_FORUMS
 */
router.delete(
  '/:id/members/:userId',
  authenticate,
  requirePrivileges(Privilege.MANAGE_FORUMS),
  forumsController.removeMember
);

export default router;
